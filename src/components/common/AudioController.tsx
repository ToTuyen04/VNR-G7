import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { useEffect } from 'react';

interface AudioControllerProps {
  audioSrc?: string;
}

const AudioController = ({ audioSrc = '/audio/background-music.mp3' }: AudioControllerProps) => {
  const { isPlaying, isLoaded, toggle } = useAudio({
    src: audioSrc,
    loop: true,
    volume: 0.3,
    autoplay: false,
  });

  return (
    <motion.button
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-gold-500/50 transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      {isLoaded ? (
        isPlaying ? (
          <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )
      ) : (
        <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
      )}
    </motion.button>
  );
};

export default AudioController;
