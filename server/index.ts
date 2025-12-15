import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

interface Player {
  id: string;
  name: string;
  color: string;
  pieces: PiecePosition[];
  isReady: boolean;
}

interface PiecePosition {
  position: number;
  isFinished: boolean;
}

interface Room {
  code: string;
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  gameStarted: boolean;
  winner: string | null;
}

const rooms: Map<string, Room> = new Map();
const PLAYER_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
const PIECES_PER_PLAYER = 4;
const BOARD_SPACES = 52;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', ({ roomCode, playerName }) => {
    const room: Room = {
      code: roomCode,
      players: [{
        id: socket.id,
        name: playerName,
        color: PLAYER_COLORS[0],
        pieces: Array(PIECES_PER_PLAYER).fill(null).map(() => ({ position: -1, isFinished: false })),
        isReady: false,
      }],
      currentPlayerIndex: 0,
      diceValue: null,
      gameStarted: false,
      winner: null,
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    
    socket.emit('roomJoined', { playerId: socket.id, roomCode });
    io.to(roomCode).emit('gameState', {
      players: room.players,
      currentPlayerIndex: room.currentPlayerIndex,
      diceValue: room.diceValue,
      gameStarted: room.gameStarted,
      winner: room.winner,
    });

    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Phòng không tồn tại' });
      return;
    }

    if (room.players.length >= 8) {
      socket.emit('error', { message: 'Phòng đã đầy' });
      return;
    }

    if (room.gameStarted) {
      socket.emit('error', { message: 'Trò chơi đã bắt đầu' });
      return;
    }

    const newPlayer: Player = {
      id: socket.id,
      name: playerName,
      color: PLAYER_COLORS[room.players.length],
      pieces: Array(PIECES_PER_PLAYER).fill(null).map(() => ({ position: -1, isFinished: false })),
      isReady: false,
    };

    room.players.push(newPlayer);
    socket.join(roomCode);
    
    socket.emit('roomJoined', { playerId: socket.id, roomCode });
    io.to(roomCode).emit('playerJoined', newPlayer);
    io.to(roomCode).emit('gameState', {
      players: room.players,
      currentPlayerIndex: room.currentPlayerIndex,
      diceValue: room.diceValue,
      gameStarted: room.gameStarted,
      winner: room.winner,
    });

    console.log(`${playerName} joined room ${roomCode}`);
  });

  socket.on('toggleReady', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.isReady = !player.isReady;
      io.to(roomCode).emit('gameState', {
        players: room.players,
        currentPlayerIndex: room.currentPlayerIndex,
        diceValue: room.diceValue,
        gameStarted: room.gameStarted,
        winner: room.winner,
      });
    }
  });

  socket.on('startGame', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    if (room.players.length < 2) return;
    if (!room.players.every(p => p.isReady)) return;

    room.gameStarted = true;
    io.to(roomCode).emit('gameStarted');
    io.to(roomCode).emit('gameState', {
      players: room.players,
      currentPlayerIndex: room.currentPlayerIndex,
      diceValue: room.diceValue,
      gameStarted: room.gameStarted,
      winner: room.winner,
    });

    console.log(`Game started in room ${roomCode}`);
  });

  socket.on('rollDice', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || !room.gameStarted) return;

    const currentPlayer = room.players[room.currentPlayerIndex];
    if (currentPlayer.id !== socket.id) return;

    const diceValue = Math.floor(Math.random() * 6) + 1;
    room.diceValue = diceValue;

    io.to(roomCode).emit('diceRolled', { playerId: socket.id, value: diceValue });
    io.to(roomCode).emit('gameState', {
      players: room.players,
      currentPlayerIndex: room.currentPlayerIndex,
      diceValue: room.diceValue,
      gameStarted: room.gameStarted,
      winner: room.winner,
    });
  });

  socket.on('movePiece', ({ roomCode, pieceIndex }) => {
    const room = rooms.get(roomCode);
    if (!room || !room.gameStarted || room.diceValue === null) return;

    const currentPlayer = room.players[room.currentPlayerIndex];
    if (currentPlayer.id !== socket.id) return;

    const piece = currentPlayer.pieces[pieceIndex];
    const startPositions = [0, 13, 26, 39, 6, 19, 32, 45];

    // Move piece logic
    if (piece.position === -1 && room.diceValue === 6) {
      piece.position = startPositions[room.currentPlayerIndex];
    } else if (piece.position >= 0 && !piece.isFinished) {
      piece.position += room.diceValue;
      
      if (piece.position >= BOARD_SPACES) {
        const finishPosition = piece.position - BOARD_SPACES;
        if (finishPosition < PIECES_PER_PLAYER) {
          piece.position = BOARD_SPACES + finishPosition;
          piece.isFinished = true;
        } else {
          // Bounce back
          piece.position = BOARD_SPACES - (finishPosition - PIECES_PER_PLAYER);
        }
      }

      // Check for capturing other pieces
      room.players.forEach((player, playerIndex) => {
        if (playerIndex !== room.currentPlayerIndex) {
          player.pieces.forEach(otherPiece => {
            if (otherPiece.position === piece.position && otherPiece.position >= 0 && !otherPiece.isFinished) {
              otherPiece.position = -1; // Send back home
            }
          });
        }
      });
    }

    // Check for winner
    const allFinished = currentPlayer.pieces.every(p => p.isFinished);
    if (allFinished) {
      room.winner = currentPlayer.name;
      io.to(roomCode).emit('gameState', {
        players: room.players,
        currentPlayerIndex: room.currentPlayerIndex,
        diceValue: room.diceValue,
        gameStarted: room.gameStarted,
        winner: room.winner,
      });
      return;
    }

    // Move to next player (unless rolled a 6)
    if (room.diceValue !== 6) {
      room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
    }
    
    room.diceValue = null;

    io.to(roomCode).emit('gameState', {
      players: room.players,
      currentPlayerIndex: room.currentPlayerIndex,
      diceValue: room.diceValue,
      gameStarted: room.gameStarted,
      winner: room.winner,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from all rooms
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        } else {
          io.to(roomCode).emit('gameState', {
            players: room.players,
            currentPlayerIndex: room.currentPlayerIndex,
            diceValue: room.diceValue,
            gameStarted: room.gameStarted,
            winner: room.winner,
          });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🎲 Cờ Cá Ngựa Server running on port ${PORT}`);
});
