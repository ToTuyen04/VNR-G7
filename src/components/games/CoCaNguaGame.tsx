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
  correctVotes?: number; // Number of correct votes
  wrongVotes?: number; // Number of wrong votes
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
  currentTeamIndex?: number; // Which team (1-4) is currently answering
  teamQuestionsAnswered?: { [key: number]: number }; // Questions answered per team
  currentQuestion?: {
    team: number; // Which team this question is for
    question: string;
    options: string[];
    correctAnswer: number;
    questionNumber: number;
    startTime: number; // When question started (for 22s timer)
    votes: { [playerId: string]: number }; // Player votes (answer index)
  } | null;
  teamScores?: { [key: number]: number }; // Team scores (legacy, kept for compatibility)
  teamCorrectAnswers?: { [key: number]: number }; // Correct answers per team
  teamWrongAnswers?: { [key: number]: number }; // Wrong answers per team
  gameStartTime?: number | null; // Timestamp when game started
  gameEndTime?: number | null; // Timestamp when game ended
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
const QUESTIONS_PER_TEAM = 10;
const QUESTION_TIME_LIMIT = 22; // 22 seconds per question
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
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    gameStarted: false,
    winner: null,
    gameStartTime: null,
    gameEndTime: null,
    currentQuestion: null,
    currentTeamIndex: 1,
    teamQuestionsAnswered: { 1: 0, 2: 0, 3: 0, 4: 0 },
    teamScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    teamCorrectAnswers: { 1: 0, 2: 0, 3: 0, 4: 0 },
    teamWrongAnswers: { 1: 0, 2: 0, 3: 0, 4: 0 }
  });


  // Room reference
  const roomRef = roomCode ? ref(database, `rooms/${roomCode}`) : null;

  // Question timer - 22 seconds countdown
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameEndTime || !gameState.currentQuestion) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.currentQuestion!.startTime) / 1000);
      const remaining = Math.max(0, QUESTION_TIME_LIMIT - elapsed);
      setQuestionTimeLeft(remaining);

      // Time's up for this question - host tallies votes
      if (remaining <= 0 && isHost) {
        tallyVotesAndNextQuestion();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.gameStarted, gameState.currentQuestion, gameState.gameEndTime, isHost]);

  // Check if all team members have voted - immediately reveal answer
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameEndTime || !gameState.currentQuestion || !isHost) return;

    const currentTeam = gameState.currentQuestion.team;
    const teamPlayers = gameState.players.filter(p => p.team === currentTeam);
    const votes = gameState.currentQuestion.votes || {};
    const voteCount = Object.keys(votes).length;

    // If all team members have voted, immediately tally
    if (teamPlayers.length > 0 && voteCount >= teamPlayers.length) {
      tallyVotesAndNextQuestion();
    }
  }, [gameState.currentQuestion?.votes, isHost]);

  // Listen to room changes
  useEffect(() => {
    if (!roomCode || !isInRoom) return;

    const roomDbRef = ref(database, `rooms/${roomCode}`);
    
    const unsubscribe = onValue(roomDbRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.gameState) {
        console.log('🔄 Room data updated:', data);
        // Ensure players array exists
        const updatedState = {
          ...data.gameState,
          players: data.gameState.players || []
        };
        setGameState(updatedState);
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
      const cleanState = JSON.parse(JSON.stringify(newState, (_key, value) => 
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
    const playerId = `host_${Date.now()}`;
    
    console.log('🏠 Creating room with code:', code);

    // Host is not a player, just manages the room
    const initialState = {
      players: [],
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
      
      if (!currentState) {
        alert('Dữ liệu phòng không hợp lệ!');
        return;
      }

      // Ensure players array exists
      const players = currentState.players || [];
      
      if (players.length >= 40) {
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
        color: PLAYER_COLORS[players.length],
        pieces: Array(PIECES_PER_PLAYER).fill(null).map(() => ({ position: -1, isFinished: false })),
        isReady: false,
      };

      const updatedState = {
        ...currentState,
        players: [...players, newPlayer],
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

  const startGame = () => {
    if (gameState.players.length < 2) {
      alert('Cần ít nhất 2 người chơi để bắt đầu!');
      return;
    }

    if (isHost) {
      // Randomize and assign teams
      const shuffledPlayers = [...gameState.players].sort(() => Math.random() - 0.5);
      const playersPerTeam = Math.ceil(shuffledPlayers.length / 4);
      
      const playersWithTeams = shuffledPlayers.map((player, index) => ({
        ...player,
        team: Math.floor(index / playersPerTeam) + 1, // Teams 1-4
        correctVotes: 0,
        wrongVotes: 0
      }));

      // Get active teams (teams with players)
      const activeTeams = [...new Set(playersWithTeams.map(p => p.team))].sort();
      const firstTeam = activeTeams[0] || 1;

      const now = Date.now();
      
      // Generate first question for first team
      const randomQuestion = QUESTION_POOL[Math.floor(Math.random() * QUESTION_POOL.length)];
      
      const updatedState: GameState = {
        ...gameState,
        players: playersWithTeams,
        gameStarted: true,
        teamScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
        teamQuestionsAnswered: { 1: 0, 2: 0, 3: 0, 4: 0 },
        currentTeamIndex: firstTeam,
        currentQuestion: {
          team: firstTeam,
          question: randomQuestion.q,
          options: randomQuestion.opts,
          correctAnswer: randomQuestion.ans,
          questionNumber: 1,
          startTime: now,
          votes: {}
        },
        gameStartTime: now,
        gameEndTime: null
      };
      updateGameState(updatedState);
      setGameState(updatedState);
    }
  };

  // Submit a vote for the current question
  const submitVote = async (answerIndex: number) => {
    if (!gameState.currentQuestion) return;
    
    // Check if player is in the current team
    const myPlayer = gameState.players.find(p => p.id === myPlayerId);
    if (!myPlayer || myPlayer.team !== gameState.currentQuestion.team) return;
    
    // Check if already voted
    const currentVotes = gameState.currentQuestion.votes || {};
    if (currentVotes[myPlayerId] !== undefined) return;

    // Update votes in Firebase
    const updatedVotes = {
      ...currentVotes,
      [myPlayerId]: answerIndex
    };

    const updatedState = {
      ...gameState,
      currentQuestion: {
        ...gameState.currentQuestion,
        votes: updatedVotes
      }
    };
    
    await updateGameState(updatedState);
  };

  // Tally votes and move to next question (called by host when timer expires)
  const tallyVotesAndNextQuestion = async () => {
    if (!gameState.currentQuestion || !isHost) return;

    const currentTeam = gameState.currentQuestion.team;
    const votes = gameState.currentQuestion.votes || {};
    const correctAnswer = gameState.currentQuestion.correctAnswer;
    
    // Count correct and wrong votes
    let correctVotes = 0;
    let wrongVotes = 0;
    
    Object.values(votes).forEach(vote => {
      if (vote === correctAnswer) {
        correctVotes++;
      } else {
        wrongVotes++;
      }
    });

    // Update player stats
    const updatedPlayers = gameState.players.map(p => {
      if (p.team === currentTeam && votes[p.id] !== undefined) {
        const isCorrect = votes[p.id] === correctAnswer;
        return {
          ...p,
          correctVotes: (p.correctVotes || 0) + (isCorrect ? 1 : 0),
          wrongVotes: (p.wrongVotes || 0) + (isCorrect ? 0 : 1)
        };
      }
      return p;
    });

    // Update team stats - track correct/wrong answers for ranking
    const updatedTeamScores = { ...(gameState.teamScores || { 1: 0, 2: 0, 3: 0, 4: 0 }) };
    const updatedTeamCorrectAnswers = { ...(gameState.teamCorrectAnswers || { 1: 0, 2: 0, 3: 0, 4: 0 }) };
    const updatedTeamWrongAnswers = { ...(gameState.teamWrongAnswers || { 1: 0, 2: 0, 3: 0, 4: 0 }) };
    
    // Majority correct = gain points, stalemate = no points
    if (correctVotes > wrongVotes) {
      updatedTeamScores[currentTeam] = (updatedTeamScores[currentTeam] || 0) + correctVotes;
      updatedTeamCorrectAnswers[currentTeam] = (updatedTeamCorrectAnswers[currentTeam] || 0) + 1;
    } else if (wrongVotes > correctVotes) {
      // Majority wrong - count as wrong answer
      updatedTeamWrongAnswers[currentTeam] = (updatedTeamWrongAnswers[currentTeam] || 0) + 1;
    }
    // Stalemate (correctVotes === wrongVotes) - no points, no correct/wrong counted

    // Update questions answered for current team
    const updatedTeamQuestionsAnswered = { ...(gameState.teamQuestionsAnswered || { 1: 0, 2: 0, 3: 0, 4: 0 }) };
    updatedTeamQuestionsAnswered[currentTeam] = (updatedTeamQuestionsAnswered[currentTeam] || 0) + 1;

    // Find next team that still has questions remaining
    const activeTeams = [...new Set(gameState.players.map(p => p.team))].filter(t => t !== undefined).sort() as number[];
    let nextTeam: number | null = null;
    let allTeamsCompleted = true;

    // Try to find next team in rotation
    const currentTeamIdx = activeTeams.indexOf(currentTeam);
    for (let i = 1; i <= activeTeams.length; i++) {
      const checkTeamIdx = (currentTeamIdx + i) % activeTeams.length;
      const checkTeam = activeTeams[checkTeamIdx];
      const questionsAnswered = checkTeam === currentTeam 
        ? updatedTeamQuestionsAnswered[checkTeam] 
        : (gameState.teamQuestionsAnswered?.[checkTeam] || 0);
      
      if (questionsAnswered < QUESTIONS_PER_TEAM) {
        nextTeam = checkTeam;
        allTeamsCompleted = false;
        break;
      }
    }

    // Check if current team also completed (in case all teams are done)
    if (updatedTeamQuestionsAnswered[currentTeam] < QUESTIONS_PER_TEAM) {
      allTeamsCompleted = false;
      if (nextTeam === null) {
        nextTeam = currentTeam;
      }
    }

    if (allTeamsCompleted || nextTeam === null) {
      // Game over - all teams completed 10 questions
      const updatedState: GameState = {
        ...gameState,
        players: updatedPlayers,
        teamScores: updatedTeamScores,
        teamCorrectAnswers: updatedTeamCorrectAnswers,
        teamWrongAnswers: updatedTeamWrongAnswers,
        teamQuestionsAnswered: updatedTeamQuestionsAnswered,
        currentQuestion: null,
        gameEndTime: Date.now()
      };
      await updateGameState(updatedState);
    } else {
      // Generate next question for next team
      const randomQuestion = QUESTION_POOL[Math.floor(Math.random() * QUESTION_POOL.length)];
      const nextQuestionNumber = (updatedTeamQuestionsAnswered[nextTeam] || 0) + 1;

      const updatedState: GameState = {
        ...gameState,
        players: updatedPlayers,
        teamScores: updatedTeamScores,
        teamCorrectAnswers: updatedTeamCorrectAnswers,
        teamWrongAnswers: updatedTeamWrongAnswers,
        teamQuestionsAnswered: updatedTeamQuestionsAnswered,
        currentTeamIndex: nextTeam,
        currentQuestion: {
          team: nextTeam,
          question: randomQuestion.q,
          options: randomQuestion.opts,
          correctAnswer: randomQuestion.ans,
          questionNumber: nextQuestionNumber,
          startTime: Date.now(),
          votes: {}
        }
      };
      await updateGameState(updatedState);
    }
  };

  const calculateTeamRankings = () => {
    const teams = [1, 2, 3, 4];
    const teamStats = teams.map(teamNum => {
      const teamPlayers = gameState.players.filter(p => p.team === teamNum);
      const score = gameState.teamScores?.[teamNum] || 0;
      const questionsAnswered = gameState.teamQuestionsAnswered?.[teamNum] || 0;
      const correctAnswers = gameState.teamCorrectAnswers?.[teamNum] || 0;
      const wrongAnswers = gameState.teamWrongAnswers?.[teamNum] || 0;
      
      return {
        team: teamNum,
        players: teamPlayers,
        score,
        questionsAnswered,
        correctAnswers,
        wrongAnswers
      };
    }).filter(t => t.players.length > 0); // Only include teams with players

    // Sort by most correct answers first, then by least wrong answers
    return teamStats.sort((a, b) => {
      if (b.correctAnswers !== a.correctAnswers) {
        return b.correctAnswers - a.correctAnswers; // Most correct first
      }
      return a.wrongAnswers - b.wrongAnswers; // Least wrong as tiebreaker
    });
  };

  const rankPlayersInTeam = (teamPlayers: Player[]) => {
    return [...teamPlayers].sort((a, b) => {
      const aCorrect = a.correctVotes || 0;
      const bCorrect = b.correctVotes || 0;
      const aWrong = a.wrongVotes || 0;
      const bWrong = b.wrongVotes || 0;
      
      // Sort by most correct votes first, then by least wrong votes
      if (bCorrect !== aCorrect) {
        return bCorrect - aCorrect; // Most correct first
      }
      return aWrong - bWrong; // Least wrong as tiebreaker
    });
  };

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
              className="max-w-lg mx-auto mt-16"
            >
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-3xl p-10 border border-gold-500/30 shadow-2xl">
                {/* Header with Icon */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-gold-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-4xl">🏛️</span>
                  </div>
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-red-500">
                    Góp phần xây dựng đất nước
                  </h2>
                  <p className="text-gray-400 mt-2">Trò chơi đội nhóm trực tuyến</p>
                </div>
                
                {/* Player Name Input */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">👤 Tên người chơi</label>
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn..."
                    className="w-full bg-gray-700/70 border border-gray-600 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-lg"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                </div>

                {/* Join Room Section */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">🔑 Tham gia phòng có sẵn</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Nhập mã phòng"
                      className="flex-1 bg-gray-700/70 border border-gray-600 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      maxLength={4}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={joinRoom}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                    >
                      Tham gia
                    </motion.button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                  <span className="text-gray-500 text-sm">hoặc</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                </div>

                {/* Create Room Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(234, 179, 8, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createRoom}
                  className="w-full bg-gradient-to-r from-gold-500 via-yellow-500 to-gold-600 hover:from-gold-400 hover:via-yellow-400 hover:to-gold-500 py-4 rounded-xl font-bold text-lg text-black shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-xl">➕</span>
                  Tạo phòng mới
                </motion.button>

                {/* Back Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className="w-full mt-4 bg-gray-700/70 hover:bg-gray-600/70 border border-gray-600 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>←</span>
                  Quay lại
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
            className="max-w-4xl mx-auto mt-8"
          >
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-3xl p-8 border border-gold-500/30 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl">⏳</span>
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Phòng chờ</h2>
                
                {/* Room Code Display */}
                {roomCode && (
                  <div className="mt-6 bg-gradient-to-r from-gray-700/80 to-gray-800/80 rounded-2xl p-6 max-w-sm mx-auto border border-gray-600">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Mã Phòng</p>
                    <div className="text-gold-400 text-4xl font-mono font-bold tracking-[0.3em]">{roomCode}</div>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigator.clipboard.writeText(roomCode);
                        alert('Đã sao chép mã phòng!');
                      }}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                      <span>📋</span> Sao chép mã
                    </motion.button>
                  </div>
                )}
                <p className="text-gray-400 text-sm mt-4">
                  {isHost ? '👑 Bạn là Host • Chia sẻ mã phòng với bạn bè để họ tham gia' : '⏳ Đang chờ host bắt đầu game...'}
                </p>
              </div>

              {/* Teams Display */}
              <div className="mb-8">
                <h3 className="text-center text-gray-400 text-sm uppercase tracking-wider mb-4">Người chơi theo đội</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Team 1 - Công nhân */}
                  <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-4 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-500/30">
                      <span className="text-lg">🔴</span>
                      <span className="font-bold text-red-400">Công nhân</span>
                    </div>
                    <div className="space-y-2">
                      {gameState.players.filter(p => p.team === 1).map(player => (
                        <div key={player.id} className="bg-gray-700/50 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                          <span>👤</span>
                          <span className="truncate">{player.name}</span>
                          {player.id === myPlayerId && <span className="text-gold-400">★</span>}
                        </div>
                      ))}
                      {gameState.players.filter(p => p.team === 1).length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-2">Chưa có ai</div>
                      )}
                    </div>
                  </div>

                  {/* Team 2 - Nông dân */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-500/30">
                      <span className="text-lg">🔵</span>
                      <span className="font-bold text-blue-400">Nông dân</span>
                    </div>
                    <div className="space-y-2">
                      {gameState.players.filter(p => p.team === 2).map(player => (
                        <div key={player.id} className="bg-gray-700/50 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                          <span>👤</span>
                          <span className="truncate">{player.name}</span>
                          {player.id === myPlayerId && <span className="text-gold-400">★</span>}
                        </div>
                      ))}
                      {gameState.players.filter(p => p.team === 2).length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-2">Chưa có ai</div>
                      )}
                    </div>
                  </div>

                  {/* Team 3 - Trí thức */}
                  <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/30">
                      <span className="text-lg">🟡</span>
                      <span className="font-bold text-yellow-400">Trí thức</span>
                    </div>
                    <div className="space-y-2">
                      {gameState.players.filter(p => p.team === 3).map(player => (
                        <div key={player.id} className="bg-gray-700/50 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                          <span>👤</span>
                          <span className="truncate">{player.name}</span>
                          {player.id === myPlayerId && <span className="text-gold-400">★</span>}
                        </div>
                      ))}
                      {gameState.players.filter(p => p.team === 3).length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-2">Chưa có ai</div>
                      )}
                    </div>
                  </div>

                  {/* Team 4 - Tư sản */}
                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/30">
                      <span className="text-lg">🟢</span>
                      <span className="font-bold text-green-400">Tư sản</span>
                    </div>
                    <div className="space-y-2">
                      {gameState.players.filter(p => p.team === 4).map(player => (
                        <div key={player.id} className="bg-gray-700/50 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                          <span>👤</span>
                          <span className="truncate">{player.name}</span>
                          {player.id === myPlayerId && <span className="text-gold-400">★</span>}
                        </div>
                      ))}
                      {gameState.players.filter(p => p.team === 4).length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-2">Chưa có ai</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="flex gap-4">
                {isHost && (
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(234, 179, 8, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startGame}
                    disabled={gameState.players.length < 2}
                    className="flex-1 bg-gradient-to-r from-gold-500 via-yellow-500 to-gold-600 disabled:from-gray-600 disabled:to-gray-700 py-4 rounded-xl font-bold text-lg text-black disabled:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">🚀</span>
                    Bắt đầu trò chơi
                  </motion.button>
                )}
                {!isHost && (
                  <div className="flex-1 bg-gray-700/70 border border-gray-600 py-4 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                    <span className="animate-pulse">⏳</span>
                    Đang chờ host bắt đầu...
                  </div>
                )}
              </div>

              {/* Player Count */}
              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-3 bg-gray-700/50 rounded-full px-6 py-2 border border-gray-600">
                  <span className="text-2xl">👥</span>
                  <span className="text-lg">
                    <span className="font-bold text-gold-400">{gameState.players.length}</span>
                    <span className="text-gray-400">/40 người chơi</span>
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className={`text-sm ${gameState.players.length >= 2 ? 'text-green-400' : 'text-red-400'}`}>
                    {gameState.players.length >= 2 ? '✓ Sẵn sàng' : 'Cần tối thiểu 2 người'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Board */}
        {gameState.gameStarted && !gameState.gameEndTime && (
          <div className="max-w-7xl mx-auto px-4">
            {/* Current Question Display - Full Width */}
            {gameState.currentQuestion && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border-2 border-gold-500/30"
              >
                {/* Question Timer */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {gameState.currentQuestion.team === 1 ? '🔴' : 
                       gameState.currentQuestion.team === 2 ? '🔵' : 
                       gameState.currentQuestion.team === 3 ? '🟡' : '🟢'}
                    </span>
                    <h2 className="text-xl font-bold">
                      Đội {gameState.currentQuestion.team} - Câu {gameState.currentQuestion.questionNumber}/{QUESTIONS_PER_TEAM}
                    </h2>
                  </div>
                  <div className={`text-3xl font-bold ${
                    questionTimeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gold-400'
                  }`}>
                    ⏱️ {questionTimeLeft}s
                  </div>
                </div>

                {/* Question */}
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-lg font-semibold text-white text-center">
                    {gameState.currentQuestion.question}
                  </p>
                </div>

                {/* Voting Status */}
                <div className="mb-4 text-center">
                  {(() => {
                    const myPlayer = gameState.players.find(p => p.id === myPlayerId);
                    const isMyTeam = myPlayer?.team === gameState.currentQuestion?.team;
                    const votes = gameState.currentQuestion?.votes || {};
                    const hasVoted = votes[myPlayerId] !== undefined;
                    const teamPlayers = gameState.players.filter(p => p.team === gameState.currentQuestion?.team);
                    const votedCount = Object.keys(votes).length;

                    if (!isMyTeam) {
                      return (
                        <div className="bg-gray-600 rounded-lg p-3">
                          <p className="text-gray-300">⏳ Đang chờ Đội {gameState.currentQuestion?.team} trả lời...</p>
                          <p className="text-sm text-gray-400 mt-1">Đã vote: {votedCount}/{teamPlayers.length}</p>
                        </div>
                      );
                    }

                    if (hasVoted) {
                      return (
                        <div className="bg-green-600/30 border border-green-500 rounded-lg p-3">
                          <p className="text-green-400 font-semibold">✓ Bạn đã vote! Đang chờ đồng đội...</p>
                          <p className="text-sm text-gray-300 mt-1">Đã vote: {votedCount}/{teamPlayers.length}</p>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-gold-500/20 border border-gold-500 rounded-lg p-3">
                        <p className="text-gold-400 font-semibold">🗳️ Lượt của đội bạn! Hãy vote đáp án!</p>
                        <p className="text-sm text-gray-300 mt-1">Đã vote: {votedCount}/{teamPlayers.length}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gameState.currentQuestion.options.map((option, index) => {
                    const myPlayer = gameState.players.find(p => p.id === myPlayerId);
                    const isMyTeam = myPlayer?.team === gameState.currentQuestion?.team;
                    const votes = gameState.currentQuestion?.votes || {};
                    const hasVoted = votes[myPlayerId] !== undefined;
                    const myVote = votes[myPlayerId];
                    const isSelected = myVote === index;

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: isMyTeam && !hasVoted ? 1.02 : 1 }}
                        whileTap={{ scale: isMyTeam && !hasVoted ? 0.98 : 1 }}
                        onClick={() => isMyTeam && !hasVoted && submitVote(index)}
                        disabled={!isMyTeam || hasVoted}
                        className={`rounded-lg p-4 text-left font-semibold transition-all ${
                          isSelected 
                            ? 'bg-gold-500/40 border-2 border-gold-500' 
                            : hasVoted || !isMyTeam
                              ? 'bg-gray-600 border-2 border-gray-500 opacity-60 cursor-not-allowed'
                              : 'bg-gray-700 hover:bg-gold-500/20 border-2 border-gray-600 hover:border-gold-500'
                        }`}
                      >
                        <span className="text-gold-400 mr-3">{['A', 'B', 'C', 'D'][index]}.</span>
                        {option}
                        {isSelected && <span className="ml-2 text-gold-400">✓</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Main Layout: 3 columns on large screens */}
            <div className="grid lg:grid-cols-[1fr_2fr_1fr] gap-4">
              
              {/* LEFT COLUMN - Team 1 & 3 Info */}
              <div className="space-y-4">
                {/* Team 1 (Red) */}
                {(() => {
                  const team1Players = gameState.players.filter(p => p.team === 1);
                  const isCurrentTeam = gameState.currentQuestion?.team === 1;
                  return team1Players.length > 0 && (
                    <div className={`bg-gray-800 rounded-xl p-4 border-l-4 border-red-500 ${isCurrentTeam ? 'ring-2 ring-red-500' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-red-400">🔴 Công nhân {isCurrentTeam && '← Đang trả lời'}</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[1] || 0} điểm</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">Câu hỏi: {gameState.teamQuestionsAnswered?.[1] || 0}/{QUESTIONS_PER_TEAM}</div>
                      {team1Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctVotes || 0}</span>
                            <span className="text-red-400">✗{player.wrongVotes || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Team 3 (Yellow/Orange) */}
                {(() => {
                  const team3Players = gameState.players.filter(p => p.team === 3);
                  const isCurrentTeam = gameState.currentQuestion?.team === 3;
                  return team3Players.length > 0 && (
                    <div className={`bg-gray-800 rounded-xl p-4 border-l-4 border-yellow-500 ${isCurrentTeam ? 'ring-2 ring-yellow-500' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-yellow-400">🟡 Trí thức {isCurrentTeam && '← Đang trả lời'}</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[3] || 0} điểm</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">Câu hỏi: {gameState.teamQuestionsAnswered?.[3] || 0}/{QUESTIONS_PER_TEAM}</div>
                      {team3Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctVotes || 0}</span>
                            <span className="text-red-400">✗{player.wrongVotes || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* CENTER COLUMN - Game Board */}
              <div className="space-y-4">
                {/* Game Board - CENTER */}
                <div className="bg-gray-800 rounded-xl p-6 border-2 border-gold-500/30">
                  <h3 className="text-2xl font-bold mb-4 text-center text-gold-400">�️ Góp phần xây dựng đất nước</h3>
                  <div className="relative aspect-square max-w-full mx-auto">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Board Background */}
                        <rect x="0" y="0" width="400" height="400" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
                        
                        {/* Home Areas - 4 corners */}
                        {/* Red (Top-Left) */}
                        <rect x="20" y="20" width="140" height="140" fill="#ef4444" opacity={gameState.currentQuestion?.team === 1 ? "0.6" : "0.3"} stroke="#ef4444" strokeWidth="3" rx="8"/>
                        {/* Blue (Top-Right) */}
                        <rect x="240" y="20" width="140" height="140" fill="#3b82f6" opacity={gameState.currentQuestion?.team === 2 ? "0.6" : "0.3"} stroke="#3b82f6" strokeWidth="3" rx="8"/>
                        {/* Yellow/Orange (Bottom-Left) */}
                        <rect x="20" y="240" width="140" height="140" fill="#f59e0b" opacity={gameState.currentQuestion?.team === 3 ? "0.6" : "0.3"} stroke="#f59e0b" strokeWidth="3" rx="8"/>
                        {/* Green (Bottom-Right) */}
                        <rect x="240" y="240" width="140" height="140" fill="#10b981" opacity={gameState.currentQuestion?.team === 4 ? "0.6" : "0.3"} stroke="#10b981" strokeWidth="3" rx="8"/>
                        
                        {/* Center finish area */}
                        <rect x="170" y="170" width="60" height="60" fill="#fbbf24" opacity="0.5" stroke="#fbbf24" strokeWidth="2" rx="4"/>
                        
                        {/* Team scores in corners */}
                        <text x="90" y="70" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">Công nhân</text>
                        <text x="90" y="95" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">✓ {gameState.teamCorrectAnswers?.[1] || 0}</text>
                        <text x="90" y="115" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">✗ {gameState.teamWrongAnswers?.[1] || 0}</text>
                        <text x="90" y="135" textAnchor="middle" fill="#9ca3af" fontSize="11">Câu: {gameState.teamQuestionsAnswered?.[1] || 0}/{QUESTIONS_PER_TEAM}</text>
                        
                        <text x="310" y="70" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">Nông dân</text>
                        <text x="310" y="95" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">✓ {gameState.teamCorrectAnswers?.[2] || 0}</text>
                        <text x="310" y="115" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">✗ {gameState.teamWrongAnswers?.[2] || 0}</text>
                        <text x="310" y="135" textAnchor="middle" fill="#9ca3af" fontSize="11">Câu: {gameState.teamQuestionsAnswered?.[2] || 0}/{QUESTIONS_PER_TEAM}</text>
                        
                        <text x="90" y="280" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold">Trí thức</text>
                        <text x="90" y="305" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">✓ {gameState.teamCorrectAnswers?.[3] || 0}</text>
                        <text x="90" y="325" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">✗ {gameState.teamWrongAnswers?.[3] || 0}</text>
                        <text x="90" y="345" textAnchor="middle" fill="#9ca3af" fontSize="11">Câu: {gameState.teamQuestionsAnswered?.[3] || 0}/{QUESTIONS_PER_TEAM}</text>
                        
                        <text x="310" y="280" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold">Tư sản</text>
                        <text x="310" y="305" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">✓ {gameState.teamCorrectAnswers?.[4] || 0}</text>
                        <text x="310" y="325" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">✗ {gameState.teamWrongAnswers?.[4] || 0}</text>
                        <text x="310" y="345" textAnchor="middle" fill="#9ca3af" fontSize="11">Câu: {gameState.teamQuestionsAnswered?.[4] || 0}/{QUESTIONS_PER_TEAM}</text>
                        
                        {/* Center - Current Team Turn */}
                        <text x="200" y="190" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">
                          {gameState.currentQuestion ? ['Công nhân', 'Nông dân', 'Trí thức', 'Tư sản'][gameState.currentQuestion.team - 1] : 'Chờ...'}
                        </text>
                        <text x="200" y="210" textAnchor="middle" fill="#9ca3af" fontSize="10">
                          {gameState.currentQuestion ? `Câu ${gameState.currentQuestion.questionNumber}` : ''}
                        </text>
                      </svg>
                    </div>
                </div>

                {/* Game Info */}
                <div className="bg-gray-800 rounded-xl p-4 border-2 border-gold-500/30">
                  <h3 className="text-sm font-bold mb-3 text-center text-gold-400">📊 Thông tin trò chơi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Mỗi câu hỏi:</span>
                      <span className="font-bold text-gold-400">{QUESTION_TIME_LIMIT}s</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Tổng câu hỏi/đội:</span>
                      <span className="font-bold text-gold-400">{QUESTIONS_PER_TEAM}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Cách tính điểm:</span>
                      <span className="font-bold text-green-400">Đa số đúng = +điểm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Team 2 & 4 Info */}
              <div className="space-y-4">
                {/* Team 2 (Blue) */}
                {(() => {
                  const team2Players = gameState.players.filter(p => p.team === 2);
                  const isCurrentTeam = gameState.currentQuestion?.team === 2;
                  return team2Players.length > 0 && (
                    <div className={`bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500 ${isCurrentTeam ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-blue-400">🔵 Nông dân {isCurrentTeam && '← Đang trả lời'}</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[2] || 0} điểm</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">Câu hỏi: {gameState.teamQuestionsAnswered?.[2] || 0}/{QUESTIONS_PER_TEAM}</div>
                      {team2Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctVotes || 0}</span>
                            <span className="text-red-400">✗{player.wrongVotes || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Team 4 (Green) */}
                {(() => {
                  const team4Players = gameState.players.filter(p => p.team === 4);
                  const isCurrentTeam = gameState.currentQuestion?.team === 4;
                  return team4Players.length > 0 && (
                    <div className={`bg-gray-800 rounded-xl p-4 border-l-4 border-green-500 ${isCurrentTeam ? 'ring-2 ring-green-500' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-green-400">🟢 Tư sản {isCurrentTeam && '← Đang trả lời'}</h3>
                        <span className="text-gold-400 font-bold">{gameState.teamScores?.[4] || 0} điểm</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">Câu hỏi: {gameState.teamQuestionsAnswered?.[4] || 0}/{QUESTIONS_PER_TEAM}</div>
                      {team4Players.map(player => (
                        <div key={player.id} className="bg-gray-700 rounded p-2 mb-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              <span className="font-semibold truncate">{player.name}</span>
                              {player.id === myPlayerId && <span className="text-xs text-gold-400">★</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-2">
                            <span className="text-green-400">✓{player.correctVotes || 0}</span>
                            <span className="text-red-400">✗{player.wrongVotes || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
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
                <p className="text-gray-400">Tất cả các đội đã hoàn thành {QUESTIONS_PER_TEAM} câu hỏi!</p>
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
                          <span className="text-xl font-bold">
                            {teamStat.team === 1 ? '🔴' : teamStat.team === 2 ? '🔵' : teamStat.team === 3 ? '🟡' : '🟢'} Đội {teamStat.team}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gold-400">
                            {teamStat.score} điểm
                          </div>
                          <div className="text-sm text-gray-400">
                            {teamStat.questionsAnswered}/{QUESTIONS_PER_TEAM} câu hỏi
                          </div>
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
                              <span className="text-green-400">✓ {player.correctVotes || 0}</span>
                              <span className="text-red-400">✗ {player.wrongVotes || 0}</span>
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



