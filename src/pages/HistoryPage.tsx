import { motion } from 'framer-motion';
import { useState } from 'react';

const HistoryPage = () => {
  const [activeSection, setActiveSection] = useState(0);

  const historySections = [
    {
      title: 'CÁCH MẠNG THÁNG TÁM 1945',
      date: 'Tháng 8 năm 1945',
      content: 'Cách mạng tháng Tám là cuộc cách mạng giải phóng dân tộc do Đảng Cộng sản Đông Dương và Chủ tịch Hồ Chí Minh lãnh đạo, diễn ra trong tháng 8 năm 1945, lật đổ ách thống trị của thực dân Pháp và phát xít Nhật, giành chính quyền về tay nhân dân, thành lập nước Việt Nam Dân chủ Cộng hòa.',
      image: '/images/history-1.jpg'
    },
    {
      title: 'TỔNG KHỞI NGHĨA',
      date: '14-19 tháng 8 năm 1945',
      content: 'Từ ngày 14 đến 19 tháng 8 năm 1945, phong trào Tổng khởi nghĩa nổ ra khắp cả nước với sức mạnh như vũ bão. Nhân dân ta từ Nam chí Bắc đồng loạt đứng lên giành chính quyền về tay mình.',
      image: '/images/history-2.jpg'
    },
    {
      title: 'CÁCH MẠNG THÀNH CÔNG',
      date: '19 tháng 8 năm 1945',
      content: 'Ngày 19 tháng 8 năm 1945, cách mạng Hà Nội thành công. Chính quyền cách mạng được thành lập ở thủ đô. Đây là sự kiện lịch sử có ý nghĩa quyết định, đánh dấu thắng lợi hoàn toàn của Cách mạng Tháng Tám trong cả nước.',
      image: '/images/history-3.jpg'
    },
    {
      title: 'TUYÊN NGÔN ĐỘC LẬP',
      date: '2 tháng 9 năm 1945',
      content: 'Ngày 2 tháng 9 năm 1945, tại Quảng trường Ba Đình - Hà Nội, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh ra nước Việt Nam Dân chủ Cộng hòa, nhà nước công nông đầu tiên ở Đông Nam Á.',
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
            SỬ THI 1945
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
          <h2 className="section-title text-center mb-12">HÀNH TRÌNH LỊCH SỬ</h2>
          
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
