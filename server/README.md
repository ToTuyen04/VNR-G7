# Cờ Cá Ngựa Server

Socket.IO server for multiplayer Cờ Cá Ngựa (Vietnamese Horse Racing Chess) game.

## Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Features

- Real-time multiplayer game (2-8 players)
- Room-based matchmaking
- Dice rolling mechanics
- Piece movement with collision detection
- Turn-based gameplay
- Winner detection

## API Events

### Client → Server
- `createRoom`: Create a new game room
- `joinRoom`: Join an existing room
- `toggleReady`: Toggle player ready status
- `startGame`: Start the game (host only)
- `rollDice`: Roll the dice
- `movePiece`: Move a piece on the board

### Server → Client
- `roomJoined`: Confirmation of joining a room
- `playerJoined`: Notification of new player
- `gameState`: Current game state update
- `gameStarted`: Game has started
- `diceRolled`: Dice roll result
- `error`: Error messages

## Deployment

For production deployment, you can deploy this server to:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS/Azure/GCP

Make sure to update the Socket.IO connection URL in the client code to match your deployed server URL.
