import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove, update, get } from 'firebase/database';

interface Player {
  id: string;
  name: string;
  color: string;
  pieces: PiecePosition[];
  isReady: boolean;
  team?: number; // Team 1, 2, 3, or 4
  questionsAnswered?: number; // Number of questions answered
  correctAnswers?: number; // Number of correct answers
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
  } | null;
  teamScores?: { [key: number]: number }; // Team scores
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

// Sample questions pool (Vietnamese history)
const QUESTION_POOL = [
  { q: "Năm nào Việt Nam giành độc lập?", opts: ["1945", "1954", "1975", "1930"], ans: 0 },
  { q: "Ai là Chủ tịch đầu tiên của nước Việt Nam Dân chủ Cộng hòa?", opts: ["Hồ Chí Minh", "Võ Nguyên Giáp", "Phạm Văn Đồng", "Lê Duẩn"], ans: 0 },
  { q: "Chiến dịch nào kết thúc sự hiện diện của Pháp ở Việt Nam?", opts: ["Biên Giới", "Điện Biên Phủ", "Hòa Bình", "Tây Bắc"], ans: 1 },
  { q: "Thủ đô của Việt Nam là?", opts: ["Hồ Chí Minh", "Đà Nẵng", "Hà Nội", "Huế"], ans: 2 },
  { q: "Việt Nam có bao nhiêu tỉnh và thành phố trực thuộc trung ương?", opts: ["58", "63", "65", "60"], ans: 1 },
  { q: "Sông nào dài nhất Việt Nam?", opts: ["Sông Hồng", "Sông Cửu Long", "Sông Mekong", "Sông Đồng Nai"], ans: 2 },
  { q: "Di sản văn hóa thế giới nào ở Việt Nam?", opts: ["Vịnh Hạ Long", "Phố cổ Hội An", "Cố đô Huế", "Tất cả đều đúng"], ans: 3 },
  { q: "Năm Việt Nam gia nhập ASEAN?", opts: ["1995", "1990", "2000", "1997"], ans: 0 },
  { q: "Đảng Cộng sản Việt Nam được thành lập năm nào?", opts: ["1925", "1930", "1945", "1920"], ans: 1 },
  { q: "Quốc khánh Việt Nam là ngày nào?", opts: ["30/4", "2/9", "19/5", "1/1"], ans: 1 },
  { q: "Ai là vị vua cuối cùng của triều đại nhà Nguyễn?", opts: ["Bảo Đại", "Khải Định", "Minh Mạng", "Tự Đức"], ans: 0 },
  { q: "Thành phố nào được mệnh danh là thành phố của mùa hoa phượng đỏ?", opts: ["Hà Nội", "Sài Gòn", "Hải Phòng", "Đà Nẵng"], ans: 2 },
  { q: "Ai được mệnh danh là Đại tướng của dân tộc Việt Nam?", opts: ["Trần Hưng Đạo", "Võ Nguyên Giáp", "Lý Thường Kiệt", "Lê Lợi"], ans: 1 },
  { q: "Việt Nam thống nhất đất nước vào năm nào?", opts: ["1954", "1975", "1973", "1976"], ans: 1 },
  { q: "Quốc hoa của Việt Nam là?", opts: ["Hoa sen", "Hoa đào", "Hoa mai", "Hoa phượng"], ans: 0 },
  { q: "Núi nào cao nhất Việt Nam?", opts: ["Fansipan", "Bạch Mã", "Ngọc Linh", "Pù Ta Leng"], ans: 0 },
  { q: "Việt Nam có bao nhiêu dân tộc?", opts: ["53", "54", "55", "56"], ans: 1 },
  { q: "Đồng tiền của Việt Nam là?", opts: ["Đồng", "Đô la", "Bạc", "Xu"], ans: 0 },
  { q: "Thời kỳ Bắc thuộc kéo dài bao lâu?", opts: ["Hơn 500 năm", "Hơn 1000 năm", "Hơn 200 năm", "Hơn 800 năm"], ans: 1 },
  { q: "Ai là người sáng lập ra chữ Quốc ngữ?", opts: ["Alexandre de Rhodes", "Pigneau de Behaine", "Jean Dupuis", "Paul Doumer"], ans: 0 },
  { q: "Lễ hội nào lớn nhất ở Việt Nam?", opts: ["Tết Nguyên Đán", "Tết Trung Thu", "Lễ Giỗ Tổ", "Tết Đoan Ngọ"], ans: 0 },
  { q: "Chiến thắng nào đánh dấu kết thúc chiến tranh Việt Nam?", opts: ["30/4/1975", "7/5/1954", "19/12/1946", "25/12/1989"], ans: 0 },
  { q: "Ai là tác giả của bản Tuyên ngôn độc lập?", opts: ["Hồ Chí Minh", "Võ Nguyên Giáp", "Phạm Văn Đồng", "Trường Chinh"], ans: 0 },
  { q: "Vịnh nào được UNESCO công nhận là Di sản thiên nhiên thế giới?", opts: ["Vịnh Nha Trang", "Vịnh Hạ Long", "Vịnh Cam Ranh", "Vịnh Vân Phong"], ans: 1 },
  { q: "Năm nào Sài Gòn được đổi tên thành Thành phố Hồ Chí Minh?", opts: ["1975", "1976", "1977", "1978"], ans: 1 },
  { q: "Đơn vị tiền tệ của Việt Nam là?", opts: ["VND", "VNĐ", "Đồng", "Cả 3 đều đúng"], ans: 3 },
  { q: "Ai là vua đầu tiên của nhà Lý?", opts: ["Lý Thái Tổ", "Lý Thánh Tông", "Lý Nhân Tông", "Lý Cao Tông"], ans: 0 },
  { q: "Diện tích Việt Nam là bao nhiêu?", opts: ["310,000 km²", "331,212 km²", "350,000 km²", "320,000 km²"], ans: 1 },
  { q: "Việt Nam nằm ở múi giờ nào?", opts: ["GMT+6", "GMT+7", "GMT+8", "GMT+9"], ans: 1 },
  { q: "Ai là nữ tướng nổi tiếng trong lịch sử Việt Nam?", opts: ["Bà Triệu", "Hai Bà Trưng", "Trần Thị Lý", "Cả 3 đều đúng"], ans: 3 },
  { q: "Thành phố cảng lớn nhất Việt Nam?", opts: ["Đà Nẵng", "Hải Phòng", "Vũng Tàu", "TP. Hồ Chí Minh"], ans: 1 },
  { q: "Núi Ngũ Hành Sơn nằm ở đâu?", opts: ["Đà Nẵng", "Quảng Nam", "Khánh Hòa", "Bình Định"], ans: 0 },
  { q: "Cầu nào được biết đến là biểu tượng của Đà Nẵng?", opts: ["Cầu Rồng", "Cầu Trần Thị Lý", "Cầu Thuận Phước", "Cầu Tình Yêu"], ans: 0 },
  { q: "Đặc sản nào nổi tiếng của Phú Quốc?", opts: ["Nước mắm", "Sim rừng", "Hạt tiêu", "Tất cả đều đúng"], ans: 3 },
  { q: "Biển Việt Nam thuộc vùng biển nào?", opts: ["Biển Đông", "Biển Tây", "Biển Nam", "Biển Bắc"], ans: 0 },
  { q: "Ai là nhà thơ lớn của Việt Nam?", opts: ["Nguyễn Du", "Hồ Xuân Hương", "Tố Hữu", "Xuân Diệu"], ans: 0 },
  { q: "Truyện Kiều có bao nhiêu câu?", opts: ["3000", "3254", "2500", "4000"], ans: 1 },
  { q: "Lăng Chủ tịch Hồ Chí Minh nằm ở đâu?", opts: ["Hà Nội", "TP. Hồ Chí Minh", "Nghệ An", "Phú Thọ"], ans: 0 },
  { q: "Bảo tàng nào lớn nhất Việt Nam?", opts: ["Bảo tàng Lịch sử", "Bảo tàng Dân tộc học", "Bảo tàng Mỹ thuật", "Bảo tàng Hồ Chí Minh"], ans: 1 },
  { q: "Ca khúc nào được coi là bài hát quốc ca của Việt Nam?", opts: ["Tiến quân ca", "Việt Nam quê hương tôi", "Như có Bác Hồ", "Đất nước"], ans: 0 }
];

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
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    gameStarted: false,
    winner: null,
  });


  // Room reference
  const roomRef = roomCode ? ref(database, `rooms/${roomCode}`) : null;

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

    if (!gameState.players.every((p) => p.isReady)) {
      alert('Tất cả người chơi phải sẵn sàng!');
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
          correctAnswers: 0
        }));

        const updatedState = {
          ...prev,
          players: playersWithTeams,
          gameStarted: true,
          teamScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
          currentQuestion: null
        };
        updateGameState(updatedState);
        return updatedState;
      });
    }
  };

  const generateQuestion = (playerId: string) => {
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
          questionNumber: (player.questionsAnswered || 0) + 1
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
    
    setGameState((prev) => {
      const updatedPlayers = prev.players.map(p => {
        if (p.id === myPlayerId) {
          return {
            ...p,
            questionsAnswered: (p.questionsAnswered || 0) + 1,
            correctAnswers: (p.correctAnswers || 0) + (isCorrect ? 1 : 0)
          };
        }
        return p;
      });

      // Update team scores
      const currentPlayer = updatedPlayers.find(p => p.id === myPlayerId);
      const updatedTeamScores = { ...(prev.teamScores || { 1: 0, 2: 0, 3: 0, 4: 0 }) };
      if (currentPlayer?.team && isCorrect) {
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

    // Show feedback
    if (isCorrect) {
      alert('✅ Chính xác! +1 điểm cho đội của bạn');
    } else {
      alert('❌ Sai rồi! Đáp án đúng là: ' + gameState.currentQuestion.options[gameState.currentQuestion.correctAnswer]);
    }
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
        {gameState.gameStarted && !gameState.winner && (
          <div className="max-w-6xl mx-auto">
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
                      <div className="flex items-center justify-between">
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
                              <span className="text-gold-400">
                                {player.correctAnswers || 0}/{player.questionsAnswered || 0}
                              </span>
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

        {/* Winner Screen */}
        {gameState.winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
          >
            <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-12 text-center max-w-md">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-4xl font-bold text-black mb-4">Chiến thắng!</h2>
              <p className="text-2xl text-black mb-6">{gameState.winner}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="bg-black text-gold-400 px-8 py-3 rounded-lg font-bold"
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



