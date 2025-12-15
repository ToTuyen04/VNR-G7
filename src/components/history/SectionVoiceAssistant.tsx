import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface SectionVoiceAssistantProps {
  content: string;
  title: string;
  position?: 'left' | 'right';
}

const SectionVoiceAssistant = ({ content, title, position = 'right' }: SectionVoiceAssistantProps) => {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      const fullText = `${title}. ${content}`;
      speak(fullText, 0.9);
    }
  };

  return (
    <div className={`absolute ${position === 'right' ? '-right-20' : '-left-20'} top-1/2 -translate-y-1/2 hidden lg:block`}>
      <motion.div
        className="relative"
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Character Button */}
        <button
          onClick={handleSpeak}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-xl flex items-center justify-center group overflow-hidden border-4 border-green-400"
        >
          {/* Character Image/Icon */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <img src="/img/bodoi.webp" alt="Bộ Đội" className="w-12 h-12 object-contain" />
          </div>

          {/* Speaking Animation */}
          {isSpeaking && (
            <>
              <motion.div
                className="absolute inset-0 bg-green-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white">
                <span className="absolute inset-0 flex items-center justify-center text-[8px]">🔊</span>
              </div>
            </>
          )}

          {/* Hover Effect */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />
        </button>

        {/* Voice Waves Animation when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-green-400"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{
                  scale: [1, 2, 3],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isSpeaking && (
            <motion.div
              initial={{ opacity: 0, x: position === 'right' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: position === 'right' ? 10 : -10 }}
              className={`absolute top-1/2 -translate-y-1/2 ${
                position === 'right' ? 'right-20' : 'left-20'
              } bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl border border-green-500/50`}
            >
              <div className="flex items-center gap-2">
                <span>🎤</span>
                <span className="font-semibold">Nghe nội dung</span>
              </div>
              {/* Arrow */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${
                  position === 'right' ? '-left-2' : '-right-2'
                } w-0 h-0 border-t-8 border-b-8 border-transparent ${
                  position === 'right' ? 'border-r-8 border-r-gray-900' : 'border-l-8 border-l-gray-900'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speaking Tooltip */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap shadow-xl"
            >
              <div className="flex items-center gap-1">
                <span>🔊</span>
                <span className="font-semibold">Đang đọc...</span>
              </div>
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Stars */}
        {!isSpeaking && (
          <>
            <motion.div
              className="absolute -top-2 -right-2 text-yellow-400 text-xs"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ⭐
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-2 text-yellow-400 text-xs"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            >
              ✨
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SectionVoiceAssistant;
