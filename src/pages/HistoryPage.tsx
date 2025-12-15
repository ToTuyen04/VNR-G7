import { motion } from 'framer-motion';
import { useState } from 'react';
import HistoryChatBot from '../components/history/HistoryChatBot';
import SectionVoiceAssistant from '../components/history/SectionVoiceAssistant';

const HistoryPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const timelineEvents = [
    {
      year: '1986',
      date: '12/1986',
      dateLabel: 'Tháng 12/1986',
      title: 'Đại hội VI của Đảng: Khởi Xướng Công Cuộc Đổi Mới',
      highlight: 'BƯỚC NGOẶT',
      description: 'Việt Nam rơi vào khủng hoảng kinh tế – xã hội kéo dài, lạm phát tăng vọt lên tới 774% năm 1986, đời sống nhân dân khó khăn.',
      sections: [
        {
          title: 'Bối cảnh lịch sử',
          icon: '📊',
          content: [
            'Sau thắng lợi thống nhất đất nước (1975), Việt Nam bước vào thời kỳ quá độ lên chủ nghĩa xã hội trong điều kiện vô cùng khó khăn',
            'Nền kinh tế rơi vào khủng hoảng kéo dài, sản xuất trì trệ',
            'Lạm phát tăng vọt: 300% (1985) → 774% (1986)',
            'Đời sống nhân dân khó khăn, thiếu lương thực',
            'Cơ chế quản lý hành chính bao cấp triệt tiêu động lực sản xuất'
          ]
        },
        {
          title: 'Mục đích Đại hội',
          icon: '🎯',
          content: [
            'Nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật',
            'Chỉ rõ những sai lầm, khuyết điểm nghiêm trọng (nhất là bệnh chủ quan, duy ý chí) trong giai đoạn 1975–1986',
            'Bầu đồng chí Nguyễn Văn Linh làm Tổng Bí thư',
            'Quy mô: 1.129 đại biểu (đại diện gần 2 triệu đảng viên)'
          ]
        },
        {
          title: 'Đường lối Đổi mới',
          icon: '💡',
          content: [
            'Đề ra đường lối đổi mới toàn diện đất nước',
            'Đổi mới tư duy, trước hết là tư duy kinh tế là cấp bách',
            'Kinh tế là trung tâm, xây dựng Đảng là then chốt',
            'Chuyển sang kinh tế thị trường có định hướng xã hội chủ nghĩa'
          ]
        },
        {
          title: 'Nội dung cốt lõi',
          icon: '⚙️',
          content: [
            'Thực hiện nhất quán nền kinh tế nhiều thành phần',
            'Xóa bỏ cơ chế tập trung, quan liêu, bao cấp',
            'Chuyển sang kết hợp kế hoạch với thị trường',
            'Ba chương trình kinh tế lớn: Lương thực – thực phẩm; Hàng tiêu dùng; Hàng xuất khẩu',
            'Đổi mới tư duy, thực hiện chủ trương "dân biết, dân bàn, dân làm, dân kiểm tra"'
          ]
        },
        {
          title: 'Kết quả bước đầu',
          icon: '📈',
          content: [
            'Lạm phát giảm mạnh từ 774,7% (1986) xuống còn 67,1% (1991)',
            'Đến năm 1989, Việt Nam bắt đầu xuất khẩu gạo sau khi đã đủ ăn',
            'Tạo nền móng cho mô hình kinh tế thị trường định hướng XHCN',
            'Khẳng định khả năng tự đổi mới, tự chỉnh đốn của Đảng'
          ]
        }
      ],
      images: []
    },
    {
      year: '1991',
      date: '6/1991',
      dateLabel: 'Tháng 6/1991',
      title: 'Đại hội VII của Đảng: Hoàn Chỉnh Nhận Thức Lý Luận',
      description: 'Dù có chuyển biến tích cực, đất nước vẫn chưa thoát khỏi khủng hoảng kinh tế – xã hội; bối cảnh quốc tế có biến động phức tạp do Liên Xô và các nước XHCN Đông Âu sụp đổ.',
      sections: [
        {
          title: 'Nội dung trọng tâm',
          icon: '📜',
          content: [
            'Lần đầu tiên thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội (Cương lĩnh 1991)',
            'Khẳng định tiếp tục con đường xã hội chủ nghĩa',
            'Phát triển kinh tế nhiều thành phần',
            'Mở rộng quan hệ đối ngoại, đa phương hóa, đa dạng hóa'
          ]
        },
        {
          title: 'Định hướng chiến lược',
          icon: '🧭',
          content: [
            'Khẳng định 5 bài học lớn của cách mạng',
            'Phải nắm vững ngọn cờ độc lập dân tộc gắn liền với chủ nghĩa xã hội',
            'Thông qua Chiến lược ổn định và phát triển kinh tế – xã hội đến năm 2000',
            'Mục tiêu: Ra khỏi khủng hoảng kinh tế – xã hội và đạt GDP tăng gấp khoảng 2 lần so với năm 1990'
          ]
        },
        {
          title: 'Kết quả giai đoạn 1991-1995',
          icon: '📊',
          content: [
            'Tốc độ tăng trưởng kinh tế đạt khoảng 5,5% – 6,5%/năm',
            'Lạm phát được kiềm chế mạnh (xuống còn 12,7% năm 1995)',
            'Việt Nam gia nhập ASEAN (1995)',
            'Bình thường hóa quan hệ ngoại giao với Hoa Kỳ (1995)'
          ]
        }
      ],
      images: []
    },
    {
      year: '1994',
      date: '1/1994',
      dateLabel: 'Tháng 1/1994',
      title: 'Hội nghị Đại biểu Toàn quốc Giữa Nhiệm kỳ Khóa VII: Nhận Diện Nguy Cơ',
      description: 'Đánh giá tình hình sau Đại hội VII và xác định những vấn đề lớn cần tập trung giải quyết, giữ vững định hướng xã hội chủ nghĩa.',
      sections: [
        {
          title: 'Cảnh báo 4 Nguy cơ lớn',
          icon: '⚠️',
          content: [
            '1. Tụt hậu xa hơn về kinh tế',
            '2. Chệch hướng xã hội chủ nghĩa',
            '3. Tham nhũng và tệ quan liêu',
            '4. Âm mưu "diễn biến hòa bình" của các thế lực thù địch'
          ]
        },
        {
          title: 'Phát triển nhận thức',
          icon: '🏛️',
          content: [
            'Lần đầu tiên khẳng định chủ trương xây dựng Nhà nước pháp quyền xã hội chủ nghĩa',
            'Nhà nước của nhân dân, do nhân dân, vì nhân dân',
            'Do Đảng Cộng sản Việt Nam lãnh đạo',
            'Hoàn thiện thể chế kinh tế thị trường',
            'Tăng cường hội nhập kinh tế quốc tế',
            'Đẩy mạnh công nghiệp hóa, hiện đại hóa'
          ]
        }
      ],
      images: []
    },
    {
      year: '1996',
      date: '1986-1996',
      dateLabel: '1986-1996',
      highlight: 'KẾT QUẢ',
      title: 'Tổng kết Kết quả Đổi mới Giai đoạn 1986 – 1996',
      description: 'Đất nước thoát khỏi khủng hoảng kinh tế – xã hội kéo dài. Việt Nam bảo đảm an ninh lương thực và trở thành nước xuất khẩu gạo từ năm 1989.',
      sections: [
        {
          title: 'Kinh tế',
          icon: '💰',
          content: [
            'Lạm phát giảm mạnh từ 774,7% (1986) xuống còn 12,7% (1995)',
            'GDP tăng trưởng bình quân 7-8%/năm',
            'Từ nước thiếu lương thực → xuất khẩu gạo lớn thứ 2 thế giới',
            'Bảo đảm an ninh lương thực từ năm 1989',
            'Hình thành nền kinh tế hàng hóa nhiều thành phần'
          ]
        },
        {
          title: 'Cơ chế quản lý',
          icon: '⚙️',
          content: [
            'Vận hành theo cơ chế thị trường có sự quản lý của Nhà nước',
            'Xóa bỏ cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp',
            'Thực hiện nhất quán nền kinh tế nhiều thành phần',
            'Kết hợp kế hoạch với thị trường'
          ]
        },
        {
          title: 'Chính trị – Xã hội',
          icon: '🏛️',
          content: [
            'Ổn định chính trị – xã hội được giữ vững',
            'Tạo môi trường thuận lợi cho phát triển',
            'Đời sống nhân dân được cải thiện rõ rệt',
            'Nhận thức về xây dựng Nhà nước pháp quyền xã hội chủ nghĩa từng bước hình thành'
          ]
        },
        {
          title: 'Đối ngoại',
          icon: '🌍',
          content: [
            'Phá thế bao vây, cấm vận',
            'Bình thường hóa quan hệ với Trung Quốc (1991)',
            'Bình thường hóa quan hệ với Hoa Kỳ (1995)',
            'Gia nhập ASEAN (1995)',
            'Vị thế quốc tế của Việt Nam được nâng cao'
          ]
        }
      ],
      images: []
    }
  ];

  const augustEvents = [
    {
      icon: '💰',
      title: 'KINH TẾ TĂNG TRƯỞNG',
      stat: '7-8%',
      description: 'GDP tăng trưởng bình quân/năm, đưa Việt Nam thoát khỏi khủng hoảng kinh tế'
    },
    {
      icon: '🌾',
      title: 'XUẤT KHẨU GẠO',
      stat: 'Top 2',
      description: 'Từ thiếu lương thực (1986) → Nước xuất khẩu gạo lớn thứ 2 thế giới'
    },
    {
      icon: '📉',
      title: 'LẠM PHÁT GIẢM',
      stat: '774% → 12.7%',
      description: 'Từ 774% (1986) xuống còn 12.7% (1995), ổn định kinh tế vĩ mô'
    },
    {
      icon: '🌍',
      title: 'HỘI NHẬP QUỐC TẾ',
      stat: 'ASEAN',
      description: 'Gia nhập ASEAN (1995), bình thường hóa quan hệ với Mỹ và Trung Quốc'
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
      <div className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20"></div>
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-block border-2 border-red-500 rounded-full px-8 py-3 mb-8">
              <span className="text-red-400 text-sm font-bold tracking-widest uppercase">📖 Công cuộc Đổi mới</span>
            </div>
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-black mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-white">Giai đoạn </span>
              <span className="block mt-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                1986 - 1996
              </span>
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Hành trình 10 năm đổi mới vĩ đại: Từ khủng hoảng đến phát triển, mở ra kỷ nguyên mới của nền kinh tế thị trường định hướng xã hội chủ nghĩa.
            </motion.p>
            
            {/* Scroll indicator */}
            <motion.div
              className="mt-12"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-red-500 text-3xl">↓</div>
              <p className="text-gray-500 text-sm mt-2">Cuộn để khám phá</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div id="history-section" className="relative py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-900/50 via-red-600/30 to-red-900/50 hidden lg:block"></div>

            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative mb-32 lg:mb-48"
              >
                {/* Timeline Dot - Clickable */}
                <motion.div 
                  className="absolute left-1/2 top-20 transform -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block cursor-pointer"
                  onClick={() => setSelectedEvent(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={`w-6 h-6 rounded-full border-4 border-black transition-all duration-300 ${
                    selectedEvent === index ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]' : 'bg-red-800'
                  }`}>
                    <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20"></div>
                  </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                  {/* Year Display - Left side on even, right on odd */}
                  <div className={`${index % 2 === 0 ? 'lg:order-1 lg:text-right' : 'lg:order-2 lg:text-left'} flex justify-center lg:justify-start`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="text-[120px] lg:text-[180px] font-black leading-none opacity-40 bg-gradient-to-b from-red-500 to-transparent bg-clip-text text-transparent" style={{ fontWeight: 900, WebkitTextStroke: '2px rgba(239, 68, 68, 0.3)' }}>
                        {event.year}
                      </div>
                      {/* Decorative circle */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-red-900/30 rounded-full"></div>
                    </motion.div>
                  </div>

                  {/* Content Card - Right side on even, left on odd */}
                  <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="relative group"
                    >
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                      
                      {/* Voice Assistant Character */}
                      <SectionVoiceAssistant
                        title={event.title}
                        content={`${event.description}${event.sections ? '. ' + event.sections.map(s => s.content.join('. ')).join('. ') : ''}`}
                        position={index % 2 === 0 ? 'right' : 'left'}
                      />
                      
                      {/* Card */}
                      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 rounded-2xl p-8 overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                          }}></div>
                        </div>

                        {/* Date Badge */}
                        <div className="relative flex items-center gap-3 mb-6">
                          <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
                            event.highlight 
                              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black' 
                              : 'bg-red-900/80 text-red-100'
                          }`}>
                            {event.dateLabel.split(/(\d{4})/).map((part, i) => 
                              /^\d{4}$/.test(part) ? <span key={i} className="font-extrabold">{part}</span> : part
                            )}
                          </div>
                          {event.highlight && (
                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
                              ⭐ {event.highlight}
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="relative text-3xl lg:text-4xl font-cinzel font-black text-red-500 mb-6 leading-tight">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="relative text-gray-300 mb-6 leading-relaxed text-base font-vietnam">
                          {event.description}
                        </p>

                        {/* Sections with expandable content */}
                        {event.sections && (
                          <div className="relative space-y-4">
                            {event.sections.map((section, idx) => (
                              <div key={idx}>
                                <button
                                  onClick={() => toggleSection(`${index}-${idx}`)}
                                  className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg transition-all group"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{section.icon}</span>
                                    <h4 className="text-white font-semibold text-left font-vietnam">{section.title}</h4>
                                  </div>
                                  <span className="text-gold-400 text-xl group-hover:scale-110 transition-transform">
                                    {expandedSection === `${index}-${idx}` ? '−' : '+'}
                                  </span>
                                </button>
                                
                                {expandedSection === `${index}-${idx}` && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-2 p-4 bg-gray-900/50 rounded-lg overflow-hidden"
                                  >
                                    <div className="space-y-3">
                                      {section.content.map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                          <div className="mt-2 w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></div>
                                          <p className="text-gray-300 leading-relaxed text-base font-vietnam">
                                            {item}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Images */}
                        {event.images && event.images.length > 0 && (
                          <div className="relative grid grid-cols-2 gap-4 mt-8">
                            {event.images.map((img, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? -2 : 2 }}
                                className="relative group/img"
                              >
                                <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 group-hover/img:border-red-600 transition-colors">
                                  <img 
                                    src={img.src} 
                                    alt={img.caption}
                                    className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity" 
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">{img.caption}</p>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section - Achievements */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-blue-950/10 to-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block border border-gold-500 rounded-full px-6 py-2 mb-6">
              <span className="text-gold-400 text-sm tracking-widest">📊 THÀNH TỰU NỔI BẬT</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-cinzel font-black text-gradient mb-6">
              Kết Quả Vượt Bậc
            </h2>
            <p className="text-gray-400 text-lg">
              Những con số ấn tượng đánh dấu thành công của 10 năm đổi mới
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {augustEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/80 to-black border-2 border-gray-700 hover:border-gold-500 rounded-lg p-6 transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{event.icon}</div>
                <div className="text-4xl font-black text-gold-400 mb-2">{event.stat}</div>
                <h3 className="text-lg font-bold text-white mb-3">{event.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Ý nghĩa và Bài học Kinh nghiệm */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-red-950/10 to-black">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block border border-gold-500 rounded-full px-6 py-2 mb-6">
              <span className="text-gold-400 text-sm tracking-widest">💡 TỔNG KẾT</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-cinzel font-black text-gradient mb-6">
              Ý Nghĩa & Bài Học
            </h2>
            <p className="text-gray-400 text-lg">
              Giá trị lịch sử và những kinh nghiệm quý báu từ 10 năm đổi mới
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Ý nghĩa Lịch sử */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-900/40 to-black border-2 border-red-600/50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">🏆</span>
                <h3 className="text-3xl font-bold text-gold-400">Ý nghĩa Lịch sử</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed">
                    Đánh dấu bước chuyển có tính lịch sử của đất nước từ cơ chế kế hoạch hóa tập trung sang <span className="text-white font-bold">kinh tế thị trường định hướng xã hội chủ nghĩa</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed">
                    Cứu đất nước thoát khỏi <span className="text-red-400 font-bold">khủng hoảng kinh tế - xã hội</span>, mở ra con đường phát triển mới
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed">
                    Tạo nền tảng vững chắc cho thời kỳ đẩy mạnh <span className="text-white font-bold">công nghiệp hóa, hiện đại hóa</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed">
                    Khẳng định <span className="text-white font-bold">sức sống của chủ nghĩa xã hội</span> trong điều kiện mới
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bài học Kinh nghiệm */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/40 to-black border-2 border-blue-600/50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">📚</span>
                <h3 className="text-3xl font-bold text-blue-400">Bài học Kinh nghiệm</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-gold-400 font-bold text-lg flex-shrink-0">1.</span>
                  <p className="text-gray-300 leading-relaxed">
                    Kiên định mục tiêu <span className="text-white font-bold">độc lập dân tộc</span> gắn liền với <span className="text-white font-bold">chủ nghĩa xã hội</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-gold-400 font-bold text-lg flex-shrink-0">2.</span>
                  <p className="text-gray-300 leading-relaxed">
                    Quán triệt tư tưởng <span className="text-red-400 font-bold">"lấy dân làm gốc"</span>, xuất phát từ lợi ích và nguyện vọng của nhân dân
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-gold-400 font-bold text-lg flex-shrink-0">3.</span>
                  <p className="text-gray-300 leading-relaxed">
                    Tôn trọng <span className="text-white font-bold">quy luật khách quan</span> của kinh tế thị trường, gắn với vai trò quản lý của Nhà nước
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-gold-400 font-bold text-lg flex-shrink-0">4.</span>
                  <p className="text-gray-300 leading-relaxed">
                    Kết hợp chặt chẽ <span className="text-white font-bold">đổi mới kinh tế</span> với <span className="text-white font-bold">đổi mới chính trị</span>, giữ vững ổn định xã hội
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-gold-400 font-bold text-lg flex-shrink-0">5.</span>
                  <p className="text-gray-300 leading-relaxed">
                    Không ngừng <span className="text-white font-bold">xây dựng, chỉnh đốn Đảng</span> và chủ động mở rộng đối ngoại, <span className="text-white font-bold">hội nhập quốc tế</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-2 border-gold-500/50 rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="text-6xl mb-6">🚢</div>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic mb-4">
              "Quá trình đổi mới giai đoạn 1986–1996 có thể được hình dung như việc <span className="text-gold-400 font-bold">chuyển đổi một con tàu</span> đang mắc kẹt trong cơn bão (khủng hoảng kinh tế) sang một hải trình mới (kinh tế thị trường), nơi việc <span className="text-red-400 font-bold">đổi mới tư duy</span> (Đại hội VI) giúp xác định lại la bàn, và việc thông qua <span className="text-blue-400 font-bold">Cương lĩnh</span> (Đại hội VII) giúp vẽ ra bản đồ chi tiết cho hành trình dài phía trước."
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
          </motion.div>
        </div>
      </div>

      {/* Floating Star Icon - Bottom Right */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(220, 38, 38, 0.5)',
              '0 0 40px rgba(220, 38, 38, 0.8)',
              '0 0 20px rgba(220, 38, 38, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-yellow-300 text-3xl">★</span>
        </motion.div>
      </motion.div>

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
                <span className="text-white">1</span> Nguyễn Lê Kim Ngân - Leader
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
            © 2025 VNR202 Project. Designed for education purpose.
            <span className="ml-4">Made with ❤️ by Group 7</span>
          </p>
        </div>
      </footer>

      {/* ChatBot */}
      <HistoryChatBot />
    </div>
  );
};

export default HistoryPage;
