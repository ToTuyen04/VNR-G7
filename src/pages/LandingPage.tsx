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
            <a href="#" className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">TRANG CHỦ</a>
            <a href="/history" className="text-white hover:text-gold-400 transition-colors tracking-wide">NỘI DUNG</a>
            <a href="#timeline" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRIỂN LÃM</a>
            <a href="#" className="text-white hover:text-gold-400 transition-colors tracking-wide">ÔN TẬP</a>
            <a href="/games" className="text-white hover:text-gold-400 transition-colors tracking-wide">GAME</a>
            <a href="#footer" className="text-white hover:text-gold-400 transition-colors tracking-wide">TÀI LIỆU</a>
          </nav>
          <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all">
            🎓 Bắt đầu học
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with dark overlay */}
      <div className="absolute inset-0 z-0 bg-black"></div>

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
                  <h1 className="text-5xl md:text-7xl font-cinzel font-black mb-4 leading-tight">
                    <div className="text-white">ĐẢNG LÃNH ĐẠO</div>
                    <div className="text-red-600">ĐẤU TRANH</div>
                    <div className="text-red-600">GIÀNH</div>
                    <div className="text-gradient">CHÍNH QUYỀN</div>
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="mt-6"
                >
                  <p className="text-gray-400 text-lg mb-2">
                    Giai đoạn <span className="text-white font-bold">1930 - 1945</span>. Từ những cao trào đấu tiên đến thắng lợi vĩ đại của Cách mạng Tháng Tám.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Khám phá hành trình 15 năm đấu tranh anh dũng của dân tộc Việt Nam dưới sự lãnh đạo của Đảng, mở ra kỷ nguyên Độc lập - Tự do.
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
                    className="bg-gray-900/80 border border-gray-800 hover:border-red-500 text-white px-6 py-4 rounded-xl text-left transition-all group flex items-center gap-4"
                  >
                    <div className="text-red-500 text-3xl">📖</div>
                    <div className="font-bold text-lg">Lộ trình lịch sử</div>
                  </button>
                  <button
                    onClick={scrollToHistory}
                    className="bg-gray-900/80 border border-gray-800 hover:border-red-500 text-white px-6 py-4 rounded-xl text-left transition-all group flex items-center gap-4"
                  >
                    <div className="text-red-500 text-3xl">🎯</div>
                    <div className="font-bold text-lg">Trọng tâm 1939–1945</div>
                  </button>
                  <button
                    onClick={scrollToHistory}
                    className="bg-gray-900/80 border border-gray-800 hover:border-red-500 text-white px-6 py-4 rounded-xl text-left transition-all group flex items-center gap-4"
                  >
                    <div className="text-red-500 text-3xl">🚩</div>
                    <div className="font-bold text-lg">Tháng Tám 1945</div>
                  </button>
                  <button
                    onClick={() => navigate('/games')}
                    className="bg-gray-900/80 border border-gray-800 hover:border-red-500 text-white px-6 py-4 rounded-xl text-left transition-all group flex items-center gap-4"
                  >
                    <div className="text-red-500 text-3xl">🎮</div>
                    <div className="font-bold text-lg">Game "Đường Dây Chỉ Huy"</div>
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
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-red-700 via-red-600 to-red-800 flex items-center justify-center border-8 border-gold-500 shadow-2xl overflow-hidden">
                {/* Rotating Text Circle */}
                <div className="absolute inset-0 opacity-80">
                  <svg viewBox="0 0 300 300" className="w-full h-full animate-[spin_20s_linear_infinite]">
                    <defs>
                      <path
                        id="curve"
                        d="M 150, 150 m -110, 0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0"
                      />
                    </defs>
                    <text fill="#FFC107" fontSize="19" fontWeight="900" letterSpacing="4" style={{ textShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px' }}>
                      <textPath href="#curve" startOffset="0%">
                        5 • ĐỘC LẬP • TỰ DO • VIỆT NAM • 1945 • HÒA BÌNH • CỘNG HÒA
                      </textPath>
                    </text>
                  </svg>
                </div>
                
                {/* Animated Star */}
                <motion.div
                  className="text-center relative z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-8xl">⭐</div>
                </motion.div>
              </div>
              <motion.div
                className="absolute -bottom-8 -right-8 bg-gradient-to-br from-red-700 to-red-900 text-white px-8 py-4 rounded-lg border-4 border-gold-500"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-xs text-gold-300 tracking-wider">MỐC SƠN</div>
                <div className="text-4xl font-bold text-gradient">1945</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/30 animate-pulse">
        <span className="text-xs tracking-widest uppercase">Cuộn xuống</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-5 h-5 animate-bounce">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
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
            {/* 1. Đại hội VI của Đảng (1986) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2 pr-8 text-right">
                <div className="bg-gray-900 border-2 border-gray-700 hover:border-gold-500 p-6 rounded-lg transition-all">
                  <div className="inline-block bg-red-900/30 text-red-400 px-3 py-1 rounded text-sm mb-3">Tháng 12/1986</div>
                  <h3 className="text-2xl font-bold text-white mb-2">🏛️ Đại hội VI của Đảng</h3>
                  <p className="text-gray-400 mb-3">Đường lối đổi mới toàn diện - bước ngoặt lịch sử của dân tộc.</p>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li>• Kinh tế là trung tâm, xây dựng Đảng là then chốt</li>
                    <li>• Chuyển sang kinh tế thị trường có định hướng XHCN</li>
                    <li>• Đổi mới tư duy, thực hiện chủ trương "dân biết, dân bàn, dân làm, dân kiểm tra"</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gold-500 rounded-full border-4 border-black z-10"></div>
              <div className="w-1/2"></div>
            </motion.div>

            {/* 2. Nghị quyết 10 */}
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
                  <h3 className="text-2xl font-bold text-white mb-2">🌾 Nghị quyết 10 - Đổi mới nông nghiệp</h3>
                  <p className="text-gray-400">Giao đất, giao rừng cho nông dân. Việt Nam từ thiếu đói thành nước xuất khẩu gạo lớn thứ 2 thế giới.</p>
                </div>
              </div>
            </motion.div>

            {/* 3. Đại hội VII của Đảng (1991) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2 pr-8 text-right">
                <div className="bg-gray-900 border-2 border-gray-700 hover:border-green-500 p-6 rounded-lg transition-all">
                  <div className="inline-block bg-green-900/30 text-green-400 px-3 py-1 rounded text-sm mb-3">Tháng 6/1991</div>
                  <h3 className="text-2xl font-bold text-white mb-2">🎯 Đại hội VII của Đảng</h3>
                  <p className="text-gray-400 mb-3">Tiếp tục đẩy mạnh công cuộc đổi mới trong bối cảnh quốc tế biến động.</p>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li>• Khẳng định tiếp tục con đường XHCN</li>
                    <li>• Phát triển kinh tế nhiều thành phần</li>
                    <li>• Mở rộng quan hệ đối ngoại, đa phương hóa, đa dạng hóa</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-black z-10"></div>
              <div className="w-1/2"></div>
            </motion.div>

            {/* 4. Hội nghị giữa nhiệm kỳ VII (1994) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-black z-10"></div>
              <div className="w-1/2 pl-8">
                <div className="bg-gray-900 border-2 border-gray-700 hover:border-purple-500 p-6 rounded-lg transition-all">
                  <div className="inline-block bg-purple-900/30 text-purple-400 px-3 py-1 rounded text-sm mb-3">Tháng 1/1994</div>
                  <h3 className="text-2xl font-bold text-white mb-2">📊 Hội nghị giữa nhiệm kỳ khóa VII</h3>
                  <p className="text-gray-400 mb-3">Đánh giá và điều chỉnh chiến lược phát triển.</p>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li>• Hoàn thiện thể chế kinh tế thị trường</li>
                    <li>• Tăng cường hội nhập kinh tế quốc tế</li>
                    <li>• Đẩy mạnh công nghiệp hóa, hiện đại hóa</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 5. Kết quả đổi mới 1986-1996 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2 pr-8 text-right">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-500 p-6 rounded-lg">
                  <div className="inline-block bg-blue-700 text-white px-3 py-1 rounded text-sm mb-3">1986-1996</div>
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">📈 Kết quả đổi mới giai đoạn 1986-1996</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• GDP tăng trưởng bình quân 7-8%/năm</li>
                    <li>• Từ nước thiếu lương thực → xuất khẩu gạo lớn thứ 2 thế giới</li>
                    <li>• Lạm phát giảm từ 400% (1988) xuống dưới 10% (1995)</li>
                    <li>• Gia nhập ASEAN (1995), bình thường hóa quan hệ với Mỹ (1995)</li>
                    <li>• Đời sống nhân dân được cải thiện rõ rệt</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-black z-10"></div>
              <div className="w-1/2"></div>
            </motion.div>

            {/* 6. Ý nghĩa và bài học kinh nghiệm */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative mb-12 flex items-center"
            >
              <div className="w-1/2"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full border-4 border-black z-10 flex items-center justify-center">
                <span className="text-black text-sm">⭐</span>
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border-2 border-red-600 p-6 rounded-lg">
                  <div className="inline-block bg-red-700 text-white px-3 py-1 rounded text-sm mb-3">Ý nghĩa & Bài học</div>
                  <h3 className="text-2xl font-bold text-gradient mb-3">💡 Ý nghĩa và bài học kinh nghiệm</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-gold-400 font-semibold mb-1">Ý nghĩa:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Cứu đất nước thoát khỏi khủng hoảng kinh tế - xã hội</li>
                        <li>• Khẳng định sức sống của chủ nghĩa xã hội</li>
                        <li>• Mở ra con đường phát triển mới cho đất nước</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-gold-400 font-semibold mb-1">Bài học:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Đổi mới phải toàn diện, đồng bộ và có trọng tâm</li>
                        <li>• Kết hợp sức mạnh dân tộc với sức mạnh thời đại</li>
                        <li>• Giữ vững định hướng XHCN, không dao động trước khó khăn</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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
