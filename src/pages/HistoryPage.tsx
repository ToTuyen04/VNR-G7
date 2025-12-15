import { motion } from 'framer-motion';

const HistoryPage = () => {
  const timelineEvents = [
    {
      date: '3/2/1930',
      dateLabel: '3/2/1930',
      title: 'Đảng Cộng sản Việt Nam ra đời',
      description: 'Ngày 3/2/1930, tại Hương Cảng (Trung Quốc), lãnh tụ Nguyễn Ái Quốc chủ trì Hội nghị hợp nhất các tổ chức cộng sản, thành lập Đảng Cộng sản Việt Nam.',
      details: [
        'Thống qua Cương lĩnh chính trị đầu tiên: Xác định đường lối chiến lược là làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản.',
        'Sự kiện này là bước ngoặt vĩ đại, chấm dứt sự khủng hoảng về đường lối cứu nước kéo dài nhiều thập kỷ.'
      ],
      images: ['/images/hcm-young.jpg', '/images/party-founding.jpg', '/images/party-doc.jpg']
    },
    {
      date: '1930-1931',
      dateLabel: '1930-1931',
      title: 'Cao trào cách mạng 1930-1931',
      description: 'Đảng vừa ra đời đã lãnh đạo quần chúng đấu tranh quyết liệt. Đỉnh cao là phong trào Xô viết Nghệ - Tĩnh.',
      details: [
        'Tháng 9/1930, nông dân Hưng Nguyên (Nghệ An) biểu tình lớn. Chính quyền thực dân tan rã ở nhiều thôn xã.',
        'Chính quyền Xô viết (chính quyền của dân, do dân, vì dân) được thành lập, thực hiện chia ruộng đất, xóa bỏ tệ nạn, khuyến khích học chữ.',
        'Tuy bị thực dân Pháp dìm trong bể máu, nhưng đây là cuộc tổng diễn tập đầu tiên của cách mạng Việt Nam.'
      ],
      images: ['/images/xoviet1.jpg', '/images/xoviet2.jpg']
    },
    {
      date: '1936-1939',
      dateLabel: '1936-1939',
      title: 'Phong trào Dân chủ 1936-1939',
      description: 'Lợi dụng tình hình Mặt trận Nhân dân Pháp lên cầm quyền, Đảng chuyển hướng chỉ đạo chiến lược: Đấu tranh đòi tự do, dân sinh, dân chủ.',
      details: [
        'Thành lập Mặt trận Dân chủ Đông Dương. Kết hợp đấu tranh công khai, hợp pháp với bí mật, bất hợp pháp.',
        'Sự kiện nổi bật: Cuộc mít tinh kỷ niệm ngày Quốc tế Lao động 1/5/1938 tại Khu Đầu Xéo (Hà Nội) với 25.000 người tham dự.',
        'Đây là cuộc tổng diễn tập thứ hai, giúp Đảng rèn luyện đội ngũ và mở rộng ảnh hưởng trong quần chúng.'
      ],
      images: ['/images/demo1938.jpg', '/images/movement.jpg']
    },
    {
      date: '1939-1945',
      dateLabel: '1939-1945',
      highlight: 'TRỌNG TÂM',
      title: 'Giải phóng dân tộc & Tổng khởi nghĩa',
      description: 'Thế chiến II bùng nổ. Đảng họp Hội nghị TW 6, 7, 8 -> Đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.',
      details: [
        'Tháng 5/1941: Nguyễn Ái Quốc về nước, chủ trì Hội nghị TW 8 tại Pắc Bó (Cao Bằng), thành lập Mặt trận Việt Minh.',
        '22/12/1944: Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân (tiền thân Quân đội nhân dân Việt Nam).',
        'Tháng 8/1945: Cơ hội cách mạng xuất hiện, Đảng lãnh đạo nhân dân nổ dậy tổng khởi nghĩa giành chính quyền trên toàn quốc.',
        '2/9/1945: Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.'
      ],
      images: []
    }
  ];

  const augustEvents = [
    {
      date: '13/8',
      title: 'QUÂN LỆNH SỐ 1',
      description: 'Ủy ban Khởi nghĩa toàn quốc ban bố Quân lệnh số 1, phát động tổng khởi nghĩa.'
    },
    {
      date: '16/8',
      title: 'ĐẠI HỘI TÁN TRÀO',
      description: 'Quốc dân Đại hội Tán Trào thông qua lệnh Tổng khởi nghĩa, bầu ra Ủy ban Dân tộc giải phóng.'
    },
    {
      date: '19/8',
      title: 'HÀ NỘI',
      description: 'Khởi nghĩa thắng lợi tại Hà Nội. Cả thủ đô nổ ngập tràn cờ đỏ sao vàng.'
    },
    {
      date: '23/8',
      title: 'HUẾ',
      description: 'Khởi nghĩa thắng lợi tại Huế. Vua Bảo Đại chấp nhận thoái vị.'
    }
  ];

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
            <a href="#history-section" className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">NỘI DUNG</a>
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
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-block border border-red-500 rounded-full px-6 py-2 mb-6">
              <span className="text-red-400 text-sm tracking-widest">📖 DÒNG CHẢY LỊCH SỬ</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-cinzel font-black mb-6">
              <span className="text-white">Giai đoạn </span>
              <span className="text-red-600">1930 - 1945</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Từ khi Đảng ra đời, qua các cao trào cách mạng đến thắng lợi huy hoàng của cuộc Tổng khởi nghĩa Tháng Tám.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div id="history-section" className="relative py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-red-900/30 hidden md:block"></div>

          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative mb-24 ${
                index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-black z-10 hidden md:block"></div>

              {/* Date Badge Large */}
              <div className={`absolute ${index % 2 === 0 ? 'right-8' : 'left-8'} top-0 text-8xl font-bold text-gray-800/20 hidden md:block`}>
                {event.date.includes('-') ? event.date.split('-')[0] : event.date.split('/')[2] || '1930'}
              </div>

              {/* Content Card */}
              <div className={`bg-gradient-to-br from-gray-900/80 to-black border-2 border-gray-800 rounded-lg p-8 ${
                index % 2 === 0 ? 'md:mr-auto md:w-5/6' : 'md:ml-auto md:w-5/6'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${event.highlight ? 'bg-gold-600' : 'bg-red-900'} text-white px-4 py-1 rounded text-sm font-bold`}>
                    {event.dateLabel}
                  </div>
                  {event.highlight && (
                    <div className="bg-gold-600 text-black px-4 py-1 rounded text-sm font-bold">
                      {event.highlight}
                    </div>
                  )}
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">{event.title}</h3>
                
                <p className="text-gray-400 mb-4 leading-relaxed">{event.description}</p>

                {event.details.map((detail, i) => (
                  <p key={i} className="text-gray-500 mb-2 leading-relaxed">
                    {detail}
                  </p>
                ))}

                {event.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {event.images.map((img, i) => (
                      <div key={i} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* August 1945 Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-red-950/10 to-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block border border-gold-500 rounded-full px-6 py-2 mb-6">
              <span className="text-gold-400 text-sm tracking-widest">🚩 MỐC SƠN LỊCH SỬ</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-cinzel font-black text-gradient mb-6">
              TỔNG KHỞI NGHĨA 1945
            </h2>
            <p className="text-gray-400 text-lg">
              15 ngày làm nên lịch sử, đập tan xiềng xích nô lệ gần 100 năm.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {augustEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-red-900/40 to-black border-2 border-red-800/50 rounded-lg p-6 hover:border-red-600 transition-all"
              >
                <div className="text-6xl font-bold text-gray-700/30 mb-2">{index + 1}</div>
                <div className="text-red-400 text-sm mb-3">📅 {event.date}</div>
                <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                <p className="text-gray-400 text-sm">{event.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Ba Dinh Square Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden border-4 border-gold-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10"></div>
            <img
              src="/images/ba-dinh.jpg"
              alt="Ba Dinh Square"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="bg-red-700 text-white px-4 py-2 rounded-full inline-block mb-4 text-sm font-bold">
                  KHOẢNH KHẮC LỊCH SỬ
                </div>
                <h3 className="text-5xl font-cinzel font-black text-white mb-4">
                  Quảng trường Ba Đình, ngày 2/9/1945
                </h3>
                <p className="text-gold-300 text-lg italic max-w-3xl mx-auto">
                  "Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-black border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <span className="text-black text-xl">⭐</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mùa Thu Cách Mạng</h3>
                <p className="text-xs text-gray-500">VNR202 - HISTORY</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Dự án số hóa lịch sử giai đoạn 1930-1945. Khơi dậy niềm tự hào dân tộc qua lăng kính công nghệ hiện đại.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Điều hướng</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Trang chủ</a></li>
              <li><a href="#history-section" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Nội dung lịch sử</a></li>
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
                <span className="text-white">1</span> Nguyễn Mỹ Thái Hòa - Leader/Dev
              </li>
              <li className="text-gray-400">
                <span className="text-white">2</span> Nguyễn Hoàng Phúc - Content
              </li>
              <li className="text-gray-400">
                <span className="text-white">3</span> Lê Duy Trường - Designer
              </li>
              <li className="text-gray-400">
                <span className="text-white">4</span> Nguyễn Minh Hùng - Researcher
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
            © 2025 VNR202 Project. Designed for education purpose.
            <span className="ml-4">Made with ❤️ by Group 7</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HistoryPage;
