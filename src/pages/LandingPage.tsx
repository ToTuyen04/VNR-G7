import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    document.title = 'Cơ cấu xã hội - giai cấp và liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên xã hội chủ nghĩa';
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const mainChapters = [
    {
      id: 'chapter1',
      number: 'I',
      title: 'Cơ cấu xã hội - Giai cấp trong thời kỳ quá độ lên CNXH',
      icon: '🏛️',
      color: 'red',
      borderColor: 'border-red-500',
      hoverShadow: 'hover:shadow-red-500/20',
      bgGradient: 'from-red-900/30 to-transparent',
      description: 'Khái niệm, vị trí và sự biến đổi có tính quy luật của cơ cấu xã hội - giai cấp',
      highlights: [
        'Khái niệm cơ cấu xã hội và cơ cấu xã hội - giai cấp',
        'Vị trí quan trọng hàng đầu của cơ cấu xã hội - giai cấp',
        'Sự biến đổi gắn liền với cơ cấu kinh tế'
      ]
    },
    {
      id: 'chapter2',
      number: 'II',
      title: 'Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên CNXH',
      icon: '🤝',
      color: 'blue',
      borderColor: 'border-blue-500',
      hoverShadow: 'hover:shadow-blue-500/20',
      bgGradient: 'from-blue-900/30 to-transparent',
      description: 'Tính tất yếu khách quan của liên minh giai cấp về chính trị và kinh tế',
      highlights: [
        'Liên minh công nhân - nông dân - lao động khác',
        'Tính tất yếu về chính trị: Đoàn kết toàn dân',
        'Tính tất yếu về kinh tế: CNH, HĐH đất nước'
      ]
    },
    {
      id: 'chapter3',
      number: 'III',
      title: 'Cơ cấu xã hội - Giai cấp và Liên minh tại Việt Nam',
      icon: '🇻🇳',
      color: 'yellow',
      borderColor: 'border-yellow-500',
      hoverShadow: 'hover:shadow-yellow-500/20',
      bgGradient: 'from-yellow-900/30 to-transparent',
      description: 'Thực tiễn cơ cấu xã hội và liên minh giai cấp ở Việt Nam thời kỳ đổi mới',
      highlights: [
        'Các giai cấp, tầng lớp tại Việt Nam',
        'Nội dung liên minh: Kinh tế, Chính trị, Văn hóa - Xã hội',
        '5 phương hướng xây dựng và tăng cường liên minh'
      ]
    }
  ];

  const socialClasses = [
    { icon: '👷', name: 'Giai cấp công nhân', role: 'Lãnh đạo cách mạng' },
    { icon: '🌾', name: 'Giai cấp nông dân', role: 'Vị trí chiến lược CNH-HĐH' },
    { icon: '🎓', name: 'Đội ngũ trí thức', role: 'Lực lượng sáng tạo' },
    { icon: '💼', name: 'Đội ngũ doanh nhân', role: 'Phát triển kinh tế' },
    { icon: '👩', name: 'Phụ nữ', role: 'Bình đẳng giới' },
    { icon: '👨‍🎓', name: 'Thanh niên', role: 'Rường cột nước nhà' }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("/img/anhnen.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.75
        }}
      ></div>
      
      {/* Overlay */}
      <div className="fixed inset-0 z-[1] bg-black/50"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/img/VIETNAM_MAP.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">MLN131</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">nhóm 5 - FPT University</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">TRANG CHỦ</a>
            <a href="/noi-dung" className="text-white hover:text-gold-400 transition-colors tracking-wide">NỘI DUNG</a>
            <a href="/trien-lam" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRIỂN LÃM</a>
            <a href="/on-tap" className="text-white hover:text-gold-400 transition-colors tracking-wide">ÔN TẬP</a>
            <a href="/games" className="text-white hover:text-gold-400 transition-colors tracking-wide">GAME</a>
            <a href="/tai-lieu" className="text-white hover:text-gold-400 transition-colors tracking-wide">TÀI LIỆU</a>
          </nav>
          <button 
            onClick={() => navigate('/noi-dung')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all"
          >
            🎓 Bắt đầu học
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

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
      <div className="relative z-20 px-4 max-w-6xl mx-auto">
        <div className="flex justify-center items-center">
          {/* Center Content */}
          <div className="text-center max-w-5xl">
            {showContent && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-6"
                >
                  <div className="inline-block border border-gold-500 rounded-full px-6 py-2 mb-8">
                    <span className="text-gold-400 text-sm tracking-widest">CHỦ NGHĨA XÃ HỘI KHOA HỌC</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <h1 className="font-cinzel font-black mb-4 leading-tight">
                    <div className="text-white text-3xl md:text-5xl mb-4">CƠ CẤU XÃ HỘI</div>
                    <div className="text-red-600 text-5xl md:text-7xl my-6">GIAI CẤP</div>
                    <div className="text-gradient text-2xl md:text-4xl mt-4">Trong thời kỳ quá độ lên CNXH</div>
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="mt-6"
                >
                  <p className="text-gray-400 text-lg mb-2">
                    Liên minh giai cấp, tầng lớp và ứng dụng thực tiễn tại <span className="text-white font-bold">Việt Nam</span>
                  </p>
                  <p className="text-gray-500 text-sm max-w-3xl mx-auto">
                    "Các giai cấp, tầng lớp liên kết chặt chẽ dưới sự lãnh đạo của Đảng để thực hiện mục tiêu chung là Dân giàu, nước mạnh, dân chủ, công bằng, văn minh"
                  </p>
                </motion.div>

                {/* Social Classes Icons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-10 flex flex-wrap justify-center gap-4"
                >
                  {socialClasses.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="bg-gray-900/60 border border-gray-700 hover:border-gold-500 px-4 py-3 rounded-lg flex items-center gap-3 transition-all hover:scale-105"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="text-white text-sm font-semibold">{item.name}</div>
                        <div className="text-gray-500 text-xs">{item.role}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
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

      {/* Main Chapters Section */}
      <div id="chapters-section" className="min-h-screen bg-black/70 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block border border-red-500 rounded-full px-6 py-2 mb-6">
              <span className="text-red-400 text-sm tracking-widest">📖 NỘI DUNG CHÍNH</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-cinzel font-black mb-4">
              <span className="text-white">BA CHƯƠNG </span>
              <span className="text-gradient">TRỌNG TÂM</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Tìm hiểu về cơ cấu xã hội - giai cấp, liên minh giai cấp tầng lớp và ứng dụng thực tiễn tại Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội.
            </p>
          </div>

          {/* Chapters Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {mainChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`bg-gradient-to-br ${chapter.bgGradient} bg-gray-900/80 border-2 border-gray-700 hover:${chapter.borderColor} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${chapter.hoverShadow} cursor-pointer group`}
                onClick={() => navigate(`/noi-dung?chapter=${chapter.id}`)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform">{chapter.icon}</div>
                  <div className={`text-4xl font-black text-${chapter.color}-500`}>{chapter.number}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                  {chapter.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{chapter.description}</p>
                <ul className="space-y-2">
                  {chapter.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className={`text-${chapter.color}-400 mt-1`}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-gold-400 text-sm font-semibold group-hover:underline">
                    Xem chi tiết →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key Concepts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-r from-red-900/30 via-yellow-900/20 to-red-900/30 border-2 border-gold-500/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gold-400 text-center mb-8">📌 Các nội dung liên minh quan trọng</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💰</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">Nội dung Kinh tế</h4>
                  <p className="text-gray-400 text-sm">Kết hợp lợi ích kinh tế, đẩy mạnh CNH-HĐH, mô hình 4 nhà</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🏛️</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">Nội dung Chính trị</h4>
                  <p className="text-gray-400 text-sm">Giữ vững vai trò lãnh đạo của Đảng, bảo vệ chế độ XHCN</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎭</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">Nội dung Văn hóa - XH</h4>
                  <p className="text-gray-400 text-sm">Xây dựng văn hóa tiên tiến, xóa đói giảm nghèo, an sinh xã hội</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => navigate('/noi-dung')}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full font-bold hover:from-red-700 hover:to-red-800 transition-all inline-flex items-center gap-2 group"
            >
              Xem chi tiết toàn bộ nội dung
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* 5 Phương hướng Section */}
      <div className="py-20 bg-gradient-to-b from-black via-blue-950/10 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block border border-blue-500 rounded-full px-6 py-2 mb-6">
              <span className="text-blue-400 text-sm tracking-widest">🎯 PHƯƠNG HƯỚNG</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-cinzel font-black mb-4">
              <span className="text-white">5 PHƯƠNG HƯỚNG </span>
              <span className="text-blue-400">CƠ BẢN</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Xây dựng cơ cấu xã hội - giai cấp và tăng cường liên minh trong thời kỳ quá độ lên CNXH ở Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { num: 1, title: 'Đẩy mạnh CNH, HĐH', desc: 'Giải quyết mối quan hệ tăng trưởng kinh tế với tiến bộ, công bằng xã hội', icon: '🏭' },
              { num: 2, title: 'Hệ thống chính sách XH', desc: 'Xây dựng chính sách tổng thể cho từng giai cấp, tầng lớp', icon: '📋' },
              { num: 3, title: 'Đồng thuận & Đoàn kết', desc: 'Phát huy tinh thần thống nhất giữa các lực lượng trong khối liên minh', icon: '🤝' },
              { num: 4, title: 'Hoàn thiện thể chế KTTT', desc: 'Đẩy mạnh khoa học công nghệ, Cách mạng công nghiệp 4.0', icon: '⚙️' },
              { num: 5, title: 'Đổi mới Đảng, NN, MTTQ', desc: 'Tăng cường khối liên minh và đại đoàn kết toàn dân', icon: '🏛️' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/60 border border-gray-700 hover:border-blue-500 rounded-xl p-6 transition-all group hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-black text-blue-400">0{item.num}</div>
                </div>
                <h4 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-red-900/40 via-yellow-900/20 to-red-900/40 border-2 border-gold-500/50 rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="text-6xl mb-6">🎯</div>
            <p className="text-xl md:text-2xl text-white leading-relaxed italic mb-6">
              "Các giai cấp, tầng lớp liên kết chặt chẽ dưới sự lãnh đạo của Đảng để thực hiện mục tiêu chung là"
            </p>
            <p className="text-2xl md:text-3xl font-bold text-gold-400">
              "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh"
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-8"></div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-black border-t border-gray-800 py-12 px-4 relative z-10">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/img/VIETNAM_MAP.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cơ cấu XH - Giai cấp</h3>
                <p className="text-xs text-gray-500">MLN131 - CNXHKH</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Dự án số hóa nội dung Chủ nghĩa xã hội khoa học về cơ cấu xã hội - giai cấp và liên minh giai cấp, tầng lớp.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Điều hướng</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Trang chủ</a></li>
              <li><a href="/noi-dung" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Nội dung chi tiết</a></li>
              <li><a href="/trien-lam" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Triển lãm số</a></li>
              <li><a href="/games" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Trò chơi ôn tập</a></li>
              <li><a href="/tai-lieu" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Kho tài liệu</a></li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-white font-bold mb-4">Nhóm thực hiện</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                <span className="text-white">1</span> Nguyễn Lê Kim Ngân - Leader & Designer
              </li>
              <li className="text-gray-400">
                <span className="text-white">2</span> Trần Kim Nhã - Contentor & Researcher
              </li>
              <li className="text-gray-400">
                <span className="text-white">3</span> Nguyễn Quý Hưng - Game Developer
              </li>
              <li className="text-gray-400">
                <span className="text-white">4</span> Tô Minh Tuyền - Web Developer
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Thông tin môn học</h4>
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                <span className="text-gold-400">🏫</span> Đại học FPT (FPT University)<br/>
                <span className="text-gray-500">Mentor: Mrs. Dương Thị Thúy Thơ</span>
              </p>
              <p className="italic text-gray-500 border-l-2 border-gold-500 pl-3">
                "Dân ta phải biết sử ta,<br/>
                Cho tường gốc tích nước nhà Việt Nam."<br/>
                <span className="text-gold-400">— Hồ Chí Minh</span>
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 MLN131 Project. Designed for education purpose.
            <span className="ml-4">Made with ❤️ by Group 7</span>
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default LandingPage;
