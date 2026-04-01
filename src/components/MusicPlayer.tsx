import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Terminal } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON_DREAMS.SYS',
    artist: 'SYNTH_AI_01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400'
  },
  {
    id: '2',
    title: 'CYBER_PULSE.EXE',
    artist: 'DIGITAL_ECHO',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber2/400/400'
  },
  {
    id: '3',
    title: 'MIDNIGHT_GRID.DAT',
    artist: 'RETRO_FUTURE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/grid3/400/400'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md p-4 bg-black border-4 border-cyan-400 shadow-[8px_8px_0px_#ff00ff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <motion.div 
            key={currentTrack.id}
            className="relative w-16 h-16 border-2 border-white grayscale hover:grayscale-0 transition-all"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
                <div className="flex gap-0.5 items-end h-4">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 6, 10, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-white"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 overflow-hidden font-mono">
            <h3 className="text-cyan-400 font-bold text-sm truncate uppercase tracking-tighter">
              {'> '}{currentTrack.title}
            </h3>
            <p className="text-magenta-500 text-[10px] font-bold">
              {currentTrack.artist}
            </p>
          </div>
          
          <div className="text-white">
            <Terminal size={16} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-2 w-full bg-white/20 border border-white/40">
            <motion.div 
              className="h-full bg-magenta-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-white font-pixel">
            <span>BITRATE: 320KBPS</span>
            <span>STEREO_MODE</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={handlePrev}
            className="text-white hover:text-cyan-400 transition-colors"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-cyan-400 text-black hover:bg-magenta-500 hover:text-white transition-all shadow-[4px_4px_0px_#ffffff]"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white hover:text-cyan-400 transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
