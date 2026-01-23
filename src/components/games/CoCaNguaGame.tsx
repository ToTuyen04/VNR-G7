import { initializeApp } from 'firebase/app'
import {
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { QUESTION_POOL } from '../../data/questions'

interface Player {
  id: string
  name: string
  color: string
  pieces: PiecePosition[]
  isReady: boolean
  team?: number // Team 1, 2, 3, or 4
  correctVotes?: number // Number of correct votes
  wrongVotes?: number // Number of wrong votes
}

interface PiecePosition {
  position: number // -1 = home, 0-51 = board, 52+ = finish
  isFinished: boolean
}

interface GameState {
  players: Player[]
  currentPlayerIndex: number
  diceValue: number | null
  gameStarted: boolean
  winner: string | null
  currentTeamIndex?: number // Which team (1-6) is currently answering
  teamQuestionsAnswered?: { [key: number]: number } // Questions answered per team
  currentQuestion?: {
    team: number // Which team this question is for
    question: string
    options: string[]
    correctAnswer: number
    questionNumber: number
    startTime: number // When question started (20s or 30s timer)
    votes: { [playerId: string]: number } // Player votes (answer index)
    type: 'independent' | 'alliance' // Type of question
    alliancePartner?: number // Team number of alliance partner (only for alliance type)
  } | null
  teamScores?: { [key: number]: number } // Team scores
  teamCorrectAnswers?: { [key: number]: number } // Correct answers per team
  teamWrongAnswers?: { [key: number]: number } // Wrong answers per team
  gameStartTime?: number | null // Timestamp when game started
  gameEndTime?: number | null // Timestamp when game ended
  lobbyCountdownActive?: boolean // Whether lobby countdown is active
  lobbyCountdownStartTime?: number | null // When lobby countdown started
  gameMode?: 'normal' | 'alliance' | 'both' // Game mode selected by host
}

interface CoCaNguaGameProps {
  onBack: () => void
}

const PLAYER_COLORS = [
  '#EF4444',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#DC2626',
  '#2563EB',
  '#059669',
  '#D97706',
  '#7C3AED',
  '#DB2777',
  '#0D9488',
  '#EA580C',
  '#B91C1C',
  '#1D4ED8',
  '#047857',
  '#B45309',
  '#6D28D9',
  '#BE185D',
  '#0F766E',
  '#C2410C',
  '#991B1B',
  '#1E40AF',
  '#065F46',
  '#92400E',
  '#5B21B6',
  '#9F1239',
  '#134E4A',
  '#9A3412',
  '#7F1D1D',
  '#1E3A8A',
  '#064E3B',
  '#78350F',
  '#4C1D95',
  '#831843',
  '#115E59',
  '#7C2D12',
]
const MAX_PLAYERS = 30 // Maximum 30 players
const MAX_TEAMS = 6 // 6 teams
const MAX_PLAYERS_PER_TEAM = 5 // Maximum 5 players per team
const QUESTIONS_PER_TEAM = 10
const INDEPENDENT_QUESTION_TIME = 15 // 15 seconds for independent questions
const ALLIANCE_QUESTION_TIME = 15 // 15 seconds for alliance questions
const PIECES_PER_PLAYER = 4
const LOBBY_COUNTDOWN_TIME = 10 // 10 seconds lobby countdown before game starts
const INDEPENDENT_QUESTION_POINTS = 10 // Points for independent questions
const ALLIANCE_QUESTION_POINTS = 15 // Points for alliance questions

// Team configuration: 6 teams with new colors and names
const TEAMS = [
  { id: 1, name: 'Công nhân', color: '#3B82F6', emoji: '🔵' }, // Blue
  { id: 2, name: 'Nông dân', color: '#EAB308', emoji: '🟡' }, // Yellow
  { id: 3, name: 'Trí thức', color: '#FFFFFF', emoji: '⚪' }, // White
  { id: 4, name: 'Doanh nhân', color: '#991B1B', emoji: '🔴' }, // Dark Red
  { id: 5, name: 'Thanh niên', color: '#10B981', emoji: '🟢' }, // Green
  { id: 6, name: 'Phụ nữ', color: '#A855F7', emoji: '🟣' }, // Purple
]

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCdS2P5PiRST5kZBDZ3rnacQAvgAGvdfkk',
  authDomain: 'laazytestground.firebaseapp.com',
  databaseURL:
    'https://laazytestground-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'laazytestground',
  storageBucket: 'laazytestground.firebasestorage.app',
  messagingSenderId: '434377008546',
  appId: '1:434377008546:web:0c548dad6aee8419dcfefb',
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const CoCaNguaGame = ({ onBack }: CoCaNguaGameProps) => {
  const [roomCode, setRoomCode] = useState('')
  const [myPlayerId, setMyPlayerId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isInRoom, setIsInRoom] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(
    INDEPENDENT_QUESTION_TIME
  )
  const [lobbyCountdown, setLobbyCountdown] =
    useState<number>(LOBBY_COUNTDOWN_TIME)
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
    teamQuestionsAnswered: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    teamScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    teamCorrectAnswers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    teamWrongAnswers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    lobbyCountdownActive: false,
    lobbyCountdownStartTime: null,
    gameMode: 'both', // Default to both modes
  })

  // Room reference
  const roomRef = roomCode ? ref(database, `rooms/${roomCode}`) : null

  // Lobby countdown timer - 10 seconds before game starts
  useEffect(() => {
    if (!gameState.lobbyCountdownActive || !gameState.lobbyCountdownStartTime)
      return

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - gameState.lobbyCountdownStartTime!) / 1000
      )
      const remaining = Math.max(0, LOBBY_COUNTDOWN_TIME - elapsed)
      setLobbyCountdown(remaining)

      // Countdown finished - host starts the actual game
      if (remaining <= 0 && isHost) {
        actuallyStartGame()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [
    gameState.lobbyCountdownActive,
    gameState.lobbyCountdownStartTime,
    isHost,
  ])

  // Question timer - dynamic based on question type
  useEffect(() => {
    if (
      !gameState.gameStarted ||
      gameState.gameEndTime ||
      !gameState.currentQuestion
    )
      return

    const timeLimit =
      gameState.currentQuestion.type === 'alliance'
        ? ALLIANCE_QUESTION_TIME
        : INDEPENDENT_QUESTION_TIME

    // Reset timer immediately when new question starts
    const elapsed = Math.floor(
      (Date.now() - gameState.currentQuestion.startTime) / 1000
    )
    const remaining = Math.max(0, timeLimit - elapsed)
    setQuestionTimeLeft(remaining)

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - gameState.currentQuestion!.startTime) / 1000
      )
      const remaining = Math.max(0, timeLimit - elapsed)
      setQuestionTimeLeft(remaining)

      // Time's up for this question - host tallies votes
      if (remaining <= 0 && isHost) {
        tallyVotesAndNextQuestion()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [
    gameState.gameStarted,
    gameState.currentQuestion,
    gameState.gameEndTime,
    isHost,
  ])

  // Check if all team members have voted - immediately reveal answer
  useEffect(() => {
    if (
      !gameState.gameStarted ||
      gameState.gameEndTime ||
      !gameState.currentQuestion ||
      !isHost
    )
      return

    const currentTeam = gameState.currentQuestion.team
    const questionType = gameState.currentQuestion.type
    const alliancePartner = gameState.currentQuestion.alliancePartner

    // Calculate total expected voters based on question type
    const participatingPlayers =
      questionType === 'alliance' && alliancePartner
        ? gameState.players.filter(
            (p) => p.team === currentTeam || p.team === alliancePartner
          )
        : gameState.players.filter((p) => p.team === currentTeam)

    const votes = gameState.currentQuestion.votes || {}
    const voteCount = Object.keys(votes).length

    // If all participating members have voted, immediately tally
    if (
      participatingPlayers.length > 0 &&
      voteCount >= participatingPlayers.length
    ) {
      tallyVotesAndNextQuestion()
    }
  }, [gameState.currentQuestion?.votes, isHost])

  // Listen to room changes
  useEffect(() => {
    if (!roomCode || !isInRoom) return

    const roomDbRef = ref(database, `rooms/${roomCode}`)

    const unsubscribe = onValue(roomDbRef, (snapshot) => {
      const data = snapshot.val()
      if (data && data.gameState) {
        console.log('🔄 Room data updated:', data)
        // Ensure players array exists
        const updatedState = {
          ...data.gameState,
          players: data.gameState.players || [],
        }
        setGameState(updatedState)
      } else if (!data) {
        console.log('⚠️ Room no longer exists')
        if (!isHost) {
          alert('Phòng đã bị đóng!')
          setIsInRoom(false)
          setRoomCode('')
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [roomCode, isInRoom, isHost])

  // Cleanup room on unmount for host
  useEffect(() => {
    return () => {
      if (isHost && roomCode && isInRoom) {
        remove(ref(database, `rooms/${roomCode}`)).catch(console.error)
      }
    }
  }, [isHost, roomCode, isInRoom])

  const updateGameState = async (newState: GameState) => {
    if (!roomCode) return

    try {
      // Clean undefined values - Firebase doesn't accept undefined
      const cleanState = JSON.parse(
        JSON.stringify(newState, (_key, value) =>
          value === undefined ? null : value
        )
      )

      await update(ref(database, `rooms/${roomCode}`), {
        gameState: cleanState,
      })
      console.log('✅ Game state updated')
    } catch (error) {
      console.error('❌ Error updating game state:', error)
    }
  }

  const createRoom = async () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên của bạn!')
      return
    }

    // Generate room code
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    const playerId = `host_${Date.now()}`

    console.log('🏠 Creating room with code:', code)

    // Host is not a player, just manages the room
    const initialState = {
      players: [],
      currentPlayerIndex: 0,
      diceValue: null,
      gameStarted: false,
      winner: null,
    }

    try {
      // Save room data
      await set(ref(database, `rooms/${code}`), {
        gameState: initialState,
      })

      // Update local state after successful save
      setRoomCode(code)
      setMyPlayerId(playerId)
      setIsHost(true)
      setIsInRoom(true)
      setGameState(initialState)

      console.log('✅ Room created successfully:', code)
    } catch (error) {
      console.error('❌ Error creating room:', error)
      alert('Lỗi khi tạo phòng! Vui lòng thử lại.')
    }
  }

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      alert('Vui lòng nhập tên và mã phòng!')
      return
    }

    const playerId = `player_${Date.now()}`
    setMyPlayerId(playerId)

    try {
      // Check if room exists
      if (!roomRef) {
        alert('Vui lòng nhập mã phòng!')
        return
      }
      const roomSnapshot = await get(roomRef)
      if (!roomSnapshot.exists()) {
        alert('Phòng không tồn tại! Vui lòng kiểm tra lại mã phòng.')
        return
      }

      const roomData = roomSnapshot.val()
      const currentState = roomData.gameState

      if (!currentState) {
        alert('Dữ liệu phòng không hợp lệ!')
        return
      }

      // Ensure players array exists
      const players = currentState.players || []

      if (players.length >= MAX_PLAYERS) {
        alert(`Phòng đã đầy! (Tối đa ${MAX_PLAYERS} người chơi)`)
        return
      }

      if (currentState.gameStarted) {
        alert('Game đã bắt đầu! Không thể tham gia.')
        return
      }

      if (currentState.lobbyCountdownActive) {
        alert('Game sắp bắt đầu! Không thể tham gia lúc này.')
        return
      }

      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        color: PLAYER_COLORS[players.length],
        pieces: Array(PIECES_PER_PLAYER)
          .fill(null)
          .map(() => ({ position: -1, isFinished: false })),
        isReady: false,
        // team will be set when player chooses
      }

      const updatedState = {
        ...currentState,
        players: [...players, newPlayer],
      }

      if (roomRef) {
        await set(roomRef, { gameState: updatedState })
      }
      setIsInRoom(true)
      setGameState(updatedState)
      console.log('✅ Joined room:', roomCode)
    } catch (error) {
      console.error('❌ Error joining room:', error)
      alert('Lỗi khi tham gia phòng! Vui lòng thử lại.')
    }
  }

  // Player chooses a team
  const chooseTeam = async (teamNumber: number) => {
    if (!myPlayerId || !gameState) return

    // Check if team is full
    const teamPlayers = gameState.players.filter((p) => p.team === teamNumber)
    if (teamPlayers.length >= MAX_PLAYERS_PER_TEAM) {
      alert(
        `Đội ${TEAMS.find((t) => t.id === teamNumber)?.name} đã đầy! (Tối đa ${MAX_PLAYERS_PER_TEAM} người)`
      )
      return
    }

    const updatedPlayers = gameState.players.map((p) =>
      p.id === myPlayerId ? { ...p, team: teamNumber } : p
    )

    const updatedState = {
      ...gameState,
      players: updatedPlayers,
    }

    await updateGameState(updatedState)
    setGameState(updatedState)
  }

  // Update game mode (host only)
  const updateGameMode = async (mode: 'normal' | 'alliance' | 'both') => {
    if (!isHost) return

    const updatedState = {
      ...gameState,
      gameMode: mode,
    }

    await updateGameState(updatedState)
    setGameState(updatedState)
  }

  const startGame = () => {
    // Check if all players have chosen a team
    const playersWithoutTeam = gameState.players.filter(
      (p) => !p.team && p.team !== 0
    )
    if (playersWithoutTeam.length > 0) {
      alert('Tất cả người chơi phải chọn đội trước khi bắt đầu!')
      return
    }

    if (gameState.players.length < 2) {
      alert('Cần ít nhất 2 người chơi để bắt đầu!')
      return
    }

    // Check if at least 2 teams have players
    const teamsWithPlayers = [
      ...new Set(gameState.players.map((p) => p.team).filter((t) => t)),
    ]
    if (teamsWithPlayers.length < 2) {
      alert('Cần ít nhất 2 đội có người chơi để bắt đầu!')
      return
    }

    if (isHost) {
      // Start lobby countdown
      const now = Date.now()
      const updatedState: GameState = {
        ...gameState,
        lobbyCountdownActive: true,
        lobbyCountdownStartTime: now,
      }
      updateGameState(updatedState)
      setGameState(updatedState)
      setLobbyCountdown(LOBBY_COUNTDOWN_TIME)
    }
  }

  // Generate question based on game mode
  const generateQuestion = (
    teamNum: number,
    questionNum: number,
    activeTeams: number[]
  ) => {
    const randomQuestion =
      QUESTION_POOL[Math.floor(Math.random() * QUESTION_POOL.length)]
    const gameMode = gameState.gameMode || 'both'

    // Determine question type based on game mode
    let questionType: 'independent' | 'alliance' = 'independent'
    let alliancePartner: number | undefined = undefined

    if (
      gameMode === 'alliance' ||
      (gameMode === 'both' && Math.random() < 0.3)
    ) {
      // Alliance question (30% chance in 'both' mode, 100% in 'alliance' mode)
      questionType = 'alliance'
      // Pick a random team that's not the current team
      const otherTeams = activeTeams.filter((t) => t !== teamNum)
      if (otherTeams.length > 0) {
        alliancePartner =
          otherTeams[Math.floor(Math.random() * otherTeams.length)]
      }
    }

    return {
      team: teamNum,
      question: randomQuestion.q,
      options: randomQuestion.opts,
      correctAnswer: randomQuestion.ans,
      questionNumber: questionNum,
      startTime: Date.now(),
      votes: {},
      type: questionType,
      alliancePartner,
    }
  }

  // Actually start the game after countdown finishes
  const actuallyStartGame = () => {
    if (!isHost) return

    // Teams are already assigned, just start the game
    // Get active teams (teams with players)
    const activeTeams = [
      ...new Set(gameState.players.map((p) => p.team).filter((t) => t)),
    ].sort() as number[]
    const firstTeam = activeTeams[0] || 1

    const now = Date.now()

    const updatedState: GameState = {
      ...gameState,
      gameStarted: true,
      lobbyCountdownActive: false,
      lobbyCountdownStartTime: null,
      teamScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      teamQuestionsAnswered: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      currentTeamIndex: firstTeam,
      currentQuestion: generateQuestion(firstTeam, 1, activeTeams),
      gameStartTime: now,
      gameEndTime: null,
    }
    updateGameState(updatedState)
    setGameState(updatedState)
  }

  // Submit a vote for the current question
  const submitVote = async (answerIndex: number) => {
    if (!gameState.currentQuestion) return

    const myPlayer = gameState.players.find((p) => p.id === myPlayerId)
    if (!myPlayer) return

    // Check if player is in the participating team(s)
    const isParticipating =
      gameState.currentQuestion.type === 'alliance'
        ? myPlayer.team === gameState.currentQuestion.team ||
          myPlayer.team === gameState.currentQuestion.alliancePartner
        : myPlayer.team === gameState.currentQuestion.team

    if (!isParticipating) return

    // Check if already voted
    const currentVotes = gameState.currentQuestion.votes || {}
    if (currentVotes[myPlayerId] !== undefined) return

    // Update votes in Firebase
    const updatedVotes = {
      ...currentVotes,
      [myPlayerId]: answerIndex,
    }

    const updatedState = {
      ...gameState,
      currentQuestion: {
        ...gameState.currentQuestion,
        votes: updatedVotes,
      },
    }

    await updateGameState(updatedState)
  }

  // Tally votes and move to next question (called by host when timer expires)
  const tallyVotesAndNextQuestion = async () => {
    if (!gameState.currentQuestion || !isHost) return

    const currentTeam = gameState.currentQuestion.team
    const questionType = gameState.currentQuestion.type
    const alliancePartner = gameState.currentQuestion.alliancePartner
    const votes = gameState.currentQuestion.votes || {}
    const correctAnswer = gameState.currentQuestion.correctAnswer

    // Get participating players based on question type
    const participatingPlayers =
      questionType === 'alliance' && alliancePartner
        ? gameState.players.filter(
            (p) => p.team === currentTeam || p.team === alliancePartner
          )
        : gameState.players.filter((p) => p.team === currentTeam)

    // Count correct and wrong votes
    let correctVotes = 0
    let totalVotes = 0

    Object.entries(votes).forEach(([playerId, vote]) => {
      totalVotes++
      if (vote === correctAnswer) {
        correctVotes++
      }
    })

    // Update player stats
    const updatedPlayers = gameState.players.map((p) => {
      if (votes[p.id] !== undefined) {
        const isCorrect = votes[p.id] === correctAnswer
        return {
          ...p,
          correctVotes: (p.correctVotes || 0) + (isCorrect ? 1 : 0),
          wrongVotes: (p.wrongVotes || 0) + (isCorrect ? 0 : 1),
        }
      }
      return p
    })

    // Initialize team stats
    const updatedTeamScores = {
      ...(gameState.teamScores || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }),
    }
    const updatedTeamCorrectAnswers = {
      ...(gameState.teamCorrectAnswers || {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      }),
    }
    const updatedTeamWrongAnswers = {
      ...(gameState.teamWrongAnswers || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }),
    }

    // Calculate scoring based on question type
    if (questionType === 'independent') {
      // LOẠI 1: 100% of team must vote correctly to get +10 points
      const teamPlayers = gameState.players.filter(
        (p) => p.team === currentTeam
      )
      const teamVotes = Object.entries(votes).filter(([playerId]) =>
        teamPlayers.some((p) => p.id === playerId)
      )
      const teamCorrectVotes = teamVotes.filter(
        ([, vote]) => vote === correctAnswer
      ).length

      if (teamCorrectVotes === teamPlayers.length && teamPlayers.length > 0) {
        // All team members voted correctly
        updatedTeamScores[currentTeam] =
          (updatedTeamScores[currentTeam] || 0) + INDEPENDENT_QUESTION_POINTS
        updatedTeamCorrectAnswers[currentTeam] =
          (updatedTeamCorrectAnswers[currentTeam] || 0) + 1
      } else {
        // Not all voted correctly
        updatedTeamWrongAnswers[currentTeam] =
          (updatedTeamWrongAnswers[currentTeam] || 0) + 1
      }
    } else if (questionType === 'alliance' && alliancePartner) {
      // LOẠI 2: >70% of combined votes must be correct for both teams to get +15 points
      // Calculate based on TOTAL PLAYERS (not just voters)
      const allianceTeamPlayers = gameState.players.filter(
        (p) => p.team === currentTeam || p.team === alliancePartner
      )
      const totalParticipants = allianceTeamPlayers.length
      const correctPercentage =
        totalParticipants > 0 ? correctVotes / totalParticipants : 0

      if (correctPercentage > 0.7) {
        // Both teams get points
        updatedTeamScores[currentTeam] =
          (updatedTeamScores[currentTeam] || 0) + ALLIANCE_QUESTION_POINTS
        updatedTeamScores[alliancePartner] =
          (updatedTeamScores[alliancePartner] || 0) + ALLIANCE_QUESTION_POINTS
        updatedTeamCorrectAnswers[currentTeam] =
          (updatedTeamCorrectAnswers[currentTeam] || 0) + 1
        updatedTeamCorrectAnswers[alliancePartner] =
          (updatedTeamCorrectAnswers[alliancePartner] || 0) + 1
      } else {
        // Both teams failed
        updatedTeamWrongAnswers[currentTeam] =
          (updatedTeamWrongAnswers[currentTeam] || 0) + 1
        updatedTeamWrongAnswers[alliancePartner] =
          (updatedTeamWrongAnswers[alliancePartner] || 0) + 1
      }
    }

    // Update questions answered for current team (and alliance partner if applicable)
    const updatedTeamQuestionsAnswered = {
      ...(gameState.teamQuestionsAnswered || {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      }),
    }
    updatedTeamQuestionsAnswered[currentTeam] =
      (updatedTeamQuestionsAnswered[currentTeam] || 0) + 1

    // Find next team that still has questions remaining
    const activeTeams = [
      ...new Set(gameState.players.map((p) => p.team).filter((t) => t)),
    ].sort() as number[]
    let nextTeam: number | null = null
    let allTeamsCompleted = true

    // Try to find next team in rotation
    const currentTeamIdx = activeTeams.indexOf(currentTeam)
    for (let i = 1; i <= activeTeams.length; i++) {
      const checkTeamIdx = (currentTeamIdx + i) % activeTeams.length
      const checkTeam = activeTeams[checkTeamIdx]
      const questionsAnswered =
        checkTeam === currentTeam
          ? updatedTeamQuestionsAnswered[checkTeam]
          : gameState.teamQuestionsAnswered?.[checkTeam] || 0

      if (questionsAnswered < QUESTIONS_PER_TEAM) {
        nextTeam = checkTeam
        allTeamsCompleted = false
        break
      }
    }

    // Check if current team also completed (in case all teams are done)
    if (updatedTeamQuestionsAnswered[currentTeam] < QUESTIONS_PER_TEAM) {
      allTeamsCompleted = false
      if (nextTeam === null) {
        nextTeam = currentTeam
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
        gameEndTime: Date.now(),
      }
      await updateGameState(updatedState)
    } else {
      // Generate next question for next team
      const nextQuestionNumber =
        (updatedTeamQuestionsAnswered[nextTeam] || 0) + 1

      const updatedState: GameState = {
        ...gameState,
        players: updatedPlayers,
        teamScores: updatedTeamScores,
        teamCorrectAnswers: updatedTeamCorrectAnswers,
        teamWrongAnswers: updatedTeamWrongAnswers,
        teamQuestionsAnswered: updatedTeamQuestionsAnswered,
        currentTeamIndex: nextTeam,
        currentQuestion: generateQuestion(
          nextTeam,
          nextQuestionNumber,
          activeTeams
        ),
      }
      await updateGameState(updatedState)
    }
  }

  const calculateTeamRankings = () => {
    const teams = [1, 2, 3, 4, 5, 6]
    const teamStats = teams
      .map((teamNum) => {
        const teamPlayers = gameState.players.filter((p) => p.team === teamNum)
        const score = gameState.teamScores?.[teamNum] || 0
        const questionsAnswered =
          gameState.teamQuestionsAnswered?.[teamNum] || 0
        const correctAnswers = gameState.teamCorrectAnswers?.[teamNum] || 0
        const wrongAnswers = gameState.teamWrongAnswers?.[teamNum] || 0
        const teamInfo = TEAMS.find((t) => t.id === teamNum)

        return {
          team: teamNum,
          teamName: teamInfo?.name || `Đội ${teamNum}`,
          teamEmoji: teamInfo?.emoji || '⚪',
          teamColor: teamInfo?.color || '#FFFFFF',
          players: teamPlayers,
          score,
          questionsAnswered,
          correctAnswers,
          wrongAnswers,
        }
      })
      .filter((t) => t.players.length > 0) // Only include teams with players

    // Sort by most correct answers first, then by least wrong answers
    return teamStats.sort((a, b) => {
      if (b.correctAnswers !== a.correctAnswers) {
        return b.correctAnswers - a.correctAnswers // Most correct first
      }
      return a.wrongAnswers - b.wrongAnswers // Least wrong as tiebreaker
    })
  }

  const rankPlayersInTeam = (teamPlayers: Player[]) => {
    return [...teamPlayers].sort((a, b) => {
      const aCorrect = a.correctVotes || 0
      const bCorrect = b.correctVotes || 0
      const aWrong = a.wrongVotes || 0
      const bWrong = b.wrongVotes || 0

      // Sort by most correct votes first, then by least wrong votes
      if (bCorrect !== aCorrect) {
        return bCorrect - aCorrect // Most correct first
      }
      return aWrong - bWrong // Least wrong as tiebreaker
    })
  }

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
                  <p className="text-gray-400 mt-2">
                    Trò chơi đội nhóm trực tuyến
                  </p>
                </div>

                {/* Player Name Input */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    👤 Tên người chơi
                  </label>
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
                  <label className="block text-sm text-gray-400 mb-2">
                    🔑 Tham gia phòng có sẵn
                  </label>
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
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                      }}
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
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 0 30px rgba(234, 179, 8, 0.4)',
                  }}
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
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  Phòng chờ
                </h2>

                {/* Room Code Display */}
                {roomCode && (
                  <div className="mt-6 bg-gradient-to-r from-gray-700/80 to-gray-800/80 rounded-2xl p-6 max-w-sm mx-auto border border-gray-600">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                      Mã Phòng
                    </p>
                    <div className="text-gold-400 text-4xl font-mono font-bold tracking-[0.3em]">
                      {roomCode}
                    </div>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigator.clipboard.writeText(roomCode)
                        alert('Đã sao chép mã phòng!')
                      }}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                      <span>📋</span> Sao chép mã
                    </motion.button>
                  </div>
                )}
                <p className="text-gray-400 text-sm mt-4">
                  {isHost
                    ? '👑 Bạn là Host • Chia sẻ mã phòng với bạn bè để họ tham gia'
                    : '⏳ Đang chờ host bắt đầu game...'}
                </p>
              </div>

              {/* Game Mode Selection - Host Only */}
              {isHost && !gameState.lobbyCountdownActive && (
                <div className="mb-6">
                  <h3 className="text-center text-gray-400 text-sm uppercase tracking-wider mb-3">
                    Chọn chế độ chơi
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateGameMode('normal')}
                      className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                        gameState.gameMode === 'normal'
                          ? 'bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-400 text-white'
                          : 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:border-green-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">⚡</div>
                      Câu thường
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateGameMode('alliance')}
                      className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                        gameState.gameMode === 'alliance'
                          ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-2 border-purple-400 text-white'
                          : 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:border-purple-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">🤝</div>
                      Liên minh
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateGameMode('both')}
                      className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                        gameState.gameMode === 'both'
                          ? 'bg-gradient-to-br from-gold-600 to-gold-700 border-2 border-gold-400 text-black'
                          : 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:border-gold-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">🎯</div>
                      Cả hai
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Teams Display */}
              <div className="mb-8">
                <h3 className="text-center text-gray-400 text-sm uppercase tracking-wider mb-4">
                  Chọn đội của bạn (Tối đa {MAX_PLAYERS_PER_TEAM} người/đội)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TEAMS.map((team) => {
                    const teamPlayers = gameState.players.filter(
                      (p) => p.team === team.id
                    )
                    const isFull = teamPlayers.length >= MAX_PLAYERS_PER_TEAM
                    const myPlayer = gameState.players.find(
                      (p) => p.id === myPlayerId
                    )
                    const isMyTeam = myPlayer?.team === team.id
                    const hasTeam =
                      myPlayer?.team !== undefined && myPlayer?.team !== null
                    const canJoin =
                      !isFull && !hasTeam && !gameState.lobbyCountdownActive

                    return (
                      <motion.div
                        key={team.id}
                        whileHover={canJoin ? { scale: 1.02 } : {}}
                        className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
                          isMyTeam
                            ? 'border-gold-500 bg-gradient-to-br from-gold-900/40 to-gold-800/30 ring-2 ring-gold-500'
                            : isFull
                              ? 'border-gray-700 bg-gray-800/50 opacity-60 cursor-not-allowed'
                              : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                        }`}
                        style={{
                          borderColor: isMyTeam ? team.color : undefined,
                        }}
                        onClick={() => canJoin && chooseTeam(team.id)}
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{team.emoji}</span>
                            <span
                              className="font-bold"
                              style={{ color: team.color }}
                            >
                              {team.name}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isFull ? 'text-red-400' : 'text-gray-400'
                            }`}
                          >
                            {teamPlayers.length}/{MAX_PLAYERS_PER_TEAM}
                          </span>
                        </div>
                        <div className="space-y-1.5 max-h-24 overflow-y-auto">
                          {teamPlayers.map((player) => (
                            <div
                              key={player.id}
                              className="bg-gray-700/50 rounded px-2 py-1.5 text-xs flex items-center gap-1.5"
                            >
                              <span>👤</span>
                              <span className="truncate flex-1">
                                {player.name}
                              </span>
                              {player.id === myPlayerId && (
                                <span className="text-gold-400">★</span>
                              )}
                            </div>
                          ))}
                          {teamPlayers.length === 0 && (
                            <div className="text-gray-500 text-xs text-center py-2">
                              {canJoin ? 'Click để tham gia' : 'Chưa có ai'}
                            </div>
                          )}
                        </div>
                        {isMyTeam && (
                          <div className="mt-2 pt-2 border-t border-gold-500/30">
                            <div className="text-xs text-gold-400 text-center font-semibold">
                              ✓ Đội của bạn
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Players without team warning */}
              {gameState.players.filter((p) => !p.team && p.team !== 0).length >
                0 &&
                !gameState.lobbyCountdownActive && (
                  <div className="mb-6 bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 text-center">
                    <p className="text-yellow-400 font-semibold">
                      ⚠️{' '}
                      {
                        gameState.players.filter((p) => !p.team && p.team !== 0)
                          .length
                      }{' '}
                      người chơi chưa chọn đội
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Tất cả người chơi phải chọn đội trước khi bắt đầu
                    </p>
                  </div>
                )}

              {/* Lobby Countdown Display */}
              {gameState.lobbyCountdownActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 text-center"
                >
                  <div className="bg-gradient-to-br from-gold-600/30 to-yellow-600/20 rounded-2xl p-8 border-2 border-gold-500/50">
                    <div className="mb-4">
                      <span className="text-5xl">⏳</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gold-400 mb-2">
                      Đang tìm đồng đội...
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Trò chơi sẽ bắt đầu trong
                    </p>
                    <motion.div
                      key={lobbyCountdown}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-7xl font-bold text-gold-400"
                    >
                      {lobbyCountdown}
                    </motion.div>
                    <p className="text-sm text-gray-400 mt-4">
                      Hãy chuẩn bị sẵn sàng! 🎮
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Start Button */}
              <div className="flex gap-4">
                {isHost && !gameState.lobbyCountdownActive && (
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 0 30px rgba(234, 179, 8, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startGame}
                    disabled={gameState.players.length < 2}
                    className="flex-1 bg-gradient-to-r from-gold-500 via-yellow-500 to-gold-600 disabled:from-gray-600 disabled:to-gray-700 py-4 rounded-xl font-bold text-lg text-black disabled:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">🚀</span>
                    Bắt đầu trò chơi
                  </motion.button>
                )}
                {isHost && gameState.lobbyCountdownActive && (
                  <div className="flex-1 bg-gradient-to-r from-gold-500/50 via-yellow-500/50 to-gold-600/50 py-4 rounded-xl font-bold text-lg text-black shadow-lg transition-all flex items-center justify-center gap-3 animate-pulse">
                    <span className="text-xl">🎮</span>
                    Đang bắt đầu...
                  </div>
                )}
                {!isHost && !gameState.lobbyCountdownActive && (
                  <div className="flex-1 bg-gray-700/70 border border-gray-600 py-4 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                    <span className="animate-pulse">⏳</span>
                    Đang chờ host bắt đầu...
                  </div>
                )}
                {!isHost && gameState.lobbyCountdownActive && (
                  <div className="flex-1 bg-gradient-to-r from-green-600/30 to-green-700/30 border border-green-500/50 py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 text-green-400">
                    <span className="animate-bounce">🎮</span>
                    Chuẩn bị! Game sắp bắt đầu...
                  </div>
                )}
              </div>

              {/* Player Count */}
              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-3 bg-gray-700/50 rounded-full px-6 py-2 border border-gray-600">
                  <span className="text-2xl">👥</span>
                  <span className="text-lg">
                    <span className="font-bold text-gold-400">
                      {gameState.players.length}
                    </span>
                    <span className="text-gray-400">
                      /{MAX_PLAYERS} người chơi
                    </span>
                  </span>
                  <span className="text-gray-500">•</span>
                  <span
                    className={`text-sm ${gameState.players.length >= 2 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {gameState.players.length >= 2
                      ? '✓ Sẵn sàng'
                      : 'Cần tối thiểu 2 người'}
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
                {/* Question Type & Teams Banner */}
                <div className="mb-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {gameState.currentQuestion.type === 'alliance' ? (
                        <>
                          <span className="text-3xl">🤝</span>
                          <div>
                            <h3 className="text-lg font-bold text-purple-400">
                              CÂU HỎI LIÊN MINH
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                              <span>
                                {
                                  TEAMS.find(
                                    (t) =>
                                      t.id === gameState.currentQuestion?.team
                                  )?.emoji
                                }
                              </span>
                              <span
                                className="font-semibold"
                                style={{
                                  color: TEAMS.find(
                                    (t) =>
                                      t.id === gameState.currentQuestion?.team
                                  )?.color,
                                }}
                              >
                                {
                                  TEAMS.find(
                                    (t) =>
                                      t.id === gameState.currentQuestion?.team
                                  )?.name
                                }
                              </span>
                              <span className="text-gray-400">+</span>
                              <span>
                                {
                                  TEAMS.find(
                                    (t) =>
                                      t.id ===
                                      gameState.currentQuestion?.alliancePartner
                                  )?.emoji
                                }
                              </span>
                              <span
                                className="font-semibold"
                                style={{
                                  color: TEAMS.find(
                                    (t) =>
                                      t.id ===
                                      gameState.currentQuestion?.alliancePartner
                                  )?.color,
                                }}
                              >
                                {
                                  TEAMS.find(
                                    (t) =>
                                      t.id ===
                                      gameState.currentQuestion?.alliancePartner
                                  )?.name
                                }
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl">⚡</span>
                          <div>
                            <h3 className="text-lg font-bold text-green-400">
                              CÂU HỎI ĐỘC LẬP
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                              <span>
                                {
                                  TEAMS.find(
                                    (t) =>
                                      t.id === gameState.currentQuestion?.team
                                  )?.emoji
                                }
                              </span>
                              <span
                                className="font-semibold"
                                style={{
                                  color: TEAMS.find(
                                    (t) =>
                                      t.id === gameState.currentQuestion?.team
                                  )?.color,
                                }}
                              >
                                {
                                  TEAMS.find(
                                    (t) =>
                                      t.id === gameState.currentQuestion?.team
                                  )?.name
                                }
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="text-sm text-gray-400">
                        Câu {gameState.currentQuestion.questionNumber}/
                        {QUESTIONS_PER_TEAM}
                      </div>
                    </div>
                    <div
                      className={`text-4xl font-bold ${
                        questionTimeLeft <= 5
                          ? 'text-red-500 animate-pulse'
                          : 'text-gold-400'
                      }`}
                    >
                      ⏱️ {questionTimeLeft}s
                    </div>
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
                    const myPlayer = gameState.players.find(
                      (p) => p.id === myPlayerId
                    )
                    const questionType = gameState.currentQuestion?.type
                    const currentTeam = gameState.currentQuestion?.team
                    const alliancePartner =
                      gameState.currentQuestion?.alliancePartner

                    const isParticipating =
                      questionType === 'alliance'
                        ? myPlayer?.team === currentTeam ||
                          myPlayer?.team === alliancePartner
                        : myPlayer?.team === currentTeam

                    const votes = gameState.currentQuestion?.votes || {}
                    const hasVoted = votes[myPlayerId] !== undefined

                    const participatingPlayers =
                      questionType === 'alliance' && alliancePartner
                        ? gameState.players.filter(
                            (p) =>
                              p.team === currentTeam ||
                              p.team === alliancePartner
                          )
                        : gameState.players.filter(
                            (p) => p.team === currentTeam
                          )

                    const votedCount = Object.keys(votes).length

                    if (!isParticipating) {
                      return (
                        <div className="bg-gray-600 rounded-lg p-3">
                          <p className="text-gray-300">
                            ⏳ Đang chờ đội khác trả lời...
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Đã vote: {votedCount}/{participatingPlayers.length}
                          </p>
                        </div>
                      )
                    }

                    if (hasVoted) {
                      return (
                        <div className="bg-green-600/30 border border-green-500 rounded-lg p-3">
                          <p className="text-green-400 font-semibold">
                            ✓ Bạn đã vote! Đang chờ đồng đội...
                          </p>
                          <p className="text-sm text-gray-300 mt-1">
                            Đã vote: {votedCount}/{participatingPlayers.length}
                          </p>
                        </div>
                      )
                    }

                    return (
                      <div
                        className={`rounded-lg p-3 border ${
                          questionType === 'alliance'
                            ? 'bg-purple-500/20 border-purple-500'
                            : 'bg-gold-500/20 border-gold-500'
                        }`}
                      >
                        <p
                          className={`font-semibold ${
                            questionType === 'alliance'
                              ? 'text-purple-400'
                              : 'text-gold-400'
                          }`}
                        >
                          🗳️ Lượt của đội bạn! Hãy vote đáp án!
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          Đã vote: {votedCount}/{participatingPlayers.length}
                        </p>
                        {questionType === 'alliance' && (
                          <p className="text-xs text-purple-300 mt-1">
                            Liên minh: Cần {'>'}70% vote đúng để cả 2 đội được
                            điểm
                          </p>
                        )}
                        {questionType === 'independent' && (
                          <p className="text-xs text-green-300 mt-1">
                            Độc lập: 100% team phải vote đúng để được điểm
                          </p>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gameState.currentQuestion.options.map((option, index) => {
                    const myPlayer = gameState.players.find(
                      (p) => p.id === myPlayerId
                    )
                    const questionType = gameState.currentQuestion?.type
                    const currentTeam = gameState.currentQuestion?.team
                    const alliancePartner =
                      gameState.currentQuestion?.alliancePartner

                    const isParticipating =
                      questionType === 'alliance'
                        ? myPlayer?.team === currentTeam ||
                          myPlayer?.team === alliancePartner
                        : myPlayer?.team === currentTeam

                    const votes = gameState.currentQuestion?.votes || {}
                    const hasVoted = votes[myPlayerId] !== undefined
                    const myVote = votes[myPlayerId]
                    const isSelected = myVote === index

                    return (
                      <motion.button
                        key={index}
                        whileHover={{
                          scale: isParticipating && !hasVoted ? 1.02 : 1,
                        }}
                        whileTap={{
                          scale: isParticipating && !hasVoted ? 0.98 : 1,
                        }}
                        onClick={() =>
                          isParticipating && !hasVoted && submitVote(index)
                        }
                        disabled={!isParticipating || hasVoted}
                        className={`rounded-lg p-4 text-left font-semibold transition-all ${
                          isSelected
                            ? 'bg-gold-500/40 border-2 border-gold-500'
                            : hasVoted || !isParticipating
                              ? 'bg-gray-600 border-2 border-gray-500 opacity-60 cursor-not-allowed'
                              : 'bg-gray-700 hover:bg-gold-500/20 border-2 border-gray-600 hover:border-gold-500'
                        }`}
                      >
                        <span className="text-gold-400 mr-3">
                          {['A', 'B', 'C', 'D'][index]}.
                        </span>
                        {option}
                        {isSelected && (
                          <span className="ml-2 text-gold-400">✓</span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Main Layout: 2 columns for all 6 teams */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* LEFT COLUMN - Team 1, 2, 3 Info */}
              <div className="space-y-4">
                {/* Team 1 - Công nhân (Blue) */}
                {(() => {
                  const team1Players = gameState.players.filter(
                    (p) => p.team === 1
                  )
                  const isCurrentTeam = gameState.currentQuestion?.team === 1
                  const teamInfo = TEAMS.find((t) => t.id === 1)
                  return (
                    team1Players.length > 0 && (
                      <div
                        className={`bg-gray-800 rounded-xl p-4 border-l-4 ${isCurrentTeam ? 'ring-2' : ''}`}
                        style={{
                          borderLeftColor: teamInfo?.color,
                          ...(isCurrentTeam
                            ? { '--tw-ring-color': teamInfo?.color }
                            : {}),
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-bold"
                            style={{ color: teamInfo?.color }}
                          >
                            {teamInfo?.emoji} {teamInfo?.name}{' '}
                            {isCurrentTeam && '← Đang trả lời'}
                          </h3>
                          <span className="text-gold-400 font-bold">
                            {gameState.teamScores?.[1] || 0} điểm
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Câu hỏi: {gameState.teamQuestionsAnswered?.[1] || 0}/
                          {QUESTIONS_PER_TEAM}
                        </div>
                        {team1Players.map((player) => (
                          <div
                            key={player.id}
                            className="bg-gray-700 rounded p-2 mb-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: teamInfo?.color }}
                                />
                                <span className="font-semibold truncate">
                                  {player.name}
                                </span>
                                {player.id === myPlayerId && (
                                  <span className="text-xs text-gold-400">
                                    ★
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex gap-2">
                              <span className="text-green-400">
                                ✓{player.correctVotes || 0}
                              </span>
                              <span className="text-red-400">
                                ✗{player.wrongVotes || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )
                })()}

                {/* Team 2 - Nông dân (Yellow) */}
                {(() => {
                  const team2Players = gameState.players.filter(
                    (p) => p.team === 2
                  )
                  const isCurrentTeam = gameState.currentQuestion?.team === 2
                  const teamInfo = TEAMS.find((t) => t.id === 2)
                  return (
                    team2Players.length > 0 && (
                      <div
                        className={`bg-gray-800 rounded-xl p-4 border-l-4 ${isCurrentTeam ? 'ring-2' : ''}`}
                        style={{
                          borderLeftColor: teamInfo?.color,
                          ...(isCurrentTeam
                            ? { '--tw-ring-color': teamInfo?.color }
                            : {}),
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-bold"
                            style={{ color: teamInfo?.color }}
                          >
                            {teamInfo?.emoji} {teamInfo?.name}{' '}
                            {isCurrentTeam && '← Đang trả lời'}
                          </h3>
                          <span className="text-gold-400 font-bold">
                            {gameState.teamScores?.[2] || 0} điểm
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Câu hỏi: {gameState.teamQuestionsAnswered?.[2] || 0}/
                          {QUESTIONS_PER_TEAM}
                        </div>
                        {team2Players.map((player) => (
                          <div
                            key={player.id}
                            className="bg-gray-700 rounded p-2 mb-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: teamInfo?.color }}
                                />
                                <span className="font-semibold truncate">
                                  {player.name}
                                </span>
                                {player.id === myPlayerId && (
                                  <span className="text-xs text-gold-400">
                                    ★
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex gap-2">
                              <span className="text-green-400">
                                ✓{player.correctVotes || 0}
                              </span>
                              <span className="text-red-400">
                                ✗{player.wrongVotes || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )
                })()}

                {/* Team 3 - Trí thức (White) */}
                {(() => {
                  const team3Players = gameState.players.filter(
                    (p) => p.team === 3
                  )
                  const isCurrentTeam = gameState.currentQuestion?.team === 3
                  const teamInfo = TEAMS.find((t) => t.id === 3)
                  return (
                    team3Players.length > 0 && (
                      <div
                        className={`bg-gray-800 rounded-xl p-4 border-l-4 ${isCurrentTeam ? 'ring-2' : ''}`}
                        style={{
                          borderLeftColor: teamInfo?.color,
                          ...(isCurrentTeam
                            ? { '--tw-ring-color': teamInfo?.color }
                            : {}),
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-bold"
                            style={{ color: teamInfo?.color }}
                          >
                            {teamInfo?.emoji} {teamInfo?.name}{' '}
                            {isCurrentTeam && '← Đang trả lời'}
                          </h3>
                          <span className="text-gold-400 font-bold">
                            {gameState.teamScores?.[3] || 0} điểm
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Câu hỏi: {gameState.teamQuestionsAnswered?.[3] || 0}/
                          {QUESTIONS_PER_TEAM}
                        </div>
                        {team3Players.map((player) => (
                          <div
                            key={player.id}
                            className="bg-gray-700 rounded p-2 mb-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: teamInfo?.color }}
                                />
                                <span className="font-semibold truncate">
                                  {player.name}
                                </span>
                                {player.id === myPlayerId && (
                                  <span className="text-xs text-gold-400">
                                    ★
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex gap-2">
                              <span className="text-green-400">
                                ✓{player.correctVotes || 0}
                              </span>
                              <span className="text-red-400">
                                ✗{player.wrongVotes || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )
                })()}

                {/* Game Board - MOVED TO LEFT COLUMN */}
                <div className="bg-gray-800 rounded-xl p-6 border-2 border-gold-500/30">
                  <h3 className="text-2xl font-bold mb-4 text-center text-gold-400">
                    🏛️ Góp phần xây dựng đất nước
                  </h3>
                  <div className="relative aspect-square max-w-full mx-auto">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {/* Board Background */}
                      <rect
                        x="0"
                        y="0"
                        width="400"
                        height="400"
                        fill="#1f2937"
                        stroke="#374151"
                        strokeWidth="2"
                      />

                      {/* 6 Team Areas - 2 rows x 3 columns layout */}
                      {/* Row 1: Team 1, 2, 3 */}
                      {/* Team 1 - Công nhân (Blue) - Top Left */}
                      <rect
                        x="15"
                        y="15"
                        width="115"
                        height="115"
                        fill="#3B82F6"
                        opacity={
                          gameState.currentQuestion?.team === 1 ? '0.7' : '0.3'
                        }
                        stroke="#3B82F6"
                        strokeWidth="2"
                        rx="6"
                      />
                      <text
                        x="72"
                        y="50"
                        textAnchor="middle"
                        fill="#3B82F6"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        Công nhân
                      </text>
                      <text
                        x="72"
                        y="70"
                        textAnchor="middle"
                        fill="#22c55e"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✓ {gameState.teamCorrectAnswers?.[1] || 0}
                      </text>
                      <text
                        x="72"
                        y="88"
                        textAnchor="middle"
                        fill="#ef4444"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✗ {gameState.teamWrongAnswers?.[1] || 0}
                      </text>
                      <text
                        x="72"
                        y="105"
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="9"
                      >
                        {gameState.teamQuestionsAnswered?.[1] || 0}/
                        {QUESTIONS_PER_TEAM}
                      </text>

                      {/* Team 2 - Nông dân (Yellow) - Top Center */}
                      <rect
                        x="142"
                        y="15"
                        width="115"
                        height="115"
                        fill="#EAB308"
                        opacity={
                          gameState.currentQuestion?.team === 2 ? '0.7' : '0.3'
                        }
                        stroke="#EAB308"
                        strokeWidth="2"
                        rx="6"
                      />
                      <text
                        x="200"
                        y="50"
                        textAnchor="middle"
                        fill="#EAB308"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        Nông dân
                      </text>
                      <text
                        x="200"
                        y="70"
                        textAnchor="middle"
                        fill="#22c55e"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✓ {gameState.teamCorrectAnswers?.[2] || 0}
                      </text>
                      <text
                        x="200"
                        y="88"
                        textAnchor="middle"
                        fill="#ef4444"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✗ {gameState.teamWrongAnswers?.[2] || 0}
                      </text>
                      <text
                        x="200"
                        y="105"
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="9"
                      >
                        {gameState.teamQuestionsAnswered?.[2] || 0}/
                        {QUESTIONS_PER_TEAM}
                      </text>

                      {/* Team 3 - Trí thức (White) - Top Right */}
                      <rect
                        x="269"
                        y="15"
                        width="115"
                        height="115"
                        fill="#FFFFFF"
                        opacity={
                          gameState.currentQuestion?.team === 3 ? '0.7' : '0.3'
                        }
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        rx="6"
                      />
                      <text
                        x="327"
                        y="50"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        Trí thức
                      </text>
                      <text
                        x="327"
                        y="70"
                        textAnchor="middle"
                        fill="#22c55e"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✓ {gameState.teamCorrectAnswers?.[3] || 0}
                      </text>
                      <text
                        x="327"
                        y="88"
                        textAnchor="middle"
                        fill="#ef4444"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✗ {gameState.teamWrongAnswers?.[3] || 0}
                      </text>
                      <text
                        x="327"
                        y="105"
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="9"
                      >
                        {gameState.teamQuestionsAnswered?.[3] || 0}/
                        {QUESTIONS_PER_TEAM}
                      </text>

                      {/* Row 2: Team 4, 5, 6 */}
                      {/* Team 4 - Doanh nhân (Dark Red) - Bottom Left */}
                      <rect
                        x="15"
                        y="269"
                        width="115"
                        height="115"
                        fill="#991B1B"
                        opacity={
                          gameState.currentQuestion?.team === 4 ? '0.7' : '0.3'
                        }
                        stroke="#991B1B"
                        strokeWidth="2"
                        rx="6"
                      />
                      <text
                        x="72"
                        y="304"
                        textAnchor="middle"
                        fill="#991B1B"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        Doanh nhân
                      </text>
                      <text
                        x="72"
                        y="324"
                        textAnchor="middle"
                        fill="#22c55e"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✓ {gameState.teamCorrectAnswers?.[4] || 0}
                      </text>
                      <text
                        x="72"
                        y="342"
                        textAnchor="middle"
                        fill="#ef4444"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✗ {gameState.teamWrongAnswers?.[4] || 0}
                      </text>
                      <text
                        x="72"
                        y="359"
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="9"
                      >
                        {gameState.teamQuestionsAnswered?.[4] || 0}/
                        {QUESTIONS_PER_TEAM}
                      </text>

                      {/* Team 5 - Thanh niên (Green) - Bottom Center */}
                      <rect
                        x="142"
                        y="269"
                        width="115"
                        height="115"
                        fill="#10B981"
                        opacity={
                          gameState.currentQuestion?.team === 5 ? '0.7' : '0.3'
                        }
                        stroke="#10B981"
                        strokeWidth="2"
                        rx="6"
                      />
                      <text
                        x="200"
                        y="304"
                        textAnchor="middle"
                        fill="#10B981"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        Thanh niên
                      </text>
                      <text
                        x="200"
                        y="324"
                        textAnchor="middle"
                        fill="#22c55e"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✓ {gameState.teamCorrectAnswers?.[5] || 0}
                      </text>
                      <text
                        x="200"
                        y="342"
                        textAnchor="middle"
                        fill="#ef4444"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✗ {gameState.teamWrongAnswers?.[5] || 0}
                      </text>
                      <text
                        x="200"
                        y="359"
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="9"
                      >
                        {gameState.teamQuestionsAnswered?.[5] || 0}/
                        {QUESTIONS_PER_TEAM}
                      </text>

                      {/* Team 6 - Phụ nữ (Purple) - Bottom Right */}
                      <rect
                        x="269"
                        y="269"
                        width="115"
                        height="115"
                        fill="#A855F7"
                        opacity={
                          gameState.currentQuestion?.team === 6 ? '0.7' : '0.3'
                        }
                        stroke="#A855F7"
                        strokeWidth="2"
                        rx="6"
                      />
                      <text
                        x="327"
                        y="304"
                        textAnchor="middle"
                        fill="#A855F7"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        Phụ nữ
                      </text>
                      <text
                        x="327"
                        y="324"
                        textAnchor="middle"
                        fill="#22c55e"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✓ {gameState.teamCorrectAnswers?.[6] || 0}
                      </text>
                      <text
                        x="327"
                        y="342"
                        textAnchor="middle"
                        fill="#ef4444"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        ✗ {gameState.teamWrongAnswers?.[6] || 0}
                      </text>
                      <text
                        x="327"
                        y="359"
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="9"
                      >
                        {gameState.teamQuestionsAnswered?.[6] || 0}/
                        {QUESTIONS_PER_TEAM}
                      </text>

                      {/* Center area - Current Team Info */}
                      <rect
                        x="142"
                        y="142"
                        width="115"
                        height="115"
                        fill="#fbbf24"
                        opacity="0.2"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        rx="6"
                      />
                      <text
                        x="200"
                        y="185"
                        textAnchor="middle"
                        fill="#fbbf24"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        ĐANG TRẢ LỜI
                      </text>
                      <text
                        x="200"
                        y="205"
                        textAnchor="middle"
                        fill="#fbbf24"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {gameState.currentQuestion
                          ? TEAMS.find(
                              (t) => t.id === gameState.currentQuestion?.team
                            )?.name || 'Chờ...'
                          : 'Chờ...'}
                      </text>
                      <text
                        x="200"
                        y="225"
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="10"
                      >
                        {gameState.currentQuestion
                          ? `Câu ${gameState.currentQuestion.questionNumber}`
                          : ''}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Game Info */}
                <div className="bg-gray-800 rounded-xl p-4 border-2 border-gold-500/30">
                  <h3 className="text-sm font-bold mb-3 text-center text-gold-400">
                    📊 Thông tin trò chơi
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Câu độc lập:</span>
                      <span className="font-bold text-green-400">
                        {INDEPENDENT_QUESTION_TIME}s / +
                        {INDEPENDENT_QUESTION_POINTS}đ
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Câu liên minh:</span>
                      <span className="font-bold text-purple-400">
                        {ALLIANCE_QUESTION_TIME}s / +{ALLIANCE_QUESTION_POINTS}đ
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Tổng câu hỏi/đội:</span>
                      <span className="font-bold text-gold-400">
                        {QUESTIONS_PER_TEAM}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700 rounded">
                      <span>Cách tính điểm:</span>
                      <span className="font-bold text-green-400">
                        Đa số đúng = +điểm
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Team 4, 5, 6 Info */}
              <div className="space-y-4">
                {/* Team 4 - Doanh nhân (Dark Red) */}
                {(() => {
                  const team4Players = gameState.players.filter(
                    (p) => p.team === 4
                  )
                  const isCurrentTeam = gameState.currentQuestion?.team === 4
                  const teamInfo = TEAMS.find((t) => t.id === 4)
                  return (
                    team4Players.length > 0 && (
                      <div
                        className={`bg-gray-800 rounded-xl p-4 border-l-4 ${isCurrentTeam ? 'ring-2' : ''}`}
                        style={{
                          borderLeftColor: teamInfo?.color,
                          ...(isCurrentTeam
                            ? { '--tw-ring-color': teamInfo?.color }
                            : {}),
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-bold"
                            style={{ color: teamInfo?.color }}
                          >
                            {teamInfo?.emoji} {teamInfo?.name}{' '}
                            {isCurrentTeam && '← Đang trả lời'}
                          </h3>
                          <span className="text-gold-400 font-bold">
                            {gameState.teamScores?.[4] || 0} điểm
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Câu hỏi: {gameState.teamQuestionsAnswered?.[4] || 0}/
                          {QUESTIONS_PER_TEAM}
                        </div>
                        {team4Players.map((player) => (
                          <div
                            key={player.id}
                            className="bg-gray-700 rounded p-2 mb-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: teamInfo?.color }}
                                />
                                <span className="font-semibold truncate">
                                  {player.name}
                                </span>
                                {player.id === myPlayerId && (
                                  <span className="text-xs text-gold-400">
                                    ★
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex gap-2">
                              <span className="text-green-400">
                                ✓{player.correctVotes || 0}
                              </span>
                              <span className="text-red-400">
                                ✗{player.wrongVotes || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )
                })()}

                {/* Team 5 - Thanh niên (Green) */}
                {(() => {
                  const team5Players = gameState.players.filter(
                    (p) => p.team === 5
                  )
                  const isCurrentTeam = gameState.currentQuestion?.team === 5
                  const teamInfo = TEAMS.find((t) => t.id === 5)
                  return (
                    team5Players.length > 0 && (
                      <div
                        className={`bg-gray-800 rounded-xl p-4 border-l-4 ${isCurrentTeam ? 'ring-2' : ''}`}
                        style={{
                          borderLeftColor: teamInfo?.color,
                          ...(isCurrentTeam
                            ? { '--tw-ring-color': teamInfo?.color }
                            : {}),
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-bold"
                            style={{ color: teamInfo?.color }}
                          >
                            {teamInfo?.emoji} {teamInfo?.name}{' '}
                            {isCurrentTeam && '← Đang trả lời'}
                          </h3>
                          <span className="text-gold-400 font-bold">
                            {gameState.teamScores?.[5] || 0} điểm
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Câu hỏi: {gameState.teamQuestionsAnswered?.[5] || 0}/
                          {QUESTIONS_PER_TEAM}
                        </div>
                        {team5Players.map((player) => (
                          <div
                            key={player.id}
                            className="bg-gray-700 rounded p-2 mb-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: teamInfo?.color }}
                                />
                                <span className="font-semibold truncate">
                                  {player.name}
                                </span>
                                {player.id === myPlayerId && (
                                  <span className="text-xs text-gold-400">
                                    ★
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex gap-2">
                              <span className="text-green-400">
                                ✓{player.correctVotes || 0}
                              </span>
                              <span className="text-red-400">
                                ✗{player.wrongVotes || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )
                })()}

                {/* Team 6 - Phụ nữ (Purple) */}
                {(() => {
                  const team6Players = gameState.players.filter(
                    (p) => p.team === 6
                  )
                  const isCurrentTeam = gameState.currentQuestion?.team === 6
                  const teamInfo = TEAMS.find((t) => t.id === 6)
                  return (
                    team6Players.length > 0 && (
                      <div
                        className={`bg-gray-800 rounded-xl p-4 border-l-4 ${isCurrentTeam ? 'ring-2' : ''}`}
                        style={{
                          borderLeftColor: teamInfo?.color,
                          ...(isCurrentTeam
                            ? { '--tw-ring-color': teamInfo?.color }
                            : {}),
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-bold"
                            style={{ color: teamInfo?.color }}
                          >
                            {teamInfo?.emoji} {teamInfo?.name}{' '}
                            {isCurrentTeam && '← Đang trả lời'}
                          </h3>
                          <span className="text-gold-400 font-bold">
                            {gameState.teamScores?.[6] || 0} điểm
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Câu hỏi: {gameState.teamQuestionsAnswered?.[6] || 0}/
                          {QUESTIONS_PER_TEAM}
                        </div>
                        {team6Players.map((player) => (
                          <div
                            key={player.id}
                            className="bg-gray-700 rounded p-2 mb-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: teamInfo?.color }}
                                />
                                <span className="font-semibold truncate">
                                  {player.name}
                                </span>
                                {player.id === myPlayerId && (
                                  <span className="text-xs text-gold-400">
                                    ★
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex gap-2">
                              <span className="text-green-400">
                                ✓{player.correctVotes || 0}
                              </span>
                              <span className="text-red-400">
                                ✗{player.wrongVotes || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )
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
                <h2 className="text-4xl font-bold text-gold-400 mb-2">
                  Kết quả trò chơi
                </h2>
                <p className="text-gray-400">
                  Tất cả các đội đã hoàn thành {QUESTIONS_PER_TEAM} câu hỏi!
                </p>
              </div>

              {/* Team Rankings */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-4">
                  🏅 Xếp hạng đội
                </h3>
                <div className="space-y-4">
                  {calculateTeamRankings().map((teamStat, index) => (
                    <div
                      key={teamStat.team}
                      className={`bg-gray-700 rounded-lg p-4 border-2 ${
                        index === 0 ? 'border-gold-500' : 'border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'][index]}
                          </span>
                          <span className="text-xl font-bold flex items-center gap-2">
                            <span>{teamStat.teamEmoji}</span>
                            <span style={{ color: teamStat.teamColor }}>
                              {teamStat.teamName}
                            </span>
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gold-400">
                            {teamStat.score} điểm
                          </div>
                          <div className="text-sm text-gray-400 flex gap-2 justify-end">
                            <span className="text-green-400">
                              ✓{teamStat.correctAnswers}
                            </span>
                            <span className="text-red-400">
                              ✗{teamStat.wrongAnswers}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Players in Team */}
                      <div className="ml-8 space-y-2">
                        {rankPlayersInTeam(teamStat.players).map(
                          (player, pIndex) => (
                            <div
                              key={player.id}
                              className="bg-gray-600 rounded p-2 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{pIndex + 1}.</span>
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: player.color }}
                                />
                                <span className="font-semibold">
                                  {player.name}
                                </span>
                              </div>
                              <div className="flex gap-3 text-sm">
                                <span className="text-green-400">
                                  ✓ {player.correctVotes || 0}
                                </span>
                                <span className="text-red-400">
                                  ✗ {player.wrongVotes || 0}
                                </span>
                              </div>
                            </div>
                          )
                        )}
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
  )
}

export default CoCaNguaGame
