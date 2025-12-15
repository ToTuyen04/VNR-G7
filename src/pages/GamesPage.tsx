import { motion } from 'framer-motion';
import CoCaNguaGame from '../components/games/CoCaNguaGame';
import { useState } from 'react';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'cocangua',
      title: 'Cờ Cá Ngựa',
      description: 'Trò chơi nhiều người chơi.',
      icon: '🎲',
      component: CoCaNguaGame
    }
  ];

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div className="min-h-screen bg-black">
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800/30">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-black text-xl">⭐</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-wide">VNR202</h1>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Nhóm 7 - FPT University</p>
                </div>
              </div>
              <motion.button
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedGame(null)}
              >
                ← Quay lại
              </motion.button>
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-black text-xl">⭐</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">VNR202</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Nhóm 7 - FPT University</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="/" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRANG CHỦ</a>
            <a href="#history-section" className="text-white hover:text-gold-400 transition-colors tracking-wide">NỘI DUNG</a>
            <a href="#timeline" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRIỂN LÃM</a>
            <a href="#" className="text-white hover:text-gold-400 transition-colors tracking-wide">ÔN TẬP</a>
            <a href="/games" className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">GAME</a>
            <a href="#footer" className="text-white hover:text-gold-400 transition-colors tracking-wide">TÀI LIỆU</a>
          </nav>
          <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all">
            🎓 Bắt đầu học
          </button>
        </div>
      </header>

      <div className="pt-20 container mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-12">TRÒ CHƠI TÌM HIỂU LỊCH SỬ</h2>
        
        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
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
