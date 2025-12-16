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
  startTime?: number | null; // Timestamp when player started answering questions
  finishTime?: number | null; // Timestamp when player completed all questions
  cooldownUntil?: number | null; // Timestamp until player can answer again (after wrong answer)
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
  gameStartTime?: number | null; // Timestamp when game started
  gameEndTime?: number | null; // Timestamp when game ended
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
    gameStartTime: null,
    gameEndTime: null,
    currentQuestion: null
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
      if (data && data.gameState) {
        console.log('🔄 Room data updated:', data);
        setGameState(data.gameState);
      } else if (!data) {
        console.log('⚠️ Room no longer exists');
        if (!isHost) {
          alert('Phòng đã bị đóng!');
          setIsInRoom(false);
          setRoomCode('');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomCode, isInRoom, isHost]);

  // Cleanup room on unmount for host
  useEffect(() => {
    return () => {
      if (isHost && roomCode && isInRoom) {
        remove(ref(database, `rooms/${roomCode}`)).catch(console.error);
      }
    };
  }, [isHost, roomCode, isInRoom]);

  const updateGameState = async (newState: GameState) => {
    if (!roomCode) return;
    
    try {
      // Clean undefined values - Firebase doesn't accept undefined
      const cleanState = JSON.parse(JSON.stringify(newState, (key, value) => 
        value === undefined ? null : value
      ));
      
      await update(ref(database, `rooms/${roomCode}`), {
        gameState: cleanState
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
          startTime: null,
          finishTime: null,
          cooldownUntil: null
        }));

        const now = Date.now();
        const updatedState = {
          ...prev,
          players: playersWithTeams,
          gameStarted: true,
          teamScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
          currentQuestion: null,
          gameStartTime: now,
          gameEndTime: null,
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
              finishTime: newQuestionsAnswered >= QUESTIONS_PER_PLAYER ? now : (p.finishTime || null),
              cooldownUntil: null // Clear cooldown on correct answer
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
      // Wrong answer - track it and set 5-second cooldown
      setGameState((prev) => {
        const updatedPlayers = prev.players.map(p => {
          if (p.id === myPlayerId) {
            const now = Date.now();
            return {
              ...p,
              wrongAnswers: (p.wrongAnswers || 0) + 1,
              startTime: p.startTime || now, // Set start time on first attempt
              finishTime: p.finishTime || null,
              cooldownUntil: now + 5000 // 5 seconds cooldown
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
      
      alert('❌ Sai rồi! Đáp án đúng là: ' + gameState.currentQuestion.options[gameState.currentQuestion.correctAnswer] + '\nVui lòng chờ 5 giây để trả lời tiếp.');
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
    const myPlayer = gameState.players.find(p => p.id === myPlayerId);
    if (!myPlayer) return;

    // Check if player completed all questions
    if ((myPlayer.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER) {
      alert('Bạn đã hoàn thành 10 câu hỏi của mình!');
      return;
    }

    // Check cooldown
    const now = Date.now();
    if (myPlayer.cooldownUntil && myPlayer.cooldownUntil > now) {
      const remainingSeconds = Math.ceil((myPlayer.cooldownUntil - now) / 1000);
      alert(`⏳ Vui lòng chờ ${remainingSeconds} giây nữa để trả lời tiếp.`);
      return;
    }

    // Generate question
    generateQuestion(myPlayerId, true);
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
          <div className="max-w-7xl mx-auto px-4">
            {/* Main Layout: 3 columns on large screens */}
            <div className="grid lg:grid-cols-[1fr_2fr_1fr] gap-4">
              
              {/* LEFT COLUMN - Team 1 & 3 Info */}
              <div className="space-y-4">
                {/* Timer Display - Top */}
                <div className="bg-gray-800 rounded-xl p-4 border-2 border-gold-500/30">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Thời gian còn lại</div>
                    <div className={`text-3xl font-bold ${
                      remainingTime <= 60 ? 'text-red-500 animate-pulse' : 'text-gold-400'
                    }`}>
                      {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Team 1 (Red) */}
                {(() => {
                  const team1Players = gameState.players.filter(p => p.team === 1);
                  return team1Players.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-red-400">🔴 Đội 1</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[1] || 0}/10</span>
                      </div>
                      {team1Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                            <span className="text-xs">{player.questionsAnswered || 0}/10</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctAnswers || 0}</span>
                            <span className="text-red-400">✗{player.wrongAnswers || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Team 3 (Yellow/Orange) */}
                {(() => {
                  const team3Players = gameState.players.filter(p => p.team === 3);
                  return team3Players.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-yellow-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-yellow-400">🟡 Đội 3</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[3] || 0}/10</span>
                      </div>
                      {team3Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                            <span className="text-xs">{player.questionsAnswered || 0}/10</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctAnswers || 0}</span>
                            <span className="text-red-400">✗{player.wrongAnswers || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* CENTER COLUMN - Game Board */}
              <div className="space-y-4">
                {/* Cờ cá ngựa Board - CENTER */}
                <div className="bg-gray-800 rounded-xl p-6 border-2 border-gold-500/30">
                  <h3 className="text-2xl font-bold mb-4 text-center text-gold-400">🎲 Bàn Cờ Cá Ngựa</h3>
                  <div className="relative aspect-square max-w-full mx-auto">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Board Background */}
                        <rect x="0" y="0" width="400" height="400" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
                        
                        {/* Home Areas - 4 corners */}
                        {/* Red (Top-Left) */}
                        <rect x="20" y="20" width="140" height="140" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="3" rx="8"/>
                        {/* Blue (Top-Right) */}
                        <rect x="240" y="20" width="140" height="140" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="3" rx="8"/>
                        {/* Yellow/Orange (Bottom-Left) */}
                        <rect x="20" y="240" width="140" height="140" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="3" rx="8"/>
                        {/* Green (Bottom-Right) */}
                        <rect x="240" y="240" width="140" height="140" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="3" rx="8"/>
                        
                        {/* Center finish area */}
                        <rect x="170" y="170" width="60" height="60" fill="#fbbf24" opacity="0.5" stroke="#fbbf24" strokeWidth="2" rx="4"/>
                        
                        {/* Path Lines - Vertical paths */}
                        <line x1="200" y1="160" x2="200" y2="20" stroke="#4b5563" strokeWidth="2"/>
                        <line x1="200" y1="380" x2="200" y2="240" stroke="#4b5563" strokeWidth="2"/>
                        
                        {/* Path Lines - Horizontal paths */}
                        <line x1="20" y1="200" x2="160" y2="200" stroke="#4b5563" strokeWidth="2"/>
                        <line x1="240" y1="200" x2="380" y2="200" stroke="#4b5563" strokeWidth="2"/>
                        
                        {/* Player pieces on board */}
                        {gameState.players.map((player, idx) => {
                          const progress = (player.questionsAnswered || 0) / QUESTIONS_PER_PLAYER;
                          const team = player.team || 1;
                          
                          // Calculate position based on team and progress
                          let x = 200, y = 200;
                          if (team === 1) { // Red - top-left, moves right then down
                            if (progress < 0.25) {
                              x = 90 + progress * 4 * 110;
                              y = 80;
                            } else if (progress < 0.5) {
                              x = 200;
                              y = 80 + (progress - 0.25) * 4 * 120;
                            } else {
                              x = 200 - (progress - 0.5) * 2 * 30;
                              y = 200 - (progress - 0.5) * 2 * 30;
                            }
                          } else if (team === 2) { // Blue - top-right, moves down then left
                            if (progress < 0.25) {
                              x = 310;
                              y = 80 + progress * 4 * 120;
                            } else if (progress < 0.5) {
                              x = 310 - (progress - 0.25) * 4 * 110;
                              y = 200;
                            } else {
                              x = 200 + (progress - 0.5) * 2 * 30;
                              y = 200 - (progress - 0.5) * 2 * 30;
                            }
                          } else if (team === 3) { // Yellow - bottom-left, moves up then right
                            if (progress < 0.25) {
                              x = 90;
                              y = 320 - progress * 4 * 120;
                            } else if (progress < 0.5) {
                              x = 90 + (progress - 0.25) * 4 * 110;
                              y = 200;
                            } else {
                              x = 200 - (progress - 0.5) * 2 * 30;
                              y = 200 + (progress - 0.5) * 2 * 30;
                            }
                          } else { // Green - bottom-right, moves left then up
                            if (progress < 0.25) {
                              x = 310 - progress * 4 * 110;
                              y = 320;
                            } else if (progress < 0.5) {
                              x = 200;
                              y = 320 - (progress - 0.25) * 4 * 120;
                            } else {
                              x = 200 + (progress - 0.5) * 2 * 30;
                              y = 200 + (progress - 0.5) * 2 * 30;
                            }
                          }
                          
                          return (
                            <g key={player.id}>
                              {/* Horse piece */}
                              <circle cx={x} cy={y} r="12" fill={player.color} stroke="#fff" strokeWidth="2"/>
                              <text x={x} y={y + 1} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                                {player.questionsAnswered || 0}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Team labels */}
                        <text x="90" y="90" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="bold">Đội 1</text>
                        <text x="310" y="90" textAnchor="middle" fill="#3b82f6" fontSize="16" fontWeight="bold">Đội 2</text>
                        <text x="90" y="310" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">Đội 3</text>
                        <text x="310" y="310" textAnchor="middle" fill="#10b981" fontSize="16" fontWeight="bold">Đội 4</text>
                        
                        {/* Finish label */}
                        <text x="200" y="205" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">Đích</text>
                      </svg>
                    </div>
                </div>

                {/* Action Button */}
                <div className="bg-gray-800 rounded-xl p-6 text-center border-2 border-gold-500/30">
                  <h3 className="text-lg font-bold mb-4 text-gold-400">🎯 Hành động</h3>
                  {(() => {
                    const myPlayer = gameState.players.find(p => p.id === myPlayerId);
                    const now = Date.now();
                    const onCooldown = myPlayer?.cooldownUntil && myPlayer.cooldownUntil > now;
                    const remainingSeconds = onCooldown ? Math.ceil(((myPlayer?.cooldownUntil || 0) - now) / 1000) : 0;
                    const completed = (myPlayer?.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER;
                    
                    return (
                      <>
                        <motion.button
                          whileHover={{ scale: onCooldown || completed ? 1 : 1.05 }}
                          whileTap={{ scale: onCooldown || completed ? 1 : 0.95 }}
                          onClick={rollDice}
                          disabled={!!gameState.currentQuestion || onCooldown || completed}
                          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 disabled:from-gray-600 disabled:to-gray-700 py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {completed ? '✅ Hoàn thành!' : onCooldown ? `⏳ Chờ ${remainingSeconds}s...` : '❓ Trả lời câu hỏi'}
                        </motion.button>
                        {onCooldown && (
                          <p className="text-sm text-red-400 mt-2">⏳ Cooldown sau câu trả lời sai</p>
                        )}
                        {myPlayer && !completed && !onCooldown && (
                          <p className="text-sm text-gray-400 mt-2">
                            Tiến độ: {myPlayer.questionsAnswered || 0}/10 câu
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* RIGHT COLUMN - Team 2 & 4 Info */}
              <div className="space-y-4">
                {/* Team 2 (Blue) */}
                {(() => {
                  const team2Players = gameState.players.filter(p => p.team === 2);
                  return team2Players.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-blue-400">🔵 Đội 2</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[2] || 0}/10</span>
                      </div>
                      {team2Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                            <span className="text-xs">{player.questionsAnswered || 0}/10</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctAnswers || 0}</span>
                            <span className="text-red-400">✗{player.wrongAnswers || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Team 4 (Green) */}
                {(() => {
                  const team4Players = gameState.players.filter(p => p.team === 4);
                  return team4Players.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-green-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-green-400">🟢 Đội 4</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[4] || 0}/10</span>
                      </div>
                      {team4Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                            <span className="text-xs">{player.questionsAnswered || 0}/10</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctAnswers || 0}</span>
                            <span className="text-red-400">✗{player.wrongAnswers || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Stats Summary */}
                <div className="bg-gray-800 rounded-xl p-4 border-2 border-gold-500/30">
                  <h3 className="text-sm font-bold mb-3 text-center text-gold-400">📊 Tổng quan</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Tổng câu đúng:</span>
                      <span className="font-bold text-green-400">
                        {gameState.players.reduce((sum, p) => sum + (p.correctAnswers || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Tổng câu sai:</span>
                      <span className="font-bold text-red-400">
                        {gameState.players.reduce((sum, p) => sum + (p.wrongAnswers || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Hoàn thành:</span>
                      <span className="font-bold text-gold-400">
                        {gameState.players.filter(p => (p.questionsAnswered || 0) >= QUESTIONS_PER_PLAYER).length}/{gameState.players.length}
                      </span>
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



