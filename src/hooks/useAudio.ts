import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  volume?: number;
  autoplay?: boolean;
}

export const useAudio = ({ src, loop = false, volume = 0.5, autoplay = false }: AudioPlayerProps) => {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      loop,
      volume,
      autoplay,
      onload: () => setIsLoaded(true),
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        if (!loop) setIsPlaying(false);
      },
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [src, loop, volume, autoplay]);

  const play = () => {
    if (soundRef.current && !isPlaying) {
      soundRef.current.play();
    }
  };

  const pause = () => {
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
    }
  };

  const stop = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
  };

  const setVolume = (newVolume: number) => {
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    play,
    pause,
    stop,
    toggle,
    setVolume,
    isPlaying,
    isLoaded,
  };
};
