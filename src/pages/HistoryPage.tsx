import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface SubSection {
  title: string;
  items: string[];
}

interface SectionType {
  title: string;
  icon: string;
  content: string[];
  subsections?: SubSection[];
}

interface ChapterType {
  id: string;
  number: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  sections: SectionType[];
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeChapter, setActiveChapter] = useState<string>('chapter1');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'VNR202 - Nội dung chi tiết';
    const chapter = searchParams.get('chapter');
    if (chapter) {
      setActiveChapter(chapter);
    }
  }, [searchParams]);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const chapters: ChapterType[] = [
    {
      id: 'chapter1',
      number: 'I',
      title: 'Cơ cấu xã hội - Giai cấp trong thời kỳ quá độ lên CNXH',
      icon: '🏛️',
      color: 'red',
      description: 'Khái niệm, vị trí và sự biến đổi có tính quy luật của cơ cấu xã hội - giai cấp',
      sections: [
        {
          title: '1. Khái niệm và vị trí của cơ cấu xã hội - giai cấp trong cơ cấu xã hội',
          icon: '📚',
          content: [],
          subsections: [
            {
              title: 'a. Khái niệm',
              items: [
                '🔹 Cơ cấu xã hội: Là những cộng đồng người cùng toàn bộ những mối quan hệ xã hội do sự tác động lẫn nhau của các cộng đồng ấy tạo nên. Có nhiều loại như: cơ cấu xã hội - dân cư, nghề nghiệp, giai cấp, dân tộc, tôn giáo…',
                '🔹 Cơ cấu xã hội - giai cấp: Là hệ thống các giai cấp, tầng lớp xã hội tồn tại khách quan trong một chế độ xã hội nhất định, thông qua những mối quan hệ về sở hữu tư liệu sản xuất, về tổ chức quản lý quá trình sản xuất, về địa vị chính trị - xã hội... giữa các giai cấp và tầng lớp đó.',
                '🔹 Các giai cấp, tầng lớp và các nhóm xã hội cơ bản trong thời kỳ quá độ lên CNXH bao gồm: giai cấp công nhân, giai cấp nông dân, tầng lớp trí thức, tầng lớp doanh nhân, tiểu chủ, thanh niên, phụ nữ...',
                '👉 Dưới sự lãnh đạo của Đảng Cộng sản, các lực lượng này cùng hợp lực để thực hiện mục tiêu xây dựng chủ nghĩa xã hội.'
              ]
            },
            {
              title: 'b. Vị trí',
              items: [
                '⭐ Cơ cấu xã hội - giai cấp giữ vị trí quan trọng hàng đầu, chi phối các loại hình cơ cấu xã hội khác vì nó liên quan trực tiếp đến:',
                '• Các đảng phái chính trị',
                '• Nhà nước',
                '• Quyền sở hữu tư liệu sản xuất',
                '• Phân phối của cải xã hội'
              ]
            }
          ]
        },
        {
          title: '2. Sự biến đổi có tính quy luật của cơ cấu xã hội - giai cấp',
          icon: '🔄',
          content: [
            'Trong thời kỳ quá độ lên CNXH, cơ cấu xã hội - giai cấp biến đổi theo quy luật kinh tế và mang tính đa dạng, phức tạp:'
          ],
          subsections: [
            {
              title: 'Đặc điểm biến đổi',
              items: [
                '📌 Biến đổi gắn liền và bị quy định bởi cơ cấu kinh tế. Khi cơ cấu kinh tế chuyển đổi (từ nông nghiệp sang công nghiệp, dịch vụ; phát triển kinh tế nhiều thành phần), cơ cấu xã hội - giai cấp cũng thay đổi theo.',
                '📌 Biến đổi phức tạp, đa dạng với sự xuất hiện của các tầng lớp xã hội mới do nền kinh tế thị trường và xu thế hội nhập.',
                '📌 Biến đổi trong mối quan hệ vừa đấu tranh, vừa liên minh, từng bước xóa bỏ bất bình đẳng xã hội dẫn đến sự xích lại gần nhau.'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'chapter2',
      number: 'II',
      title: 'Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên CNXH',
      icon: '🤝',
      color: 'blue',
      description: 'Tính tất yếu khách quan của liên minh giai cấp',
      sections: [
        {
          title: 'Tính tất yếu khách quan của liên minh',
          icon: '⚡',
          content: [
            '💡 Liên minh giữa giai cấp công nhân với giai cấp nông dân và các tầng lớp lao động khác là vấn đề mang tính nguyên tắc để đảm bảo thắng lợi của cuộc cách mạng xã hội chủ nghĩa.'
          ],
          subsections: [
            {
              title: '🏛️ Về chính trị',
              items: [
                '• Liên minh nhằm tập hợp lực lượng tiến hành cách mạng XHCN',
                '• Phát huy sức mạnh tổng hợp cải tạo xã hội cũ, xây dựng xã hội mới',
                '• Thực hiện đoàn kết toàn dân',
                '• Giữ vững vai trò lãnh đạo của Đảng Cộng sản và nhà nước XHCN'
              ]
            },
            {
              title: '💰 Về kinh tế',
              items: [
                '• Liên minh hình thành từ yêu cầu khách quan của quá trình đẩy mạnh công nghiệp hóa, hiện đại hóa',
                '• Đòi hỏi sự gắn kết chặt chẽ giữa công nghiệp, nông nghiệp, dịch vụ và khoa học - công nghệ',
                '• Các lĩnh vực phải gắn bó với nhau để cùng thực hiện lợi ích chung',
                '• Nếu tách rời nhau, các ngành này không thể phát triển, và lợi ích của các chủ thể sẽ không được đảm bảo'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'chapter3',
      number: 'III',
      title: 'Cơ cấu xã hội - Giai cấp và Liên minh tại Việt Nam',
      icon: '🇻🇳',
      color: 'yellow',
      description: 'Thực tiễn cơ cấu xã hội và liên minh giai cấp ở Việt Nam',
      sections: [
        {
          title: '1. Cơ cấu xã hội - giai cấp ở Việt Nam',
          icon: '🏗️',
          content: [
            'Sự chuyển đổi sang nền kinh tế thị trường định hướng XHCN đã làm cơ cấu xã hội - giai cấp ở Việt Nam biến đổi mạnh mẽ, đa dạng. Các lực lượng chính bao gồm:'
          ],
          subsections: [
            {
              title: '👷 Giai cấp công nhân',
              items: [
                '• Giữ vai trò quan trọng đặc biệt, là giai cấp lãnh đạo cách mạng thông qua Đảng Cộng sản',
                '• Đang phát triển nhanh về số lượng, chất lượng',
                '• Đa dạng về cơ cấu (công nhân tri thức, công nhân hiện đại)'
              ]
            },
            {
              title: '🌾 Giai cấp nông dân',
              items: [
                '• Có vị trí chiến lược trong sự nghiệp CNH, HĐH nông nghiệp, nông thôn',
                '• Đang có xu hướng giảm dần về số lượng và tỷ lệ',
                '• Một bộ phận chuyển sang lao động công nghiệp hoặc dịch vụ'
              ]
            },
            {
              title: '🎓 Đội ngũ trí thức',
              items: [
                '• Là lực lượng lao động sáng tạo đặc biệt quan trọng trong tiến trình CNH, HĐH và hội nhập quốc tế',
                '• Lực lượng nòng cốt để phát triển nền kinh tế tri thức',
                '• Xây dựng nền văn hóa tiên tiến, đậm đà bản sắc dân tộc'
              ]
            },
            {
              title: '💼 Đội ngũ doanh nhân',
              items: [
                '• Tầng lớp xã hội đặc biệt phát triển nhanh cả về số lượng và quy mô trong thời kỳ đổi mới',
                '• Đóng góp tích cực vào phát triển kinh tế - xã hội',
                '• Giải quyết việc làm và an sinh xã hội'
              ]
            },
            {
              title: '👩 Phụ nữ',
              items: [
                '• Là lực lượng quan trọng và đông đảo trong đội ngũ những người lao động',
                '• Giữ vai trò quan trọng trong mọi lĩnh vực đời sống và trong gia đình',
                '• Cần được tạo điều kiện phát triển tài năng và bình đẳng giới'
              ]
            },
            {
              title: '👨‍🎓 Thanh niên',
              items: [
                '• Là "rường cột của nước nhà", chủ nhân tương lai của đất nước',
                '• Lực lượng xung kích trong xây dựng và bảo vệ Tổ quốc'
              ]
            }
          ]
        },
        {
          title: '2. Nội dung liên minh giai cấp, tầng lớp ở Việt Nam',
          icon: '📋',
          content: [
            '💡 Trong thời kỳ quá độ lên CNXH, việc tổ chức khối liên minh vững mạnh có ý nghĩa đặc biệt quan trọng để thực hiện những nội dung cơ bản của liên minh.'
          ],
          subsections: [
            {
              title: '💰 a. Nội dung kinh tế',
              items: [
                '🔸 Bản chất: Kết hợp đúng đắn lợi ích kinh tế giữa các giai cấp, tầng lớp (Công nhân, nông dân, trí thức, doanh nhân,...)',
                '🔸 Nhiệm vụ:',
                '   • Đẩy mạnh CNH, HĐH gắn với kinh tế tri thức',
                '   • Chuyển dịch cơ cấu kinh tế, phát triển nông nghiệp, nông thôn',
                '   • Xây dựng các hình thức hợp tác, liên kết sản xuất kinh doanh',
                '   • VD: Mô hình 4 nhà: Nhà nước - Nhà nông - Nhà khoa học - Nhà doanh nghiệp',
                '🔸 Ý nghĩa: Tạo cơ sở vật chất - kỹ thuật vững chắc cho CNXH và nâng cao đời sống nhân dân'
              ]
            },
            {
              title: '🏛️ b. Nội dung chính trị',
              items: [
                '🔸 Mục tiêu: Giữ vững lập trường chính trị - tư tưởng của giai cấp công nhân và vai trò lãnh đạo của Đảng Cộng sản',
                '🔸 Nhiệm vụ:',
                '   • Bảo vệ vững chắc chế độ XHCN',
                '   • Giữ vững độc lập dân tộc và định hướng XHCN',
                '   • Xây dựng nền dân chủ XHCN, phát huy quyền làm chủ của nhân dân'
              ]
            },
            {
              title: '🎭 c. Nội dung văn hóa - xã hội',
              items: [
                '🔸 Nhiệm vụ:',
                '   • Xây dựng nền văn hóa tiên tiến, đậm đà bản sắc dân tộc',
                '   • Xóa đói giảm nghèo, thực hiện an sinh xã hội',
                '   • Nâng cao dân trí, phát triển giáo dục - đào tạo y tế',
                '🔸 Ý nghĩa: Tạo sự gắn kết tinh thần, ổn định xã hội để liên minh bền vững'
              ]
            }
          ]
        },
        {
          title: '3. Phương hướng xây dựng và tăng cường liên minh',
          icon: '🎯',
          content: [
            'Các phương hướng cơ bản để xây dựng cơ cấu xã hội - giai cấp và tăng cường liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên CNXH ở Việt Nam:'
          ],
          subsections: [
            {
              title: '📌 Phương hướng 1: Đẩy mạnh CNH, HĐH',
              items: [
                '• Mục tiêu kép: Đẩy mạnh CNH, HĐH đồng thời giải quyết tốt mối quan hệ giữa tăng trưởng kinh tế và tiến bộ, công bằng xã hội',
                '• Cơ sở của biến đổi xã hội: Cần có nền kinh tế phát triển nhanh, bền vững, dựa trên khoa học công nghệ',
                '• Chuyển dịch cơ cấu: Từ nông nghiệp sang công nghiệp và dịch vụ; phát triển kinh tế tri thức',
                '• Chính sách an sinh: Tăng cường kinh tế đi đôi với phát triển văn hóa và bảo vệ môi trường',
                '• Quan tâm đặc biệt đến nhóm xã hội yếu thế',
                '• Tạo cơ hội công bằng cho mọi người dân tiếp cận tư liệu sản xuất, giáo dục, y tế và phúc lợi xã hội'
              ]
            },
            {
              title: '📌 Phương hướng 2: Hệ thống chính sách xã hội tổng thể',
              items: [
                '• Các chính sách liên quan đến cơ cấu xã hội - giai cấp cần được đặt lên vị trí hàng đầu',
                '• Không chỉ liên quan đến từng giai cấp, tầng lớp mà còn giải quyết tốt mối quan hệ nội bộ',
                '• Thu hẹp khoảng cách phát triển và sự phân hóa giàu nghèo',
                '• Đảm bảo công bằng xã hội',
                '• Cần có sự quan tâm thích đáng và phù hợp với mỗi giai cấp, tầng lớp:',
                '   - Đối với giai cấp công nhân',
                '   - Đối với giai cấp nông dân',
                '   - Đối với đội ngũ trí thức',
                '   - Đối với đội ngũ doanh nhân',
                '   - Đối với phụ nữ',
                '   - Đối với thế hệ trẻ'
              ]
            },
            {
              title: '📌 Phương hướng 3: Tạo sự đồng thuận và đoàn kết',
              items: [
                '• Nâng cao nhận thức về tầm quan trọng của khối liên minh',
                '• Xây dựng chủ trương, chính sách đúng đắn, phù hợp với từng đối tượng',
                '• Tạo động lực và sự đồng thuận xã hội',
                '• Tiếp tục giải quyết các mâu thuẫn, sự khác biệt',
                '• Phát huy sự thống nhất trong các giai cấp, tầng lớp',
                '• Tạo sức mạnh tổng hợp thực hiện sự nghiệp đổi mới, CNH, HĐH đất nước',
                '• Phấn đấu vì một nước Việt Nam "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh"'
              ]
            },
            {
              title: '📌 Phương hướng 4: Hoàn thiện thể chế kinh tế thị trường',
              items: [
                '🔸 Mục tiêu cốt lõi:',
                '   • Hoàn thiện thể chế kinh tế thị trường định hướng XHCN',
                '   • Đẩy mạnh phát triển khoa học và công nghệ',
                '🔸 Mục đích: Bảo đảm sự hài hòa giữa các giai cấp, tầng lớp và tạo môi trường thuận lợi để phát huy vai trò của khối liên minh',
                '🔸 Phương hướng thực hiện căn bản:',
                '   • Tiếp tục đẩy mạnh CNH, HĐH đất nước và xây dựng nông thôn mới',
                '   • Phát triển kinh tế tri thức, nâng cao trình độ khoa học - công nghệ trong mọi ngành nghề',
                '   • Tăng cường khối liên minh giữa Giai cấp công nhân - Giai cấp nông dân - Đội ngũ trí thức',
                '🔸 Ứng dụng công nghệ:',
                '   • Tập trung nghiên cứu và ứng dụng thành tựu của Cách mạng công nghiệp lần thứ 4',
                '   • Đặc biệt trong nông nghiệp, công nghiệp và dịch vụ',
                '   • Vai trò quan trọng của đội ngũ trí thức và đội ngũ doanh nhân'
              ]
            },
            {
              title: '📌 Phương hướng 5: Đổi mới hoạt động của Đảng, Nhà nước, MTTQ',
              items: [
                '🔹 Đối với Đảng Cộng sản Việt Nam:',
                '   • Mục tiêu: Nâng cao vai trò lãnh đạo của Đảng',
                '   • Nhiệm vụ: Định hướng việc tăng cường liên minh giai cấp, tầng lớp & mở rộng khối đại đoàn kết để phát triển đất nước bền vững',
                '🔹 Đối với Nhà nước:',
                '   • Mô hình hướng tới: Xây dựng Nhà nước tinh giản, hiệu quả, mang tính phục vụ và kiến tạo phát triển',
                '   • Môi trường pháp lý: Tạo điều kiện công bằng cho mọi thành viên trong xã hội phát triển',
                '   • Chính sách: Mọi chính sách và pháp luật nhằm bảo vệ và phục vụ lợi ích căn bản, chính đáng của các giai cấp và tầng lớp',
                '🔹 Đối với Mặt trận Tổ quốc Việt Nam:',
                '   • Phương thức hoạt động: Tăng cường phối hợp chặt chẽ với các tổ chức thành viên (Công đoàn, Hội nông dân, Hội Khoa học kỹ thuật, đội ngũ doanh nhân,...)',
                '   • Trọng tâm đặc biệt: Chú trọng hình thức liên minh của thế hệ trẻ',
                '   • Vai trò của Thanh niên: Đoàn Thanh niên và Hội Liên hiệp Thanh Niên cần chủ động dẫn dắt các phong trào thi đua yêu nước, phát huy sự sáng tạo của tuổi trẻ trong công cuộc xây dựng và bảo vệ Tổ quốc'
              ]
            }
          ]
        }
      ]
    }
  ];

  const activeChapterData = chapters.find(c => c.id === activeChapter);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("/img/daihoidang.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2
        }}
      ></div>
      
      {/* Overlay */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-br from-black via-black/95 to-black"></div>
      
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
            <a href="/" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRANG CHỦ</a>
            <a href="/noi-dung" className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">NỘI DUNG</a>
            <a href="/trien-lam" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRIỂN LÃM</a>
            <a href="/on-tap" className="text-white hover:text-gold-400 transition-colors tracking-wide">ÔN TẬP</a>
            <a href="/games" className="text-white hover:text-gold-400 transition-colors tracking-wide">GAME</a>
            <button onClick={() => navigate('/tai-lieu')} className="text-white hover:text-gold-400 transition-colors tracking-wide">TÀI LIỆU</button>
          </nav>
          <button 
            onClick={() => navigate('/on-tap')}
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all"
          >
            🎓 Ôn tập ngay
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-12 px-4 z-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block border-2 border-red-500 rounded-full px-8 py-3 mb-8">
              <span className="text-red-400 text-sm font-bold tracking-widest uppercase">📖 Nội dung chi tiết</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-cinzel font-black mb-6">
              <span className="text-white">Cơ Cấu Xã Hội</span>
              <span className="block mt-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                Giai Cấp & Liên Minh
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              Trong thời kỳ quá độ lên Chủ nghĩa Xã hội - Ứng dụng thực tiễn tại Việt Nam
            </p>
          </motion.div>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="relative z-10 px-4 mb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-4">
            {chapters.map((chapter, index) => (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setActiveChapter(chapter.id);
                  setExpandedSection(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  activeChapter === chapter.id
                    ? `bg-gradient-to-br from-${chapter.color}-900/50 to-black border-${chapter.color}-500 shadow-lg shadow-${chapter.color}-500/20`
                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl">{chapter.icon}</div>
                  <div className={`text-3xl font-black ${activeChapter === chapter.id ? `text-${chapter.color}-400` : 'text-gray-500'}`}>
                    {chapter.number}
                  </div>
                </div>
                <h3 className={`font-bold text-lg mb-2 ${activeChapter === chapter.id ? 'text-white' : 'text-gray-200'}`}>
                  {chapter.title}
                </h3>
                <p className={`text-sm ${activeChapter === chapter.id ? 'text-white/80' : 'text-gray-400'}`}>
                  {chapter.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            {activeChapterData && (
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {activeChapterData.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(`${activeChapter}-${sectionIndex}`)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-800/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{section.icon}</span>
                        <h3 className="text-xl font-bold text-white text-left">{section.title}</h3>
                      </div>
                      <span className="text-gold-400 text-2xl">
                        {expandedSection === `${activeChapter}-${sectionIndex}` ? '−' : '+'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {expandedSection === `${activeChapter}-${sectionIndex}` && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 space-y-6">
                            {/* Main content */}
                            {section.content.length > 0 && (
                              <div className="space-y-3">
                                {section.content.map((item, i) => (
                                  <p key={i} className="text-gray-300 leading-relaxed pl-4 border-l-2 border-red-600">
                                    {item}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Subsections */}
                            {section.subsections && section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex} className="bg-gray-800/50 rounded-lg p-5">
                                <h4 className="text-lg font-bold text-gold-400 mb-4">{subsection.title}</h4>
                                <div className="space-y-3">
                                  {subsection.items.map((item, i) => (
                                    <p key={i} className="text-gray-300 leading-relaxed whitespace-pre-line">
                                      {item}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Key Takeaway Section */}
      <div className="relative z-10 px-4 pb-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-900/50 via-yellow-900/30 to-red-900/50 border-2 border-gold-500/50 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-gold-400 mb-4">Mục tiêu chung</h3>
            <p className="text-xl text-white leading-relaxed italic">
              "Các giai cấp, tầng lớp liên kết chặt chẽ dưới sự lãnh đạo của Đảng để thực hiện mục tiêu chung là <span className="text-gold-400 font-bold">"Dân giàu, nước mạnh, dân chủ, công bằng, văn minh"</span>."
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6"></div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4 relative z-10">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/img/VIETNAM_MAP.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cơ cấu XH - Giai cấp</h3>
                <p className="text-xs text-gray-500">VNR202 - CNXHKH</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Nội dung về Cơ cấu xã hội - Giai cấp trong thời kỳ quá độ lên Chủ nghĩa Xã hội.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Điều hướng</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Trang chủ</a></li>
              <li><a href="/noi-dung" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Nội dung chi tiết</a></li>
              <li><a href="/trien-lam" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Triển lãm số</a></li>
              <li><a href="/games" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Trò chơi</a></li>
            </ul>
          </div>

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
