import { useState, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Ưu tiên các giọng tiếng Việt theo thứ tự
      const vietnameseVoicePriority = [
        // Google voices (tốt nhất)
        availableVoices.find(voice => voice.lang === 'vi-VN' && voice.name.includes('Google')),
        // Microsoft voices
        availableVoices.find(voice => voice.lang === 'vi-VN' && voice.name.includes('Microsoft')),
        // Bất kỳ giọng vi-VN nào
        availableVoices.find(voice => voice.lang === 'vi-VN'),
        // Giọng vi (không có -VN)
        availableVoices.find(voice => voice.lang.startsWith('vi')),
        // Fallback: giọng nữ tiếng Anh (nếu không có tiếng Việt)
        availableVoices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('zira'))
        ),
      ];
      
      // Chọn giọng đầu tiên có sẵn
      const selectedVoice = vietnameseVoicePriority.find(v => v) || availableVoices[0];
      
      setSelectedVoice(selectedVoice);
      
      // Log để debug
      console.log('🎤 Available Vietnamese voices:', 
        availableVoices.filter(v => v.lang.startsWith('vi')).map(v => `${v.name} (${v.lang})`));
      console.log('🎯 Selected voice:', selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : 'None');
    };

    loadVoices();
    
    // Một số trình duyệt cần thời gian để load voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Thử load lại sau 100ms để đảm bảo
    setTimeout(loadVoices, 100);
  }, []);

  const speak = (text: string, rate: number = 0.85, pitch: number = 1) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      // Nếu không có voice được chọn, set lang trực tiếp
      utterance.lang = 'vi-VN';
    }
    
    // Tốc độ chậm hơn một chút cho tiếng Việt (0.85 thay vì 0.9)
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log('🔊 Speaking:', utterance.voice?.name || 'Default voice');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice
  };
};
