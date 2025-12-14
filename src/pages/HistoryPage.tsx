import { motion } from 'framer-motion';
import { useState } from 'react';

const HistoryPage = () => {
  const [activeSection, setActiveSection] = useState(0);

  const historySections = [
    {
      title: 'ĐẠI HỘI ĐẠI BIỂU TOÀN QUỐC LẦN THỨ VI',
      date: 'Tháng 12 năm 1986',
      content: 'Đại hội VI của Đảng (12/1986) đánh dấu bước ngoặt lịch sử với đường lối đổi mới toàn diện. Khẳng định kinh tế là trung tâm, xây dựng Đảng là then chốt, văn hóa - xã hội là mục tiêu. Mở ra thời kỳ mới cho đất nước thoát khỏi khủng hoảng kinh tế - xã hội trầm trọng.',
      image: '/images/history-1.jpg'
    },
    {
      title: 'ĐỔI MỚI KINH TẾ - NÔNG NGHIỆP',
      date: '1988 - 1990',
      content: 'Nghị quyết 10 (4/1988) về đổi mới quản lý kinh tế nông nghiệp - giao đất, giao rừng cho nông dân, công nhận quyền tự chủ sản xuất kinh doanh. Việt Nam từ thiếu đói trở thành nước xuất khẩu gạo lớn thứ 2 thế giới. Đây là bước đột phá quan trọng đầu tiên của công cuộc đổi mới.',
      image: '/images/history-2.jpg'
    },
    {
      title: 'CHUYỂN ĐỔI CƠ CHẾ KINH TẾ',
      date: '1989 - 1992',
      content: 'Chuyển từ cơ chế kế hoạch hóa tập trung quan liêu bao cấp sang cơ chế thị trường có sự quản lý của Nhà nước theo định hướng xã hội chủ nghĩa. Thống nhất tỷ giá ngoại tệ, xóa bỏ cơ chế hai giá, khuyến khích phát triển kinh tế nhiều thành phần. Lạm phát giảm từ 400% xuống dưới 20%.',
      image: '/images/history-3.jpg'
    },
    {
      title: 'HỘI NHẬP VÀ PHÁT TRIỂN',
      date: '1995 - 1996',
      content: 'Việt Nam gia nhập ASEAN (7/1995), thiết lập quan hệ ngoại giao với Hoa Kỳ (1995), bình thường hóa quan hệ quốc tế. Đại hội VIII (1996) xác định tiếp tục đẩy mạnh công nghiệp hóa, hiện đại hóa. Kinh tế tăng trưởng bình quân 8-9%/năm, đời sống nhân dân được cải thiện rõ rệt.',
      image: '/images/history-4.jpg'
    }
  ];

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
            CÔNG CUỘC ĐỔI MỚI
          </motion.h1>
          <nav className="flex gap-6">
            <a href="/" className="text-gold-300 hover:text-gold-400 transition-colors">Trang chủ</a>
            <a href="/history" className="text-gold-300 hover:text-gold-400 transition-colors">Lịch sử</a>
            <a href="/games" className="text-gold-300 hover:text-gold-400 transition-colors">Trò chơi</a>
          </nav>
        </div>
      </header>

      <div className="pt-20">
        {/* Timeline Navigation */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="section-title text-center mb-12">CÔNG CUỘC ĐỔI MỚI 1986-1996</h2>
          
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {historySections.map((_, index) => (
                <div key={index} className="flex items-center">
                  <motion.button
                    className={`w-4 h-4 rounded-full transition-all ${
                      activeSection === index
                        ? 'bg-gold-500 scale-150'
                        : 'bg-gold-500/30 hover:bg-gold-500/50'
                    }`}
                    onClick={() => setActiveSection(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  {index < historySections.length - 1 && (
                    <div className="w-16 h-0.5 bg-gold-500/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto"
          >
            <div className="order-2 md:order-1">
              <motion.h3
                className="text-4xl font-cinzel font-bold text-gradient mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {historySections[activeSection].title}
              </motion.h3>
              <motion.p
                className="text-gold-400 text-xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {historySections[activeSection].date}
              </motion.p>
              <motion.p
                className="text-gray-300 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {historySections[activeSection].content}
              </motion.p>
            </div>
            
            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-gold-500/20">
                <img
                  src={historySections[activeSection].image}
                  alt={historySections[activeSection].title}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x400/1a1a1a/d97706?text=' + 
                      encodeURIComponent(historySections[activeSection].title);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <motion.button
              className="btn-secondary"
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Trước
            </motion.button>
            <motion.button
              className="btn-secondary"
              onClick={() => setActiveSection(Math.min(historySections.length - 1, activeSection + 1))}
              disabled={activeSection === historySections.length - 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tiếp →
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
