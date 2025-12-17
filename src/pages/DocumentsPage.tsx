import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DocumentItem {
  id: number;
  title: string;
  period: string;
  image: string;
  description: string;
  content: string;
  link?: string;
}

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  useEffect(() => {
    document.title = 'VNR202 - Tài liệu';
  }, []);

  const documents: DocumentItem[] = [
    {
      id: 1,
      title: 'Văn kiện Đại hội Đảng lần thứ VI',
      period: 'Đại hội VI',
      image: '/img/daihoi6.jpg',
      description: 'Văn kiện chính thức của Đại hội Đảng lần thứ VI (tháng 12/1986) - mốc son đánh dấu công cuộc Đổi mới toàn diện đất nước.',
      content: 'Đại hội VI đã đề ra đường lối đổi mới toàn diện, trong đó đổi mới tư duy kinh tế là cấp bách nhất. Khẳng định kinh tế là trung tâm, xây dựng Đảng là then chốt. Đại hội đã bầu đồng chí Nguyễn Văn Linh làm Tổng Bí thư.',
      link: 'https://nvsk.vnanet.vn/ho-so/van-kien-dai-hoi-dang-lan-thu-vi-3-170216.vna'
    },
    {
      id: 2,
      title: 'Văn kiện Đại hội Đảng lần thứ VII',
      period: 'Đại hội VII',
      image: '/img/dh7.png',
      description: 'Văn kiện Đại hội Đảng lần thứ VII (năm 1991) - tiếp tục đẩy mạnh công cuộc Đổi mới, khẳng định 5 bài học lớn của cách mạng.',
      content: 'Đại hội VII đã thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội. Tiếp tục đường lối đổi mới toàn diện, phát triển kinh tế thị trường định hướng xã hội chủ nghĩa.',
      link: 'https://nvsk.vnanet.vn/ho-so/van-kien-dai-hoi-dang-lan-thu-vii-3-170227.vna'
    },
    {
      id: 3,
      title: 'Từ "Khoán 10" đến cường quốc xuất khẩu gạo',
      period: 'Khoán 10',
      image: '/img/dmnongnghiep.jpg',
      description: '90 năm Đảng Cộng sản Việt Nam: Bài học lớn về tin dân, trọng dân và quyết tâm đổi mới của Đảng thông qua chính sách Khoán 10.',
      content: 'Chính sách Khoán 10 (1988) đã tạo nên bước ngoặt lịch sử, giúp Việt Nam từ thiếu lương thực trở thành nước xuất khẩu gạo lớn thứ 2 thế giới. Đây là minh chứng rõ nét nhất cho đường lối đổi mới đúng đắn của Đảng.',
      link: 'https://vnanet.vn/vi/anh/anh-chuyen-de-1053/90-nam-dcs-viet-nam-tu-khoan-10-den-cuong-quoc-xuat-khau-gao--bai-hoc-lon-ve-tin-dan-trong-dan-va-quyet-tam-doi-moi-cua-dang-4398591.html'
    },
    {
      id: 4,
      title: 'Việt Nam chuyển mình sau 33 năm Đổi mới',
      period: 'Đổi mới',
      image: '/img/kqdm.jpg',
      description: 'Những hình ảnh về sự chuyển mình mạnh mẽ của Việt Nam sau hơn 33 năm thực hiện công cuộc Đổi mới.',
      content: 'Từ một nước nghèo nàn, lạm phát cao, thiếu lương thực, Việt Nam đã trở thành nền kinh tế năng động, hội nhập quốc tế sâu rộng. Thành tựu to lớn trong phát triển kinh tế - xã hội, xóa đói giảm nghèo, nâng cao đời sống nhân dân.',
      link: 'https://thanhgiong.vn/nhung-hinh-anh-viet-nam-chuyen-minh-sau-33-nam-doi-moi-37440.html'
    }
  ];

  const periods = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Đại hội VI', name: 'Đại hội VI' },
    { id: 'Đại hội VII', name: 'Đại hội VII' },
    { id: 'Khoán 10', name: 'Khoán 10' },
    { id: 'Đổi mới', name: 'Đổi mới' }
  ];

  const filteredDocuments = selectedPeriod === 'all' 
    ? documents 
    : documents.filter(doc => doc.period === selectedPeriod);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("/img/daihoidang.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.25
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
              <h1 className="text-xl font-bold text-white tracking-wide">VNR202</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Nhóm 7 - FPT University</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigate('/')} className="text-white hover:text-gold-400 transition-colors tracking-wide">TRANG CHỦ</button>
            <button onClick={() => navigate('/noi-dung')} className="text-white hover:text-gold-400 transition-colors tracking-wide">NỘI DUNG</button>
            <a href="#" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRIỂN LÃM</a>
            <button onClick={() => navigate('/on-tap')} className="text-white hover:text-gold-400 transition-colors tracking-wide">ÔN TẬP</button>
            <button onClick={() => navigate('/games')} className="text-white hover:text-gold-400 transition-colors tracking-wide">GAME</button>
            <span className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">TÀI LIỆU</span>
          </nav>
          <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all">
            🎓 Bắt đầu học
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-block mb-4 px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full"
              animate={{ boxShadow: ['0 0 10px rgba(220, 38, 38, 0.3)', '0 0 20px rgba(220, 38, 38, 0.6)', '0 0 10px rgba(220, 38, 38, 0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-red-500 text-sm font-bold tracking-wider">⏱ KHÔNG GIAN TRƯNG BÀY</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">TÀI LIỆU LỊCH SỬ</h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Văn kiện chính thức và tư liệu về Đại hội VI, Đại hội VII, chính sách Khoán 10 và công cuộc Đổi mới của Đảng Cộng sản Việt Nam.
            </p>
          </motion.div>

          {/* Period Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {period.name}
              </button>
            ))}
          </motion.div>

          {/* Documents Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedDocument(doc)}
                  className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-red-600/50 transition-all group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={doc.image}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/img/VIETNAM_MAP.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs rounded-full mb-2">
                        {doc.period}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{doc.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{doc.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDocument(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border-2 border-red-600/50"
            >
              <div className="grid md:grid-cols-2 h-full">
                {/* Image Side */}
                <div className="relative bg-black flex items-center justify-center p-8">
                  <img
                    src={selectedDocument.image}
                    alt={selectedDocument.title}
                    className="max-w-full max-h-[70vh] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/img/VIETNAM_MAP.jpg';
                    }}
                  />
                </div>

                {/* Content Side */}
                <div className="p-8 overflow-y-auto">
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-white text-2xl">×</span>
                  </button>

                  <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm rounded-full mb-4">
                    📅 {selectedDocument.period}
                  </span>

                  <h2 className="text-3xl font-bold mb-6">{selectedDocument.title}</h2>

                  <div className="mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-yellow-400 text-xl">ℹ️</span>
                      <div>
                        <h3 className="text-yellow-400 font-bold mb-2">BỐI CẢNH LỊCH SỬ</h3>
                        <p className="text-gray-300 leading-relaxed">{selectedDocument.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-400 leading-relaxed">{selectedDocument.content}</p>
                  </div>

                  {selectedDocument.link && (
                    <div className="mt-8">
                      <a
                        href={selectedDocument.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                      >
                        <span>Xem thêm tài liệu</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-gray-400 italic text-sm leading-relaxed">
                        💬 Hình ảnh tư liệu lịch sử được lưu trữ bởi kho tàng Lịch sử Quốc gia và các nguồn chính thống.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="text-xl font-bold text-white">Công cuộc Đổi mới</h3>
                <p className="text-xs text-gray-500">VNR202 - HISTORY</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Dự án số hóa lịch sử giai đoạn 1986-1996. Khơi dậy niềm tự hào dân tộc về công cuộc Đổi mới vĩ đại.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Điều hướng</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Trang chủ</a></li>
              <li><a href="/noi-dung" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Nội dung lịch sử</a></li>
              <li><a href="#timeline" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Triển lãm số</a></li>
              <li><a href="/games" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Trò chơi mật mã</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Kho tài liệu</a></li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-white font-bold mb-4">Nhóm thực hiện</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                <span className="text-white">1</span> Nguyễn Lê Kim Ngân -  Leader & Designer
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
                "Dân ta một lòng theo Đảng,<br/>
                Để cho non nước huy hoàng, vinh quang."<br/>
                <span className="text-gold-400">— Hồ Chí Minh</span>
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 VNR202 Project. Designed for education purpose.
            <span className="ml-4">Made with ❤️ by Group 7</span>
          </p>
        </div>
      </footer>      </div>    </div>
  );
};

export default DocumentsPage;
