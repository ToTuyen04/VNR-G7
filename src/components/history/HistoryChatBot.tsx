import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const HistoryChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý AI về lịch sử Đổi mới Việt Nam. Bạn muốn tìm hiểu về điều gì?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base về Đại hội VI
  const knowledgeBase: Record<string, string> = {
    'đại hội vi': 'Đại hội VI của Đảng được tổ chức vào tháng 12/1986 tại Hà Nội. Đây là mốc son lịch sử đánh dấu sự khởi đầu của công cuộc Đổi mới toàn diện đất nước. Đại hội đã bầu đồng chí Nguyễn Văn Linh làm Tổng Bí thư.',
    'bối cảnh': 'Trước Đại hội VI, Việt Nam rơi vào khủng hoảng kinh tế – xã hội kéo dài. Lạm phát tăng vọt lên tới 774% năm 1986, đời sống nhân dân vô cùng khó khăn, thiếu lương thực.',
    'mục đích': 'Mục đích của Đại hội VI là nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật và chỉ rõ những sai lầm, khuyết điểm nghiêm trọng (nhất là bệnh chủ quan, duy ý chí) trong giai đoạn 1975–1986.',
    'đường lối': 'Đại hội VI đề ra đường lối đổi mới toàn diện đất nước, trong đó đổi mới tư duy, trước hết là tư duy kinh tế là cấp bách. Kinh tế là trung tâm, xây dựng Đảng là then chốt.',
    'nội dung': 'Nội dung cốt lõi: Thực hiện nhất quán nền kinh tế nhiều thành phần, xóa bỏ cơ chế tập trung quan liêu bao cấp, chuyển sang kết hợp kế hoạch với thị trường.',
    'kết quả': 'Kết quả bước đầu rất tích cực: Lạm phát giảm mạnh từ 774,7% (1986) xuống còn 67,1% (1991). Đến năm 1989, Việt Nam bắt đầu xuất khẩu gạo sau khi đã đủ ăn.',
    'lạm phát': 'Trước Đổi mới, lạm phát của Việt Nam lên tới 774% năm 1986. Sau Đại hội VI, lạm phát giảm mạnh xuống còn 67,1% năm 1991 và tiếp tục giảm xuống 12,7% năm 1995.',
    'nguyễn văn linh': 'Đồng chí Nguyễn Văn Linh được bầu làm Tổng Bí thư tại Đại hội VI. Ông được coi là người khởi xướng và lãnh đạo công cuộc Đổi mới, với phong cách cầu thị, dân chủ.',
    'đại hội vii': 'Đại hội VII (1991) tiếp tục công cuộc đổi mới, lần đầu tiên thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên CNXH. Khẳng định 5 bài học lớn của cách mạng.',
    'kinh tế thị trường': 'Đại hội VI chuyển đổi từ cơ chế tập trung quan liêu bao cấp sang nền kinh tế thị trường có định hướng xã hội chủ nghĩa, kết hợp nhiều thành phần kinh tế.',
    'xuất khẩu gạo': 'Từ năm 1989, Việt Nam chuyển từ thiếu lương thực sang xuất khẩu gạo. Đến năm 1996, Việt Nam trở thành nước xuất khẩu gạo lớn thứ 2 thế giới.',
    'ý nghĩa': 'Ý nghĩa lịch sử: Đánh dấu bước chuyển mang tính lịch sử từ cơ chế kế hoạch hóa tập trung sang kinh tế thị trường định hướng Xã hội chủ nghĩa. Cứu đất nước thoát khỏi khủng hoảng.',
    'bài học': 'Bài học kinh nghiệm: Kiên định mục tiêu độc lập dân tộc gắn với CNXH; Quán triệt "lấy dân làm gốc"; Tôn trọng quy luật khách quan; Kết hợp đổi mới kinh tế và chính trị.'
  };

  const quickQuestions = [
    'Đại hội VI diễn ra khi nào?',
    'Bối cảnh trước Đổi mới?',
    'Kết quả của Đổi mới?',
    'Ý nghĩa lịch sử?'
  ];

  const findAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Tìm kiếm trong knowledge base
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(key)) {
        return value;
      }
    }

    // Câu trả lời mặc định
    if (lowerQuestion.includes('xin chào') || lowerQuestion.includes('hello')) {
      return 'Xin chào! Tôi có thể giúp bạn tìm hiểu về Đại hội VI, bối cảnh đổi mới, kết quả và ý nghĩa lịch sử. Bạn muốn biết điều gì?';
    }

    if (lowerQuestion.includes('cảm ơn')) {
      return 'Rất vui được giúp bạn! Nếu còn thắc mắc gì về lịch sử Đổi mới, hãy hỏi tôi nhé!';
    }

    return 'Xin lỗi, tôi chưa có thông tin về câu hỏi này. Bạn có thể hỏi tôi về: Đại hội VI, bối cảnh trước Đổi mới, đường lối đổi mới, kết quả Đổi mới, ý nghĩa lịch sử, hoặc các bài học kinh nghiệm.';
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const answer = findAnswer(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Auto speak answer
      setTimeout(() => speak(answer), 300);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const handleSpeakMessage = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full shadow-2xl flex items-center justify-center z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(220, 38, 38, 0.5)',
            '0 0 40px rgba(220, 38, 38, 0.8)',
            '0 0 20px rgba(220, 38, 38, 0.5)'
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <span className="text-white text-3xl">×</span>
          ) : (
            <span className="text-white text-2xl">🔥</span>
          )}
        </motion.div>

        {/* Badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            AI
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-8 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-red-600/50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Trợ lý Lịch sử AI</h3>
                  <p className="text-red-100 text-xs">Đang hoạt động</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-red-800 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl p-3 ${
                        message.sender === 'user'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.sender === 'bot' && (
                        <button
                          onClick={() => handleSpeakMessage(message.text)}
                          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                        >
                          {isSpeaking ? '🔊' : '🔈'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-gray-800/80 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Câu hỏi gợi ý:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistoryChatBot;
