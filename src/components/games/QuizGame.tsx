import { motion } from 'framer-motion';
import { useState } from 'react';
import { QUESTION_POOL } from '../../data/questions';

interface QuizGameProps {
  onBack: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizGame = ({ onBack }: QuizGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Convert imported questions to the format expected by this component
  const questions: Question[] = QUESTION_POOL.map(q => ({
    question: q.q,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: '' // No explanations in the Excel file
  }));

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-gold-500 rounded-lg p-12 max-w-2xl w-full text-center"
        >
          <h2 className="text-4xl font-cinzel font-bold text-gradient mb-6">
            KẾT QUẢ
          </h2>
          <div className="text-6xl font-bold text-gold-400 mb-6">
            {score}/{questions.length}
          </div>
          <p className="text-2xl text-gray-300 mb-8">
            {percentage >= 80 ? '🎉 Xuất sắc!' : percentage >= 60 ? '👍 Khá tốt!' : '💪 Cố gắng thêm nhé!'}
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={resetQuiz} className="btn-primary">
              Chơi lại
            </button>
            <button onClick={onBack} className="btn-secondary">
              Quay lại
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-gold-400">
              Câu {currentQuestion + 1}/{questions.length}
            </span>
            <span className="text-gold-400">Điểm: {score}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-gold-500/20 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gold-300 mb-8">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedAnswer === null
                    ? 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-gold-500'
                    : selectedAnswer === index
                    ? index === questions[currentQuestion].correctAnswer
                      ? 'bg-green-600 border-2 border-green-400'
                      : 'bg-red-600 border-2 border-red-400'
                    : index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-600 border-2 border-green-400'
                    : 'bg-gray-800 border-2 border-gray-700 opacity-50'
                }`}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gold-900/20 border-l-4 border-gold-500 rounded"
            >
              <p className="text-gold-200">
                <strong>Giải thích:</strong> {questions[currentQuestion].explanation}
              </p>
              <button
                onClick={handleNext}
                className="btn-primary mt-4"
              >
                {currentQuestion < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuizGame;
