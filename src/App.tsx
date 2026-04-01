import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-magenta-500/50 overflow-hidden relative">
      {/* Glitch Overlays */}
      <div className="noise-bg" />
      <div className="scanline" />
      
      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block"
          >
            <span className="text-[8px] font-pixel uppercase tracking-[0.2em] text-magenta-500 block mb-2">
              TERMINAL_ACCESS_GRANTED
            </span>
            <h1 
              className="text-4xl md:text-7xl font-pixel uppercase leading-none glitch-text"
              data-text="NEON_RHYTHM"
            >
              NEON_RHYTHM
            </h1>
          </motion.div>
        </header>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
          {/* Left Side: System Logs */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden xl:flex flex-col gap-4 w-72"
          >
            <div className="p-4 bg-black border-2 border-white/20 text-[10px] font-mono leading-tight">
              <h4 className="text-cyan-400 mb-2 font-pixel text-[8px]">LOG_STREAM</h4>
              <div className="space-y-1 text-white/40">
                <p>{'>'} INITIALIZING_NEURAL_LINK...</p>
                <p>{'>'} BUFFERING_AUDIO_STREAM...</p>
                <p>{'>'} SNAKE_CORE_LOADED</p>
                <p className="text-magenta-500">{'>'} WARNING: GLITCH_DETECTED</p>
                <p>{'>'} SYNCING_RHYTHM_CLOCK...</p>
                <p className="text-cyan-400">{'>'} SYSTEM_STABLE</p>
              </div>
            </div>
          </motion.div>

          {/* Center: Snake Game */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <SnakeGame />
          </motion.div>

          {/* Right Side: Music Player */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <MusicPlayer />
            
            {/* Instructions Card */}
            <div className="p-4 bg-black border-2 border-magenta-500 shadow-[4px_4px_0px_#00ffff]">
              <h4 className="text-[8px] font-pixel uppercase text-white mb-3">COMMANDS</h4>
              <div className="space-y-2 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-cyan-400">ARROWS</span>
                  <span className="text-white/60">MOVE_SNAKE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">SPACE</span>
                  <span className="text-white/60">TOGGLE_PAUSE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-magenta-500">CLICK</span>
                  <span className="text-white/60">INTERACT</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-8 pb-4 text-center">
          <p className="text-[8px] font-pixel text-white/20">
            [C] 2026_CRYPTIC_INDUSTRIES // NO_RIGHTS_RESERVED
          </p>
        </footer>
      </main>
    </div>
  );
}
