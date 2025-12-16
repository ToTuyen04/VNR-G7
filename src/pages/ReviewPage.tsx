import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QUESTION_POOL } from '../data/questions';

const ReviewPage = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Group questions by quiz (10 questions per quiz)
  const quizGroups = [
    { id: 1, name: 'Quiz 1: Đại hội VI (1986)', questions: QUESTION_POOL.slice(0, 10) },
    { id: 2, name: 'Quiz 2: Giai đoạn 1986-1991', questions: QUESTION_POOL.slice(10, 20) },
    { id: 3, name: 'Quiz 3: Đại hội VII (1991)', questions: QUESTION_POOL.slice(20, 30) },
    { id: 4, name: 'Quiz 4: Hội nghị giữa nhiệm kỳ VII (1994)', questions: QUESTION_POOL.slice(30, 40) },
  ];

  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const showAllAnswers = () => {
    const allAnswers: { [key: number]: boolean } = {};
    QUESTION_POOL.forEach((_, idx) => {
      allAnswers[idx] = true;
    });
    setShowAnswers(allAnswers);
  };

  const hideAllAnswers = () => {
    setShowAnswers({});
  };

  // Filter questions based on search term
  const filteredQuestions = searchTerm
    ? QUESTION_POOL.filter((q, _idx) => 
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.opts.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : selectedQuiz !== null
    ? quizGroups[selectedQuiz].questions
    : QUESTION_POOL;

  const getGlobalIndex = (question: typeof QUESTION_POOL[0]) => {
    return QUESTION_POOL.findIndex(q => q.q === question.q);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
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
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/img/VIETNAM_MAP.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">VNR202</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Nhóm 7 - FPT University</p>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRANG CHỦ</Link>
            <Link to="/noi-dung" className="text-white hover:text-gold-400 transition-colors tracking-wide">NỘI DUNG</Link>
            <a href="#" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRIỂN LÃM</a>
            <Link to="/on-tap" className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">ÔN TẬP</Link>
            <Link to="/games" className="text-white hover:text-gold-400 transition-colors tracking-wide">GAME</Link>
            <Link to="/tai-lieu" className="text-white hover:text-gold-400 transition-colors tracking-wide">TÀI LIỆU</Link>
          </nav>
          <Link to="/on-tap" className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all">
            🎓 Bắt đầu học
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4">
            📚 Ôn Tập Kiến Thức
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tổng hợp {QUESTION_POOL.length} câu hỏi về Công cuộc Đổi mới đất nước giai đoạn 1986-1996.
            Học và ôn tập để chuẩn bị tốt nhất cho game!
          </p>
        </motion.div>

        {/* Search and Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm câu hỏi..."
              className="w-full md:w-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedQuiz(null);
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={showAllAnswers}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                👁️ Hiện tất cả đáp án
              </button>
              <button
                onClick={hideAllAnswers}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                🙈 Ẩn tất cả đáp án
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Group Tabs */}
        {!searchTerm && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedQuiz(null)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedQuiz === null
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              📋 Tất cả ({QUESTION_POOL.length} câu)
            </button>
            {quizGroups.map((group, idx) => (
              <button
                key={group.id}
                onClick={() => setSelectedQuiz(idx)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedQuiz === idx
                    ? 'bg-gold-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {group.name} ({group.questions.length} câu)
              </button>
            ))}
          </div>
        )}

        {/* Questions List */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            {filteredQuestions.map((question, idx) => {
              const globalIdx = searchTerm ? getGlobalIndex(question) : (selectedQuiz !== null ? selectedQuiz * 10 + idx : idx);
              const quizNumber = Math.floor(globalIdx / 10) + 1;
              const questionNumber = (globalIdx % 10) + 1;
              
              return (
                <motion.div
                  key={globalIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.02 }}
                  className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 hover:border-gold-500/50 transition-all"
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <span className="bg-gold-500 text-black px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                      Q{quizNumber}.{questionNumber}
                    </span>
                    <h3 className="text-white text-lg font-medium leading-relaxed">
                      {question.q}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {question.opts.map((opt, optIdx) => {
                      const isCorrect = optIdx === question.ans;
                      const showAnswer = showAnswers[globalIdx];
                      
                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border transition-all ${
                            showAnswer && isCorrect
                              ? 'bg-green-600/30 border-green-500 text-green-300'
                              : 'bg-gray-700/50 border-gray-600 text-gray-300'
                          }`}
                        >
                          <span className="font-bold mr-2">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                          {showAnswer && isCorrect && (
                            <span className="ml-2 text-green-400">✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Answer Button */}
                  <button
                    onClick={() => toggleAnswer(globalIdx)}
                    className={`w-full py-2 rounded-lg font-semibold transition-all ${
                      showAnswers[globalIdx]
                        ? 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                        : 'bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 border border-gold-500/50'
                    }`}
                  >
                    {showAnswers[globalIdx] ? '🙈 Ẩn đáp án' : '👁️ Xem đáp án'}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Không tìm thấy câu hỏi phù hợp</p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-gold-400 mb-4 text-center">📊 Thống kê</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-white">{QUESTION_POOL.length}</div>
              <div className="text-gray-400 text-sm">Tổng câu hỏi</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-white">{quizGroups.length}</div>
              <div className="text-gray-400 text-sm">Bộ Quiz</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">
                {Object.values(showAnswers).filter(Boolean).length}
              </div>
              <div className="text-gray-400 text-sm">Đã xem đáp án</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-gold-400">
                {filteredQuestions.length}
              </div>
              <div className="text-gray-400 text-sm">Đang hiển thị</div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-blue-400 mb-4">💡 Mẹo ôn tập hiệu quả</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Đọc kỹ câu hỏi và tự trả lời trước khi xem đáp án</li>
            <li>• Tập trung vào các mốc thời gian và sự kiện quan trọng</li>
            <li>• Học theo từng bộ Quiz để dễ ghi nhớ theo chủ đề</li>
            <li>• Sử dụng chức năng tìm kiếm để ôn tập theo từ khóa cụ thể</li>
            <li>• Sau khi ôn tập, hãy thử sức với <Link to="/games" className="text-gold-400 hover:underline">Game Góp phần xây dựng đất nước</Link>!</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/80 border-t border-gold-500/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 VNR202 - Nhóm 7 - FPT University</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default ReviewPage;
