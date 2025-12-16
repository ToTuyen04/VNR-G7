import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove, update, get } from 'firebase/database';
import { QUESTION_POOL } from '../../data/questions';

interface Player {
  id: string;
  name: string;
  color: string;
  pieces: PiecePosition[];
  isReady: boolean;
  team?: number; // Team 1, 2, 3, or 4
  questionsAnswered?: number; // Number of questions answered
  correctAnswers?: number; // Number of correct answers
  wrongAnswers?: number; // Number of wrong answers
  startTime?: number; // Timestamp when player started answering questions
  finishTime?: number; // Timestamp when player completed all questions
}

interface PiecePosition {
  position: number; // -1 = home, 0-51 = board, 52+ = finish
  isFinished: boolean;
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  gameStarted: boolean;
  winner: string | null;
  currentQuestion?: {
    playerId: string;
    question: string;
    options: string[];
    correctAnswer: number;
    questionNumber: number;
    isRetry?: boolean;
  } | null;
  teamScores?: { [key: number]: number }; // Team scores
  gameStartTime?: number; // Timestamp when game started
  gameEndTime?: number; // Timestamp when game ended
  timeLimit?: number; // Time limit in milliseconds (10 minutes)
}

interface CoCaNguaGameProps {
  onBack: () => void;
}

const PLAYER_COLORS = [
  '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#DC2626', '#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777', '#0D9488', '#EA580C',
  '#B91C1C', '#1D4ED8', '#047857', '#B45309', '#6D28D9', '#BE185D', '#0F766E', '#C2410C',
  '#991B1B', '#1E40AF', '#065F46', '#92400E', '#5B21B6', '#9F1239', '#134E4A', '#9A3412',
  '#7F1D1D', '#1E3A8A', '#064E3B', '#78350F', '#4C1D95', '#831843', '#115E59', '#7C2D12'
];
const QUESTIONS_PER_PLAYER = 10;
const PIECES_PER_PLAYER = 4;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdS2P5PiRST5kZBDZ3rnacQAvgAGvdfkk",
  authDomain: "laazytestground.firebaseapp.com",
  databaseURL: "https://laazytestground-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "laazytestground",
  storageBucket: "laazytestground.firebasestorage.app",
  messagingSenderId: "434377008546",
  appId: "1:434377008546:web:0c548dad6aee8419dcfefb"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const CoCaNguaGame = ({ onBack }: CoCaNguaGameProps) => {
  const [roomCode, setRoomCode] = useState('');
  const [myPlayerId, setMyPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(600); // 10 minutes in seconds
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    gameStarted: false,
    winner: null,
  });


  // Room reference
  const roomRef = roomCode ? ref(database, `rooms/${roomCode}`) : null;

  // Game timer countdown
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameEndTime) return;

    const interval = setInterval(() => {
      if (gameState.gameStartTime) {
        const elapsed = Date.now() - gameState.gameStartTime;
        const timeLimit = gameState.timeLimit || 600000; // 10 minutes
        const remaining = Math.max(0, Math.floor((timeLimit - elapsed) / 1000));
        setRemainingTime(remaining);

        if (remaining <= 0 && isHost) {
          // Time's up - end game
          endGame();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.gameStarted, gameState.gameStartTime, gameState.gameEndTime, isHost]);

  // Listen to room changes
  useEffect(() => {
    if (!roomCode || !isInRoom) return;

    const roomDbRef = ref(database, `rooms/${roomCode}`);
    
    const unsubscribe = onValue(roomDbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log('🔄 Room data updated:', data);
        setGameState(data.gameState || gameState);
      } else {
        console.log('⚠️ Room no longer exists');
        if (!isHost) {
          alert('Phòng đã bị đóng!');
          setIsInRoom(false);
        }
      }
    });

    return () => {
      unsubscribe();
      if (isHost && roomCode) {
        // Host cleans up room on unmount
        remove(ref(database, `rooms/${roomCode}`)).catch(console.error);
      }
    };
  }, [roomCode, isInRoom, isHost]);

  const updateGameState = async (newState: GameState) => {
    if (!roomCode) return;
    
    try {
      await update(ref(database, `rooms/${roomCode}`), {
        gameState: newState
      });
      console.log('✅ Game state updated');
    } catch (error) {
      console.error('❌ Error updating game state:', error);
    }
  };

  const createRoom = async () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên của bạn!');
      return;
    }

    // Generate room code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const playerId = `player_${Date.now()}`;
    
    console.log('🏠 Creating room with code:', code);

    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      color: PLAYER_COLORS[0],
      pieces: Array(PIECES_PER_PLAYER).fill(null).map(() => ({ position: -1, isFinished: false })),
      isReady: false,
    };

    const initialState = {
      players: [newPlayer],
      currentPlayerIndex: 0,
      diceValue: null,
      gameStarted: false,
      winner: null,
    };

    try {
      // Save room data
      await set(ref(database, `rooms/${code}`), {
        gameState: initialState
      });
      
      // Update local state after successful save
      setRoomCode(code);
      setMyPlayerId(playerId);
      setIsHost(true);
      setIsInRoom(true);
      setGameState(initialState);
      
      console.log('✅ Room created successfully:', code);
    } catch (error) {
      console.error('❌ Error creating room:', error);
      alert('Lỗi khi tạo phòng! Vui lòng thử lại.');
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      alert('Vui lòng nhập tên và mã phòng!');
      return;
    }

    const playerId = `player_${Date.now()}`;
    setMyPlayerId(playerId);
    
    try {
      // Check if room exists
      if (!roomRef) {
        alert('Vui lòng nhập mã phòng!');
        return;
      }
      const roomSnapshot = await get(roomRef);
      if (!roomSnapshot.exists()) {
        alert('Phòng không tồn tại! Vui lòng kiểm tra lại mã phòng.');
        return;
      }

      const roomData = roomSnapshot.val();
      const currentState = roomData.gameState;
      
      if (!currentState || !currentState.players) {
        alert('Dữ liệu phòng không hợp lệ!');
        return;
      }
      
      if (currentState.players.length >= 40) {
        alert('Phòng đã đầy! (Tối đa 40 người chơi)');
        return;
      }

      if (currentState.gameStarted) {
        alert('Game đã bắt đầu! Không thể tham gia.');
        return;
      }

      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        color: PLAYER_COLORS[currentState.players.length],
        pieces: Array(PIECES_PER_PLAYER).fill(null).map(() => ({ position: -1, isFinished: false })),
        isReady: false,
      };

      const updatedState = {
        ...currentState,
        players: [...currentState.players, newPlayer],
      };

      if (roomRef) {
        await set(roomRef, { gameState: updatedState });
      }
      setIsInRoom(true);
      setGameState(updatedState);
      console.log('✅ Joined room:', roomCode);
    } catch (error) {
      console.error('❌ Error joining room:', error);
      alert('Lỗi khi tham gia phòng! Vui lòng thử lại.');
    }
  };

  const toggleReady = () => {
    setGameState((prev) => {
      const updatedState = {
        ...prev,
        players: prev.players.map((p) =>
          p.id === myPlayerId ? { ...p, isReady: !p.isReady } : p
        ),
      };
      updateGameState(updatedState);
      return updatedState;
    });
  };

  const startGame = () => {
    if (gameState.players.length < 2) {
      alert('Cần ít nhất 2 người chơi để bắt đầu!');
      return;
    }

    if (isHost) {
      setGameState((prev) => {
        // Randomize and assign teams
        const shuffledPlayers = [...prev.players].sort(() => Math.random() - 0.5);
        const playersPerTeam = Math.ceil(shuffledPlayers.length / 4);
        
        const playersWithTeams = shuffledPlayers.map((player, index) => ({
          ...player,
          team: Math.floor(index / playersPerTeam) + 1, // Teams 1-4
          questionsAnswered: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          startTime: undefined,
          finishTime: undefined
        }));

        const now = Date.now();
        const updatedState = {
          ...prev,
          players: playersWithTeams,
          gameStarted: true,
          teamScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
          currentQuestion: null,
          gameStartTime: now,
          gameEndTime: undefined,
          timeLimit: 600000 // 10 minutes in milliseconds
        };
        updateGameState(updatedState);
        return updatedState;
      });
    }
  };

  const generateQuestion = (playerId: string, fromOtherTeam: boolean = false) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player || (player.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER) return;

    const randomQuestion = QUESTION_POOL[Math.floor(Math.random() * QUESTION_POOL.length)];
    
    setGameState((prev) => {
      const updatedState = {
        ...prev,
        currentQuestion: {
          playerId,
          question: randomQuestion.q,
          options: randomQuestion.opts,
          correctAnswer: randomQuestion.ans,
          questionNumber: (player.questionsAnswered || 0) + 1,
          isRetry: fromOtherTeam
        }
      };
      updateGameState(updatedState);
      return updatedState;
    });
  };

  const answerQuestion = (answerIndex: number) => {
    if (!gameState.currentQuestion) return;
    if (gameState.currentQuestion.playerId !== myPlayerId) return;

    const isCorrect = answerIndex === gameState.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // Correct answer - update scores and move on
      setGameState((prev) => {
        const updatedPlayers = prev.players.map(p => {
          if (p.id === myPlayerId) {
            const newQuestionsAnswered = (p.questionsAnswered || 0) + 1;
            const now = Date.now();
            
            return {
              ...p,
              questionsAnswered: newQuestionsAnswered,
              correctAnswers: (p.correctAnswers || 0) + 1,
              startTime: p.startTime || now, // Set start time on first correct answer
              finishTime: newQuestionsAnswered >= QUESTIONS_PER_PLAYER ? now : p.finishTime
            };
          }
          return p;
        });

        // Update team scores
        const currentPlayer = updatedPlayers.find(p => p.id === myPlayerId);
        const updatedTeamScores = { ...(prev.teamScores || { 1: 0, 2: 0, 3: 0, 4: 0 }) };
        if (currentPlayer?.team) {
          updatedTeamScores[currentPlayer.team] = (updatedTeamScores[currentPlayer.team] || 0) + 1;
        }

        const updatedState = {
          ...prev,
          players: updatedPlayers,
          teamScores: updatedTeamScores,
          currentQuestion: null
        };
        
        updateGameState(updatedState);
        return updatedState;
      });
      alert('✅ Chính xác! +1 điểm cho đội của bạn');
    } else {
      // Wrong answer - track it and give another retry question
      setGameState((prev) => {
        const updatedPlayers = prev.players.map(p => {
          if (p.id === myPlayerId) {
            const now = Date.now();
            return {
              ...p,
              wrongAnswers: (p.wrongAnswers || 0) + 1,
              startTime: p.startTime || now // Set start time on first attempt
            };
          }
          return p;
        });

        const updatedState = {
          ...prev,
          players: updatedPlayers,
          currentQuestion: null
        };
        
        updateGameState(updatedState);
        return updatedState;
      });
      
      alert('❌ Sai rồi! Đáp án đúng là: ' + gameState.currentQuestion.options[gameState.currentQuestion.correctAnswer] + '\nBạn sẽ nhận câu hỏi khác từ nhóm khác.');
      
      // Give another retry question after a short delay
      setTimeout(() => {
        generateQuestion(myPlayerId, true);
      }, 1500);
    }
  };

  const endGame = () => {
    setGameState((prev) => {
      const updatedState = {
        ...prev,
        gameEndTime: Date.now()
      };
      updateGameState(updatedState);
      return updatedState;
    });
  };

  const calculateTeamRankings = () => {
    if (!gameState.gameStartTime) return [];

    const teams = [1, 2, 3, 4];
    const teamStats = teams.map(teamNum => {
      const teamPlayers = gameState.players.filter(p => p.team === teamNum);
      
      // Calculate team completion status
      const allCompleted = teamPlayers.every(p => (p.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER);
      const totalWrong = teamPlayers.reduce((sum, p) => sum + (p.wrongAnswers || 0), 0);
      const avgWrong = totalWrong / (teamPlayers.length || 1);
      
      // Calculate average completion time (only for finished players)
      const finishedPlayers = teamPlayers.filter(p => p.finishTime && p.startTime);
      const avgTime = finishedPlayers.length > 0
        ? finishedPlayers.reduce((sum, p) => sum + (p.finishTime! - p.startTime!), 0) / finishedPlayers.length
        : Infinity;
      
      return {
        team: teamNum,
        players: teamPlayers,
        allCompleted,
        totalWrong,
        avgWrong,
        avgTime,
        completedCount: finishedPlayers.length
      };
    });

    // Sort teams: 1) All completed first, 2) Least average wrong, 3) Fastest average time
    return teamStats.sort((a, b) => {
      if (a.allCompleted !== b.allCompleted) return b.allCompleted ? 1 : -1;
      if (a.avgWrong !== b.avgWrong) return a.avgWrong - b.avgWrong;
      return a.avgTime - b.avgTime;
    });
  };

  const rankPlayersInTeam = (teamPlayers: Player[]) => {
    return [...teamPlayers].sort((a, b) => {
      const aCompleted = (a.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER;
      const bCompleted = (b.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER;
      
      // Completed players first
      if (aCompleted !== bCompleted) return bCompleted ? 1 : -1;
      
      // Least wrong answers
      if ((a.wrongAnswers || 0) !== (b.wrongAnswers || 0)) {
        return (a.wrongAnswers || 0) - (b.wrongAnswers || 0);
      }
      
      // Fastest time
      const aTime = (a.finishTime && a.startTime) ? (a.finishTime - a.startTime) : Infinity;
      const bTime = (b.finishTime && b.startTime) ? (b.finishTime - b.startTime) : Infinity;
      return aTime - bTime;
    });
  };

  const rollDice = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer?.id !== myPlayerId) return;

    // Check if player still has questions to answer
    if ((currentPlayer.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER) {
      alert('Bạn đã hoàn thành 10 câu hỏi của mình!');
      // Move to next player
      setGameState((prev) => {
        const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
        const updatedState = { ...prev, currentPlayerIndex: nextPlayerIndex };
        updateGameState(updatedState);
        return updatedState;
      });
      return;
    }

    // Generate question instead of rolling dice
    generateQuestion(myPlayerId);
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Room Lobby */}
        <AnimatePresence>
          {!isInRoom && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto mt-20"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gold-500/30 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-6 text-gradient">
                  🎲 Cờ Cá Ngựa
                </h2>
                
                <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-3 mb-4 text-sm text-center">
                  🎮 Chơi nhiều người online
                </div>

                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />

                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Mã phòng (4 số)"
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 text-center text-2xl font-mono"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    maxLength={4}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={joinRoom}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
                  >
                    Tham gia
                  </motion.button>
                </div>

                <div className="text-center text-gray-400 my-4">hoặc</div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createRoom}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 py-3 rounded-lg font-bold"
                >
                  Tạo phòng mới
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="w-full mt-4 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold"
                >
                  ← Quay lại
                </motion.button>

                <div className="mt-6 text-sm text-gray-400 text-center">
                  <p>👥 Hỗ trợ 2-8 người chơi</p>
                  <p>🎯 Đưa 4 quân cờ về đích để chiến thắng</p>
                  <p className="mt-2 text-xs">🔒 P2P - Không cần server backend</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waiting Room */}
        {isInRoom && !gameState.gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-10"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gold-500/30">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Phòng chờ</h2>
                {roomCode && (
                  <div className="bg-gray-700 rounded-lg p-4 mb-2">
                    <p className="text-xs text-gray-400 mb-1">Mã Phòng:</p>
                    <div className="text-gold-400 text-2xl font-mono">{roomCode}</div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigator.clipboard.writeText(roomCode);
                        alert('Đã sao chép mã phòng!');
                      }}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                    >
                      📋 Sao chép mã
                    </motion.button>
                  </div>
                )}
                <p className="text-gray-400 text-sm mt-2">
                  {isHost ? 'Chia sẻ mã này với bạn bè để họ tham gia' : 'Đang chờ host bắt đầu game...'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {gameState.players.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-700 rounded-lg p-4 text-center"
                    style={{ borderTop: `4px solid ${player.color}` }}
                  >
                    <div className="text-2xl mb-2">👤</div>
                    <div className="font-semibold truncate">{player.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {player.isReady ? '✓ Sẵn sàng' : 'Đang chờ...'}
                    </div>
                  </motion.div>
                ))}
                
                {Array(Math.min(40 - gameState.players.length, 8)).fill(null).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="bg-gray-800/50 rounded-lg p-4 text-center border-2 border-dashed border-gray-600"
                  >
                    <div className="text-2xl mb-2 opacity-30">👤</div>
                    <div className="text-gray-500 text-sm">Đang chờ...</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleReady}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    gameState.players.find(p => p.id === myPlayerId)?.isReady
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {gameState.players.find(p => p.id === myPlayerId)?.isReady ? 'Hủy sẵn sàng' : 'Sẵn sàng'}
                </motion.button>

                {isHost && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    disabled={gameState.players.length < 2 || !gameState.players.every(p => p.isReady)}
                    className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 disabled:from-gray-600 disabled:to-gray-700 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bắt đầu trò chơi
                  </motion.button>
                )}
              </div>

              <p className="text-center text-gray-400 text-sm mt-4">
                {gameState.players.length}/40 người chơi • Cần tối thiểu 2 người
              </p>
            </div>
          </motion.div>
        )}

        {/* Question Modal */}
        <AnimatePresence>
          {gameState.currentQuestion && gameState.currentQuestion.playerId === myPlayerId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full border-2 border-gold-500/30"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gold-400 mb-2">
                    Câu hỏi {gameState.currentQuestion.questionNumber}/{QUESTIONS_PER_PLAYER}
                  </h2>
                  {gameState.currentQuestion.isRetry && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 mb-3">
                      <p className="text-red-400 text-sm font-semibold">⚠️ Câu hỏi từ nhóm khác (Cơ hội thứ 2)</p>
                    </div>
                  )}
                  <p className="text-lg font-semibold text-white">
                    {gameState.currentQuestion.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {gameState.currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => answerQuestion(index)}
                      className="bg-gray-700 hover:bg-gold-500/20 border-2 border-gray-600 hover:border-gold-500 rounded-lg p-4 text-left font-semibold transition-all"
                    >
                      <span className="text-gold-400 mr-3">{['A', 'B', 'C', 'D'][index]}.</span>
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        {gameState.gameStarted && !gameState.gameEndTime && (
          <div className="max-w-6xl mx-auto">
            {/* Timer Display */}
            <div className="mb-6 text-center">
              <div className={`inline-block bg-gray-800 rounded-xl px-8 py-4 border-2 ${
                remainingTime <= 60 ? 'border-red-500 animate-pulse' : 'border-gold-500'
              }`}>
                <div className="text-sm text-gray-400 mb-1">Thời gian còn lại</div>
                <div className={`text-4xl font-bold ${
                  remainingTime <= 60 ? 'text-red-500' : 'text-gold-400'
                }`}>
                  {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Team Scores & Players Info */}
              <div className="lg:col-span-1 space-y-4">
                {/* Team Scores */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-xl font-bold mb-4">Điểm đội</h3>
                  {[1, 2, 3, 4].map(teamNum => (
                    <div key={teamNum} className="flex justify-between items-center p-2 bg-gray-700 rounded mb-2">
                      <span className="font-semibold">Đội {teamNum}</span>
                      <span className="text-gold-400 font-bold">{gameState.teamScores?.[teamNum] || 0}/10</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-xl font-bold mb-4">Người chơi</h3>
                  {gameState.players.map((player, index) => (
                    <div
                      key={player.id}
                      className={`p-3 rounded-lg mb-2 ${
                        index === gameState.currentPlayerIndex ? 'bg-gold-500/20 border-2 border-gold-500' : 'bg-gray-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: player.color }}
                            />
                            <span className="font-semibold">{player.name}</span>
                            {player.id === myPlayerId && <span className="text-xs text-gold-400">(Bạn)</span>}
                            <span className="text-xs text-gray-400">Đội {player.team}</span>
                          </div>
                          <div className="text-sm">
                            {player.questionsAnswered || 0}/{QUESTIONS_PER_PLAYER} câu
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex gap-3">
                          <span className="text-red-400">❌ {player.wrongAnswers || 0} sai</span>
                          {player.finishTime && player.startTime && (
                            <span className="text-green-400">⏱️ {Math.floor((player.finishTime - player.startTime) / 1000)}s</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Question Action */}
                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Hành động</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={rollDice}
                    disabled={!isMyTurn || !!gameState.currentQuestion}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 disabled:from-gray-600 disabled:to-gray-700 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMyTurn ? 'Trả lời câu hỏi' : 'Chờ lượt...'}
                  </motion.button>
                </div>

                {/* Current Turn */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Lượt hiện tại</p>
                    <p className="text-xl font-bold" style={{ color: currentPlayer?.color }}>
                      {currentPlayer?.name} (Đội {currentPlayer?.team})
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Đã trả lời: {currentPlayer?.questionsAnswered || 0}/{QUESTIONS_PER_PLAYER}
                    </p>
                  </div>
                </div>
              </div>

              {/* Game Status */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-center mb-6">Trò chơi đang diễn ra</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(teamNum => {
                      const teamPlayers = gameState.players.filter(p => p.team === teamNum);
                      const totalQuestions = teamPlayers.reduce((sum, p) => sum + (p.questionsAnswered || 0), 0);
                      
                      return (
                        <div key={teamNum} className="bg-gray-700 rounded-lg p-4 text-center">
                          <h3 className="text-lg font-bold mb-2">Đội {teamNum}</h3>
                          <p className="text-3xl font-bold text-gold-400 mb-2">
                            {gameState.teamScores?.[teamNum] || 0}
                          </p>
                          <p className="text-sm text-gray-400">
                            {totalQuestions}/{teamPlayers.length * QUESTIONS_PER_PLAYER} câu
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {teamPlayers.length} người chơi
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Tiến độ trả lời</h3>
                    <div className="space-y-2">
                      {gameState.players.map(player => (
                        <div key={player.id} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-3 h-3 rounded-full" style={{ backgroundColor: player.color }} />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{player.name} (Đội {player.team})</span>
                              <div className="flex gap-2 text-xs">
                                <span className="text-gold-400">
                                  ✓ {player.correctAnswers || 0}/{player.questionsAnswered || 0}
                                </span>
                                <span className="text-red-400">
                                  ✗ {player.wrongAnswers || 0}
                                </span>
                                {player.finishTime && player.startTime && (
                                  <span className="text-green-400">
                                    ⏱️ {Math.floor((player.finishTime - player.startTime) / 1000)}s
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="bg-gray-600 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gold-500 h-full transition-all"
                                style={{ width: `${((player.questionsAnswered || 0) / QUESTIONS_PER_PLAYER) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {gameState.gameEndTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/90 z-50 p-4 overflow-y-auto"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-4xl font-bold text-gold-400 mb-2">Kết quả trò chơi</h2>
                <p className="text-gray-400">Thời gian: {remainingTime <= 0 ? 'Hết giờ!' : 'Hoàn thành sớm'}</p>
              </div>

              {/* Team Rankings */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-4">🏅 Xếp hạng đội</h3>
                <div className="space-y-4">
                  {calculateTeamRankings().map((teamStat, index) => (
                    <div key={teamStat.team} className={`bg-gray-700 rounded-lg p-4 ${
                      index === 0 ? 'border-2 border-gold-500' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{['🥇', '🥈', '🥉', '4️⃣'][index]}</span>
                          <span className="text-xl font-bold">Đội {teamStat.team}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            Hoàn thành: {teamStat.completedCount}/{teamStat.players.length}
                          </div>
                          <div className="text-sm text-red-400">
                            Tổng sai: {teamStat.totalWrong}
                          </div>
                          {teamStat.avgTime !== Infinity && (
                            <div className="text-sm text-green-400">
                              TB: {Math.floor(teamStat.avgTime / 1000)}s
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Players in Team */}
                      <div className="ml-8 space-y-2">
                        {rankPlayersInTeam(teamStat.players).map((player, pIndex) => (
                          <div key={player.id} className="bg-gray-600 rounded p-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{pIndex + 1}.</span>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: player.color }} />
                              <span className="font-semibold">{player.name}</span>
                            </div>
                            <div className="flex gap-3 text-sm">
                              <span className="text-gold-400">✓ {player.correctAnswers || 0}</span>
                              <span className="text-red-400">✗ {player.wrongAnswers || 0}</span>
                              {player.finishTime && player.startTime && (
                                <span className="text-green-400">
                                  ⏱️ {Math.floor((player.finishTime - player.startTime) / 1000)}s
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 rounded-lg font-bold text-lg"
              >
                Quay về trang chủ
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoCaNguaGame;



