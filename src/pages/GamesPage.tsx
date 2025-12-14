import { motion } from 'framer-motion';
import QuizGame from '../components/games/QuizGame';
import MemoryGame from '../components/games/MemoryGame';
import { useState } from 'react';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'quiz',
      title: 'Trắc Nghiệm Lịch Sử',
      description: 'Kiểm tra kiến thức của bạn về Cách mạng Tháng Tám 1945',
      icon: '📝',
      component: QuizGame
    },
    {
      id: 'memory',
      title: 'Trò Chơi Trí Nhớ',
      description: 'Ghép các hình ảnh lịch sử với nhau',
      icon: '🧠',
      component: MemoryGame
    }
  ];

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div className="min-h-screen bg-black">
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold-500/20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <motion.h1
                className="text-2xl font-cinzel font-bold text-gradient cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedGame(null)}
              >
                ← Quay lại
              </motion.h1>
            </div>
          </header>
          <div className="pt-20">
            <GameComponent onBack={() => setSelectedGame(null)} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            className="text-2xl font-cinzel font-bold text-gradient cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.href = '/'}
          >
            SỬ THI 1945
          </motion.h1>
          <nav className="flex gap-6">
            <a href="/" className="text-gold-300 hover:text-gold-400 transition-colors">Trang chủ</a>
            <a href="/history" className="text-gold-300 hover:text-gold-400 transition-colors">Lịch sử</a>
            <a href="/games" className="text-gold-300 hover:text-gold-400 transition-colors">Trò chơi</a>
          </nav>
        </div>
      </header>

      <div className="pt-20 container mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-12">TRÒ CHƠI TÌM HIỂU LỊCH SỬ</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-gold-500/20 rounded-lg p-8 hover:border-gold-500 transition-all cursor-pointer group"
              onClick={() => setSelectedGame(game.id)}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(217, 119, 6, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <h3 className="text-2xl font-cinzel font-bold text-gradient mb-3 text-center">
                {game.title}
              </h3>
              <p className="text-gray-400 text-center">
                {game.description}
              </p>
              <motion.button
                className="btn-primary w-full mt-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Chơi ngay
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
