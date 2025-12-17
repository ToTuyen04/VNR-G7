import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionVoiceAssistant from '../components/history/SectionVoiceAssistant';

interface ImageType {
  src: string;
  caption: string;
}

interface SectionType {
  title: string;
  icon: string;
  content: string[];
  images?: ImageType[];
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'VNR202 - Nội dung';
  }, []);

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
            'Sau thắng lợi của cuộc kháng chiến chống Mỹ, đất nước thống nhất (1975), Việt Nam bước vào thời kỳ quá độ lên chủ nghĩa xã hội trong điều kiện vô cùng khó khăn. Từ năm 1975 đến giữa những năm 1980, mô hình kinh tế kế hoạch hóa tập trung, quan liêu, bao cấp bộc lộ nhiều hạn chế nghiêm trọng:',
            'Nền kinh tế rơi vào khủng hoảng kéo dài, sản xuất trì trệ, hiệu quả thấp',
            'Lạm phát tăng vọt, từ 300% năm 1985 lên tới 774% năm 1986',
            'Đời sống nhân dân gặp nhiều khó khăn, thiếu lương thực, hàng tiêu dùng khan hiếm',
            'Các hiện tượng vi phạm pháp luật, vượt biên trái phép diễn ra phổ biến',
            'Cơ chế quản lý hành chính bao cấp triệt tiêu động lực sản xuất, sáng tạo',
            'Bên cạnh đó, tình hình thế giới có nhiều biến động lớn:',
            'Xu thế đối thoại dần thay thế đối đầu',
            'Cách mạng khoa học – kỹ thuật phát triển mạnh',
            'Liên Xô và các nước xã hội chủ nghĩa tiến hành cải tổ',
            'Xu thế mở cửa, hợp tác và hội nhập kinh tế quốc tế ngày càng rõ nét',
            '👉 Thực tiễn đó đặt ra yêu cầu cấp bách phải đổi mới tư duy, trước hết là tư duy kinh tế, nếu không đất nước sẽ tiếp tục lâm vào khủng hoảng sâu sắc hơn.'
          ],
          images: [
            {
              src: '/img/Người dân xếp hàng mua đồ thời bao cấp. Ảnh tư liệu.png',
              caption: 'Người dân xếp hàng mua đồ thời bao cấp - Minh chứng cho tình trạng khó khăn kinh tế trước Đại hội VI năm 1986'
            }
          ]
        },
        {
          title: 'Thông tin cơ bản về Đại hội',
          icon: '🎯',
          content: [
            'Đại hội VI là dấu mốc quan trọng, mở ra một thời kỳ phát triển mới của cách mạng Việt Nam',
            'Đại hội họp tại Hà Nội (15–18/12/1986), có 1.129 đại biểu (đại diện gần 2 triệu đảng viên) và 32 đoàn đại biểu quốc tế',
            'Đại hội thông qua các văn kiện chính trị quan trọng, khởi xướng đường lối đổi mới toàn diện; bầu Ban Chấp hành Trung ương, Bộ Chính trị và bầu đồng chí Nguyễn Văn Linh làm Tổng Bí thư',
            'Mục đích của Đại hội:',
            '• Nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật',
            '• Chỉ rõ những sai lầm, khuyết điểm của Đảng giai đoạn 1975–1986',
            '• Đề ra đường lối đổi mới nhằm đưa đất nước ra khỏi khủng hoảng kinh tế – xã hội'
          ],
          images: [
            {
              src: '/img/Toàn cảnh Đại hội VI năm 1986  – Đại hội đại biểu toàn quốc lần thứ VI của Đảng Cộng sản Việt Nam diễn ra tại Hà Nội, mở ra thời kỳ đổi mới toàn diện đất nước..jpg',
              caption: 'Toàn cảnh Đại hội VI năm 1986 – Đại hội đại biểu toàn quốc lần thứ VI của Đảng Cộng sản Việt Nam diễn ra tại Hà Nội, mở ra thời kỳ đổi mới toàn diện đất nước'
            },
            {
              src: '/img/Đồng chí Nguyễn Văn Linh được bầu làm Tổng Bí thư Ban Chấp hành Trung ương Đảng khóa VI..jpg',
              caption: 'Đồng chí Nguyễn Văn Linh được bầu làm Tổng Bí thư Ban Chấp hành Trung ương Đảng khóa VI'
            }
          ]
        },
        {
          title: 'Nhìn thẳng vào sự thật và rút ra bài học',
          icon: '💡',
          content: [
            'Đại hội VI đã nghiêm túc kiểm điểm những sai lầm, khuyết điểm nghiêm trọng và kéo dài, đặc biệt trong lĩnh vực kinh tế',
            'Nguyên nhân chủ yếu: Bệnh chủ quan, duy ý chí; Tư duy nóng vội, giản đơn; Những hạn chế trong công tác tư tưởng, tổ chức và cán bộ của Đảng',
            'Bốn bài học kinh nghiệm quý báu:',
            '1. Trong toàn bộ hoạt động của mình, Đảng phải quán triệt tư tưởng "lấy dân làm gốc"',
            '2. Mọi đường lối, chủ trương phải xuất phát từ thực tế, tôn trọng và hành động theo quy luật khách quan',
            '3. Kết hợp chặt chẽ sức mạnh dân tộc với sức mạnh thời đại trong điều kiện mới',
            '4. Thường xuyên chăm lo xây dựng Đảng ngang tầm với nhiệm vụ lãnh đạo',
            '👉 Trên cơ sở những bài học này, Đại hội VI đề ra đường lối đổi mới toàn diện đất nước'
          ]
        },
        {
          title: 'Đổi mới tư duy và cơ chế kinh tế',
          icon: '⚙️',
          content: [
            'Thực hiện nhất quán nền kinh tế nhiều thành phần',
            'Xóa bỏ cơ chế tập trung, quan liêu, bao cấp',
            'Chuyển sang hạch toán kinh doanh, kết hợp kế hoạch với thị trường',
            'Nhiệm vụ trung tâm: Sản xuất đủ tiêu dùng và có tích lũy; Bước đầu hình thành cơ cấu kinh tế hợp lý',
            'Ba chương trình kinh tế lớn: Lương thực – thực phẩm; Hàng tiêu dùng; Hàng xuất khẩu',
            'Năm phương hướng phát triển: Bố trí lại cơ cấu sản xuất; Điều chỉnh cơ cấu đầu tư; Sử dụng và cải tạo đúng đắn các thành phần kinh tế; Đổi mới cơ chế quản lý kinh tế; Mở rộng kinh tế đối ngoại'
          ]
        },
        {
          title: 'Đổi mới xã hội và đối ngoại',
          icon: '🌍',
          content: [
            'Chính sách xã hội bốn nhóm: Kế hoạch hóa dân số, giải quyết việc làm; Công bằng và an toàn xã hội; Giáo dục, văn hóa, y tế; Bảo trợ xã hội',
            'Quốc phòng – an ninh: Tăng cường củng cố quốc phòng, giữ vững độc lập, chủ quyền, toàn vẹn lãnh thổ',
            'Đối ngoại: Tăng cường hợp tác với Liên Xô và các nước Xã hội chủ nghĩa; Bình thường hóa quan hệ với Trung Quốc; Mở rộng hợp tác quốc tế',
            'Đổi mới lãnh đạo của Đảng: Đổi mới tư duy; Đổi mới công tác cán bộ; Phát huy dân chủ "Dân biết, dân bàn, dân làm, dân kiểm tra"'
          ]
        },
        {
          title: 'Quá trình thực hiện (1986-1991)',
          icon: '📋',
          content: [
            'Hội nghị TW 2 (4/1987): Biện pháp cấp bách về phân phối – lưu thông, thực hiện "bốn giảm", cơ chế một giá và thống nhất lương',
            'Quyết định 217-HĐBT (11/1987): Trao quyền tự chủ cho doanh nghiệp nhà nước, chuyển sang hạch toán kinh doanh',
            'Nghị quyết 10 (4/1988): Khoán sản phẩm cuối cùng đến hộ xã viên (Khoán 10), tạo bước đột phá trong nông nghiệp',
            'Luật Đầu tư nước ngoài (1988): Mở rộng thu hút vốn và công nghệ từ bên ngoài',
            'Công nghiệp: Xóa bỏ cơ chế bao cấp, chuyển doanh nghiệp sang kinh doanh Xã hội chủ nghĩa',
          ]
        },
        {
          title: 'Kết quả bước đầu',
          icon: '📈',
          content: [
            'Lạm phát giảm mạnh: từ 774,7% (1986) xuống còn 67,1% (1991)',
            'Cuối 1988: Xóa bỏ chế độ phân phối theo tem phiếu, lưu thông hàng hóa được mở rộng',
            'Lương thực: Năm 1988 còn nhập 450.000 tấn gạo → Năm 1989 đã đủ ăn, có dự trữ và bắt đầu xuất khẩu',
            'Nền kinh tế hàng hóa nhiều thành phần, vận động theo cơ chế thị trường có quản lý của Nhà nước bước đầu hình thành',
            'Kinh tế đối ngoại được mở rộng, phát triển nhanh hơn'
          ],
          images: [
            {
              src: '/img/ketquabuocdau/Sản xuất lúa gạo tăng lên sau các chính sách Đổi mới – từ việc thiếu ăn, phải nhập gạo trước đó chuyển sang đủ ăn và bắt đầu xuất khẩu từ năm 1989..jpg',
              caption: 'Sản xuất lúa gạo tăng lên sau các chính sách Đổi mới – từ việc thiếu ăn, phải nhập gạo trước đó chuyển sang đủ ăn và bắt đầu xuất khẩu từ năm 1989'
            },
            {
              src: '/img/ketquabuocdau/Chỉ sau một năm ban hành Nghị quyết 10, đến năm 1989, sản lượng lúa gạo đạt con số 21,5 triệu tấn, lần đầu tiên Việt Nam xuất khẩu được 1,2 triệu tấn lúa.png',
              caption: 'Chỉ sau một năm ban hành Nghị quyết 10, đến năm 1989, sản lượng lúa gạo đạt con số 21,5 triệu tấn, lần đầu tiên Việt Nam xuất khẩu được 1,2 triệu tấn lúa'
            },
            {
              src: '/img/ketquabuocdau/Sau 1 năm thi công khẩn trương, chợ Đồng Xuân (Hà Nội) đã tiến hành và đi vào hoạt động đầu tháng 2_1991. Chợ cao 3 tầng, với tổng diện tích 28.000m2, là nơi tập trung buôn bán c.jpg',
              caption: 'Sau 1 năm thi công khẩn trương, chợ Đồng Xuân (Hà Nội) đã tiến hành và đi vào hoạt động đầu tháng 2/1991. Chợ cao 3 tầng, với tổng diện tích 28.000m2, là nơi tập trung buôn bán'
            }
          ]
        },
        {
          title: 'Ý nghĩa lịch sử',
          icon: '🏆',
          content: [
            'Mở ra thời kỳ đổi mới toàn diện, đồng bộ và lâu dài của đất nước',
            'Đặt nền móng cho việc hình thành mô hình kinh tế thị trường định hướng xã hội chủ nghĩa',
            'Tạo cơ sở để đất nước từng bước thoát khỏi khủng hoảng kinh tế – xã hội',
            'Khẳng định khả năng tự đổi mới, tự chỉnh đốn của Đảng trước yêu cầu của lịch sử',
            '👉 Đại hội VI được coi là bước ngoặt lịch sử trong sự nghiệp xây dựng và phát triển đất nước Việt Nam thời kỳ sau chiến tranh',
            'Hạn chế: Chưa đề ra được giải pháp thật sự đồng bộ để tháo gỡ triệt để tình trạng rối ren trong phân phối và lưu thông'
          ]
        }
      ],
      images: [] as ImageType[]
    },
    {
      year: '1991',
      date: '6/1991',
      dateLabel: 'Tháng 6/1991',
      title: 'Đại hội VII của Đảng: Hoàn Chỉnh Nhận Thức Lý Luận',
      description: 'Dù có chuyển biến tích cực, đất nước vẫn chưa thoát khỏi khủng hoảng kinh tế – xã hội; bối cảnh quốc tế có biến động phức tạp do Liên Xô và các nước Xã hội chủ nghĩa Đông Âu sụp đổ.',
      sections: [
        {
          title: 'Bối cảnh lịch sử trước Đại hội VII',
          icon: '🌐',
          content: [
            'Sau hơn 4 năm thực hiện đường lối đổi mới do Đại hội VI đề ra, đất nước ta đã có những chuyển biến tích cực bước đầu nhưng vẫn chưa thoát khỏi khủng hoảng kinh tế – xã hội:',
            '• Nền kinh tế hàng hóa nhiều thành phần bước đầu hình thành, lạm phát được kiềm chế',
            '• Sản xuất có tăng nhưng chưa vững chắc, đời sống nhân dân còn nhiều khó khăn',
            '• Nhiều vấn đề xã hội bức xúc chưa được giải quyết triệt để',
            'Trong khi đó, bối cảnh quốc tế có những biến động rất lớn và phức tạp:',
            '• Liên Xô và các nước xã hội chủ nghĩa Đông Âu lâm vào khủng hoảng và sụp đổ hoàn toàn (1991)',
            '• Các thế lực thù địch tăng cường chống phá, thúc đẩy chiến lược "diễn biến hòa bình"',
            '• Việt Nam vừa thoát dần thế bao vây, cấm vận nhưng vẫn đứng trước nhiều thách thức mới',
            '👉 Thực tiễn đó đòi hỏi Đảng phải tổng kết sâu sắc công cuộc đổi mới, kiên định con đường xã hội chủ nghĩa và xác định rõ mô hình, mục tiêu phát triển lâu dài của đất nước.'
          ],
          images: [
            {
              src: '/img/Liên Xô và các nước xã hội chủ nghĩa Đông Âu lâm vào khủng hoảng và sụp đổ hoàn toàn (1991).jpg',
              caption: 'Liên Xô và các nước xã hội chủ nghĩa Đông Âu lâm vào khủng hoảng và sụp đổ hoàn toàn (1991)'
            }
          ]
        },
        {
          title: 'Thông tin cơ bản và nhận định chung của Đại hội VII',
          icon: '🎯',
          content: [
            'Đại hội VII là Đại hội có ý nghĩa rất quan trọng, tiếp tục đường lối đổi mới toàn diện và lần đầu tiên thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội.',
            'Đại hội họp tại Hà Nội (24–27/6/1991), có 1.176 đại biểu, đại diện cho hơn 2 triệu đảng viên trong cả nước. Đại hội thông qua các văn kiện chính trị quan trọng, nổi bật là Cương lĩnh năm 1991 và Chiến lược ổn định và phát triển kinh tế – xã hội đến năm 2000; bầu Ban Chấp hành Trung ương, Bộ Chính trị và bầu đồng chí Đỗ Mười làm Tổng Bí thư.',
            'Đại hội khẳng định công cuộc đổi mới là đúng đắn, nền kinh tế bước đầu chuyển biến tích cực, nền kinh tế hàng hóa nhiều thành phần từng bước hình thành; đồng thời chỉ rõ đổi mới chưa đồng bộ, khó khăn và thách thức vẫn còn rất lớn.'
          ],
          images: [
            {
              src: '/img/thongtincoban/Đại hội đại biểu toàn quốc lần thứ VII Đảng Cộng sản Việt Nam.png',
              caption: 'Đại hội đại biểu toàn quốc lần thứ VII Đảng Cộng sản Việt Nam'
            },
            {
              src: '/img/thongtincoban/Đồng chí Đỗ Mười và các đại biểu dự Đại hội VII của Đảng. Ảnh_ TTXVN. Ảnh_ TTXVN. Ảnh_ TTXVN',
              caption: 'Đồng chí Đỗ Mười và các đại biểu dự Đại hội VII của Đảng'
            },
            {
              src: '/img/thongtincoban/Đồng chí Đỗ Mười - nhà lãnh đạo tài năng, Tổng bí thư kiên định, sáng tạo trong sự nghiệp đổi mới.jpg',
              caption: 'Đồng chí Đỗ Mười - nhà lãnh đạo tài năng, Tổng bí thư kiên định, sáng tạo trong sự nghiệp đổi mới'
            }
          ]
        },
        {
          title: 'Nội dung cơ bản của Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên CNXH (Cương lĩnh 1991)',
          icon: '📜',
          content: [
            'a) Năm bài học lớn của cách mạng Việt Nam',
            '• Nắm vững ngọn cờ độc lập dân tộc gắn liền với chủ nghĩa xã hội',
            '• Cách mạng là sự nghiệp của nhân dân, do nhân dân và vì nhân dân',
            '• Không ngừng củng cố và tăng cường đại đoàn kết toàn dân tộc',
            '• Kết hợp sức mạnh dân tộc với sức mạnh thời đại',
            '• Sự lãnh đạo đúng đắn của Đảng là nhân tố quyết định thắng lợi',
            '',
            'b) Những đặc trưng cơ bản của xã hội xã hội chủ nghĩa ở Việt Nam',
            'Xã hội Xã hội chủ nghĩa mà nhân dân ta xây dựng là xã hội:',
            '• Do nhân dân lao động làm chủ',
            '• Có nền kinh tế phát triển cao dựa trên lực lượng sản xuất hiện đại và chế độ công hữu về tư liệu sản xuất chủ yếu',
            '• Có nền văn hóa tiên tiến, đậm đà bản sắc dân tộc',
            '• Con người được giải phóng, có cuộc sống ấm no, tự do, hạnh phúc',
            '• Các dân tộc trong nước bình đẳng, đoàn kết và giúp đỡ nhau cùng tiến bộ',
            '• Có quan hệ hữu nghị và hợp tác với nhân dân các nước trên thế giới',
            '',
            'c) Bảy phương hướng lớn xây dựng chủ nghĩa xã hội',
            '• Xây dựng Nhà nước xã hội chủ nghĩa của nhân dân, do nhân dân, vì nhân dân',
            '• Phát triển lực lượng sản xuất, công nghiệp hóa – hiện đại hóa gắn với nông nghiệp toàn diện là nhiệm vụ trung tâm',
            '• Thiết lập từng bước quan hệ sản xuất Xã hội chủ nghĩa với nhiều hình thức sở hữu',
            '• Phát triển nền kinh tế hàng hóa nhiều thành phần theo định hướng Xã hội chủ nghĩa',
            '• Tiến hành cách mạng Xã hội chủ nghĩa trên lĩnh vực tư tưởng – văn hóa',
            '• Thực hiện chính sách đại đoàn kết dân tộc',
            '• Kết hợp chặt chẽ xây dựng và bảo vệ Tổ quốc'
          ]
        },
        {
          title: 'Chiến lược ổn định và phát triển kinh tế – xã hội đến năm 2000',
          icon: '🧭',
          content: [
            'Đại hội VII lần đầu tiên thông qua một chiến lược phát triển dài hạn, xác định:',
            '',
            'Mục tiêu tổng quát:',
            '• Đến năm 2000, ra khỏi khủng hoảng kinh tế – xã hội',
            '• GDP tăng gấp khoảng 2 lần so với năm 1990',
            '',
            'Quan điểm chỉ đạo:',
            '• Phát triển nền kinh tế hàng hóa nhiều thành phần',
            '• Vận hành theo cơ chế thị trường có sự quản lý của Nhà nước',
            '• Con người vừa là mục tiêu, vừa là động lực của sự phát triển',
            '• Mọi người được tự do kinh doanh theo pháp luật, quyền sở hữu và thu nhập hợp pháp được bảo hộ'
          ]
        },
        {
          title: 'Thực hiện đường lối Đại hội VII (1991–1995)',
          icon: '⚙️',
          content: [
            'Sau Đại hội VII, Trung ương Đảng đã ban hành nhiều nghị quyết quan trọng nhằm cụ thể hóa Cương lĩnh 1991 và Chiến lược ổn định, phát triển kinh tế – xã hội đến năm 2000.',
            '',
            'Hội nghị Trung ương 5 (6/1993):',
            '• Coi nông nghiệp, nông dân, nông thôn là mặt trận hàng đầu trong phát triển kinh tế – xã hội.',
            'Đề ra ba mục tiêu chủ yếu:',
            '  - Phát triển nông thôn mới',
            '  - Phát huy dân chủ, bảo đảm công bằng xã hội',
            '  - Giữ vững ổn định chính trị – an ninh quốc phòng',
            '',
            'Hội nghị Trung ương 7 (7/1994):',
            '• Đẩy mạnh công nghiệp hóa – hiện đại hóa',
            '• Phát triển công nghệ',
            '• Xây dựng giai cấp công nhân trong giai đoạn mới',
            '',
            '👉 Các chủ trương trên tạo cơ sở quan trọng cho việc đưa đất nước ra khỏi khủng hoảng kinh tế – xã hội và bước vào thời kỳ phát triển mới.'
          ]
        },
        {
          title: 'Kết quả thực hiện đường lối Đại hội VII (1991–1995)',
          icon: '📊',
          content: [
            'Việc thực hiện đường lối Đại hội VII đã đạt được những kết quả quan trọng:',
            '',
            'a) Về kinh tế – xã hội',
            '• Tốc độ tăng trưởng kinh tế đạt khoảng 5,5% – 6,5%/năm trong giai đoạn 1991–1995.',
            '• Lạm phát được kiềm chế mạnh: từ 67,1% (1991) giảm xuống còn 12,7% (1995).',
            '• Đời sống nhân dân được cải thiện; sản xuất phát triển; kinh tế hàng hóa nhiều thành phần tiếp tục được củng cố.',
            '',
            'b) Về đối ngoại',
            '• 11/1991: Bình thường hóa quan hệ với Trung Quốc.',
            '• 28/7/1995: Việt Nam gia nhập ASEAN.',
            '• 11/7/1995: Bình thường hóa quan hệ ngoại giao với Hoa Kỳ.',
            '→ Đối ngoại mở rộng, vị thế quốc tế của Việt Nam được nâng cao rõ rệt.'
          ],
          images: [
            {
              src: '/img/ketquathuchien/Tổng Bí thư Đỗ Mười hội đàm với Tổng Bí thư, Chủ tịch nước CHND Trung Hoa Giang Trạch Dân tại Bắc Kinh ngày 6-11-1991.jpg',
              caption: 'Tổng Bí thư Đỗ Mười hội đàm với Tổng Bí thư, Chủ tịch nước CHND Trung Hoa Giang Trạch Dân tại Bắc Kinh ngày 6/11/1991 - Bình thường hóa quan hệ Việt Nam - Trung Quốc'
            },
            {
              src: '/img/ketquathuchien/Việt Nam trở thành thành viên ASEAN (28_7_1995).jpg',
              caption: 'Việt Nam chính thức trở thành thành viên thứ 7 của ASEAN ngày 28/7/1995'
            },
            {
              src: '/img/ketquathuchien/Tổng thống Mỹ Bill Clinton tuyên bố bình thường hóa quan hệ với Việt Nam ngày 11-7-1995 tại Nhà Trắng.webp',
              caption: 'Tổng thống Mỹ Bill Clinton tuyên bố bình thường hóa quan hệ với Việt Nam ngày 11/7/1995 tại Nhà Trắng'
            }
          ]
        },
        {
          title: 'Ý nghĩa lịch sử và những hạn chế của Đại hội VII',
          icon: '🏆',
          content: [
            'Đại hội VII có ý nghĩa quan trọng đối với tiến trình đổi mới của đất nước:',
            '• Hoàn chỉnh nhận thức lý luận của Đảng về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam trong bối cảnh quốc tế nhiều biến động.',
            '• Tạo nền tảng tư tưởng và chiến lược cho công cuộc đổi mới lâu dài.',
            '• Củng cố niềm tin của nhân dân vào sự lãnh đạo của Đảng, góp phần giữ vững ổn định chính trị – xã hội.',
            '• Giúp đất nước vượt qua thử thách lớn sau sự tan rã của hệ thống xã hội chủ nghĩa thế giới.',
            '',
            'Bên cạnh những kết quả đạt được, Đại hội VII vẫn còn một số hạn chế:',
            '• Một số chủ trương được triển khai chưa kịp thời, chưa thật sự đồng bộ.',
            '• Chuyển dịch cơ cấu kinh tế còn chậm, hiệu quả chưa cao giữa các vùng và các ngành.',
            '• Khoảng cách giàu – nghèo bắt đầu xuất hiện, nảy sinh những vấn đề xã hội mới.',
            '• Hiệu lực và hiệu quả quản lý của Nhà nước trong một số lĩnh vực còn hạn chế.'
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
          title: 'Hoàn cảnh và mục đích',
          icon: '🎯',
          content: [
            'Sau một thời gian thực hiện đường lối Đại hội VII, đất nước đã có chuyển biến tích cực nhưng vẫn đứng trước nhiều khó khăn, thách thức mới. Trước yêu cầu phải giữ vững định hướng xã hội chủ nghĩa và đẩy mạnh đổi mới đồng bộ, Đảng triệu tập Hội nghị đại biểu toàn quốc giữa nhiệm kỳ khóa VII (tháng 1/1994) để đánh giá tình hình và xác định những vấn đề lớn cần tập trung giải quyết.'
          ]
        },
        {
          title: 'Nội dung trọng tâm của Hội nghị',
          icon: '📋',
          content: [
            '⚠️ Chỉ ra 4 nguy cơ, thách thức',
            'Hội nghị cảnh báo 4 nguy cơ lớn đối với sự nghiệp cách mạng:',
            '• Tụt hậu xa hơn về kinh tế',
            '• Chệch hướng xã hội chủ nghĩa',
            '• Tham nhũng và tệ quan liêu',
            '• Âm mưu, thủ đoạn "diễn biến hòa bình" của các thế lực thù địch',
            '',
            '🏛️ Khẳng định chủ trương xây dựng Nhà nước pháp quyền Xã hội chủ nghĩa',
            'Một nội dung rất quan trọng của Hội nghị là lần đầu tiên khẳng định chủ trương xây dựng Nhà nước pháp quyền xã hội chủ nghĩa:',
            '• Nhà nước của nhân dân, do nhân dân, vì nhân dân',
            '• Do Đảng Cộng sản Việt Nam lãnh đạo',
            '• Quyền lực nhà nước là thống nhất, đồng thời có sự phân công và phối hợp giữa các cơ quan trong thực hiện quyền lực nhà nước'
          ]
        },
        {
          title: 'Ý nghĩa',
          icon: '🏆',
          content: [
            'Hội nghị giữa nhiệm kỳ khóa VII (1994) có ý nghĩa quan trọng:',
            '• Giúp toàn Đảng và toàn dân nhận diện đúng các nguy cơ trong quá trình đổi mới để chủ động phòng ngừa và khắc phục.',
            '• Khẳng định bước phát triển trong nhận thức về xây dựng Nhà nước pháp quyền Xã hội chủ nghĩa, tạo cơ sở cho việc tiếp tục hoàn thiện hệ thống chính trị và quản lý xã hội bằng pháp luật.',
            '• Tạo tiền đề để đẩy mạnh đổi mới đồng bộ và giữ vững ổn định chính trị – xã hội trong những năm tiếp theo.'
          ]
        }
      ],
      images: [] as ImageType[]
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
      images: [] as ImageType[]
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
    <div className="min-h-screen bg-black relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("/img/Anh bia .webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.35
        }}
      ></div>
      
      {/* Overlay */}
      <div className="fixed inset-0 z-[1] bg-black/40"></div>
      
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
          <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all">
            🎓 Bắt đầu học
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden z-10">
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
      <div id="history-section" className="relative py-16 px-4 z-10">
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
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          textShadow: [
                            '0 0 20px rgba(239, 68, 68, 0.3)',
                            '0 0 40px rgba(239, 68, 68, 0.6)',
                            '0 0 20px rgba(239, 68, 68, 0.3)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-[120px] lg:text-[180px] font-black leading-none opacity-40 bg-gradient-to-b from-red-500 to-transparent bg-clip-text text-transparent" 
                        style={{ fontWeight: 900, WebkitTextStroke: '2px rgba(239, 68, 68, 0.3)' }}
                      >
                        {event.year}
                      </motion.div>
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

                                    {/* Section Images */}
                                    {(section as SectionType).images && (section as SectionType).images!.length > 0 && (
                                      <div className="relative grid grid-cols-2 gap-4 mt-6">
                                        {(section as SectionType).images!.map((img: ImageType, i: number) => (
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
      <div className="py-20 px-4 bg-gradient-to-b from-black via-blue-950/10 to-black relative z-10">
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
      <div className="py-20 px-4 bg-gradient-to-b from-black via-red-950/10 to-black relative z-10">
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
    </div>
  );
};

export default HistoryPage;
