import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToHistory = () => {
    const historySection = document.getElementById('history-section');
    historySection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gold-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-black text-xl">⭐</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VNR202</h1>
              <p className="text-xs text-gray-400">NHÓM 1 - FPT UNIVERSITY</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-gold-400 font-semibold border-b-2 border-gold-400">TRANG CHỦ</a>
            <a href="#history-section" className="text-white hover:text-gold-400 transition-colors">NỘI DUNG</a>
            <a href="#timeline" className="text-white hover:text-gold-400 transition-colors">TRIỂN LÃM</a>
            <a href="#" className="text-white hover:text-gold-400 transition-colors">ÔN TẬP</a>
            <a href="/games" className="text-white hover:text-gold-400 transition-colors">GAME</a>
            <a href="#footer" className="text-white hover:text-gold-400 transition-colors">TÀI LIỆU</a>
          </nav>
          <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all">
            🎓 Bật đầu học
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with dark overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      {/* Animated particles effect */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {showContent && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-6"
                >
                  <div className="inline-block border border-gold-500 rounded-full px-6 py-2 mb-8">
                    <span className="text-gold-400 text-sm tracking-widest">CHƯƠNG 3 - GIÁO TRÌNH ĐCSVN</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <h1 className="text-5xl md:text-7xl font-cinzel font-black mb-4">
                    <div className="text-white">ĐẢNG LÃNH ĐẠO</div>
                    <div className="text-red-600">CÔNG CUỘC</div>
                    <div className="text-red-600">ĐỔI MỚI</div>
                    <div className="text-gradient">1986 - 1996</div>
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="mt-6"
                >
                  <p className="text-gray-400 text-lg mb-2">
                    Giai đoạn <span className="text-white font-bold">1986 - 1996</span>. Đổi mới toàn diện, đưa đất nước thoát khỏi khủng hoảng kinh tế - xã hội.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Khám phá 10 năm đổi mới lịch sử - từ cơ chế kế hoạch hóa tập trung quan liêu bao cấp đến nền kinh tế thị trường định hướng xã hội chủ nghĩa.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-8 grid grid-cols-2 gap-4"
                >
                  <button
                    onClick={scrollToHistory}
                    className="bg-gray-900 border border-gray-700 hover:border-gold-500 text-white p-4 rounded-lg text-left transition-all group"
                  >
                    <div className="text-red-500 mb-2">📖</div>
                    <div className="font-bold">Đại hội VI (1986)</div>
                  </button>
                  <button
                    onClick={scrollToHistory}
                    className="bg-gray-900 border border-gray-700 hover:border-gold-500 text-white p-4 rounded-lg text-left transition-all group"
                  >
                    <div className="text-red-500 mb-2">🎯</div>
                    <div className="font-bold">Nghị quyết 10 (1988)</div>
                  </button>
                  <button
                    onClick={scrollToHistory}
                    className="bg-gray-900 border border-gray-700 hover:border-gold-500 text-white p-4 rounded-lg text-left transition-all group"
                  >
                    <div className="text-red-500 mb-2">💬</div>
                    <div className="font-bold">Chuyển đổi cơ chế</div>
                  </button>
                  <button
                    onClick={() => navigate('/games')}
                    className="bg-gray-900 border border-gray-700 hover:border-gold-500 text-white p-4 rounded-lg text-left transition-all group"
                  >
                    <div className="text-red-500 mb-2">🎮</div>
                    <div className="font-bold">Game "Con đường Đổi mới"</div>
                  </button>
                </motion.div>
              </>
            )}
          </div>

          {/* Right Content - Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hidden md:flex justify-center items-center"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-red-700 via-red-600 to-red-800 flex items-center justify-center border-8 border-gold-500 shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">⭐</div>
                  <div className="text-gold-300 text-xs tracking-[0.3em] mb-2 rotate-[8deg]">ĐỔI MỚI - PHÁT TRIỂN</div>
                  <div className="text-gold-300 text-xs tracking-[0.3em] rotate-[-8deg]">VIỆT NAM</div>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-8 -right-8 bg-gradient-to-br from-red-700 to-red-900 text-white px-8 py-4 rounded-lg transform rotate-12 border-4 border-gold-500"
                animate={{ rotate: [12, 15, 12] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-xs text-gold-300 tracking-wider">MỐC SƠN</div>
                <div className="text-4xl font-bold text-gradient">1986</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToHistory}
      >
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2 tracking-widest">CUỘN XUỐNG</div>
          <div className="w-6 h-10 border-2 border-gold-400 rounded-full flex justify-center mx-auto">
            <motion.div
              className="w-1 h-3 bg-gold-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
      </div>

      {/* History Timeline Section */}
      <div id="history-section" className="min-h-screen bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block border border-red-500 rounded-full px-6 py-2 mb-6">
              <span className="text-red-400 text-sm tracking-widest">📖 HÀNH TRÌNH ĐỔI MỚI</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-cinzel font-black mb-4">
              <span className="text-white">10 NĂM </span>
              <span className="text-gradient">ĐỔI MỚI</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Những mốc son chói lọi trong công cuộc Đổi mới của Đảng và dân tộc Việt Nam (1986-1996).
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto" id="timeline">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-gold-500 via-gold-400 to-gold-600"></div>

            {/* Timeline Items */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2 pr-8 text-right">
                <div className="bg-gray-900 border-2 border-gray-700 hover:border-gold-500 p-6 rounded-lg transition-all">
                  <div className="inline-block bg-red-900/30 text-red-400 px-3 py-1 rounded text-sm mb-3">Tháng 12/1986</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Đại hội Đại biểu toàn quốc lần thứ VI</h3>
                  <p className="text-gray-400">Đường lối đổi mới toàn diện - bước ngoặt lịch sử. Kinh tế là trung tâm, xây dựng Đảng là then chốt.</p>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gold-500 rounded-full border-4 border-black z-10"></div>
              <div className="w-1/2"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-black z-10"></div>
              <div className="w-1/2 pl-8">
                <div className="bg-gray-900 border-2 border-gray-700 hover:border-blue-500 p-6 rounded-lg transition-all">
                  <div className="inline-block bg-blue-900/30 text-blue-400 px-3 py-1 rounded text-sm mb-3">Tháng 4/1988</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Nghị quyết 10 - Đổi mới nông nghiệp</h3>
                  <p className="text-gray-400">Giao đất, giao rừng cho nông dân. Việt Nam từ thiếu đói thành nước xuất khẩu gạo lớn thứ 2 thế giới.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2 pr-8 text-right">
                <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border-2 border-red-600 p-6 rounded-lg">
                  <div className="inline-block bg-red-700 text-white px-3 py-1 rounded text-sm mb-3">1989-1996</div>
                  <h3 className="text-2xl font-bold text-gradient mb-2">Chuyển đổi cơ chế & Hội nhập</h3>
                  <p className="text-gray-300">Từ kế hoạch hóa tập trung sang thị trường. Gia nhập ASEAN, bình thường hóa quan hệ quốc tế.</p>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full border-4 border-black z-10 flex items-center justify-center">
                <span className="text-black text-sm">⭐</span>
              </div>
              <div className="w-1/2"></div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => navigate('/history')}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full font-bold hover:from-red-700 hover:to-red-800 transition-all inline-flex items-center gap-2 group"
            >
              Xem chi tiết toàn bộ nội dung
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-black text-xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Công cuộc Đổi mới</h3>
                  <p className="text-xs text-gold-400">VNR202 - HISTORY</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Dự án số hóa lịch sử giai đoạn 1986-1996. Khơi dậy niềm tự hào dân tộc về công cuộc Đổi mới vĩ đại.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Điều hướng</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold-400">Trang chủ</a></li>
                <li><a href="#history-section" className="hover:text-gold-400">Nội dung lịch sử</a></li>
                <li><a href="#timeline" className="hover:text-gold-400">Triển lãm số</a></li>
                <li><a href="#" className="hover:text-gold-400">Trò chơi mật mã</a></li>
                <li><a href="#footer" className="hover:text-gold-400">Kho tài liệu</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Nhóm thực hiện</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>1️⃣ Nguyễn Mỹ Thái Hòa - Leader/Dev</li>
                <li>2️⃣ Nguyễn Hoàng Phúc - Content</li>
                <li>3️⃣ Lê Duy Trường - Designer</li>
                <li>4️⃣ Nguyễn Minh Hùng - Researcher</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Thông tin môn học</h4>
              <div className="text-gray-400 text-sm mb-4">
                <p className="mb-2">🎓 Đại học FPT (FPT University)</p>
                <p>Mentor: Mrs. Dương Thị Thùy Thơ</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <p className="text-gold-400 italic text-sm">"Dân ta phải biết sử ta,<br/>Cho tường gốc tích nước nhà Việt Nam."</p>
                <p className="text-right text-gray-500 text-xs mt-2">- Hồ Chí Minh</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
