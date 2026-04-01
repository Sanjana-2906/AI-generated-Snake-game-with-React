import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 120;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black border-4 border-magenta-500 shadow-[8px_8px_0px_#00ffff]">
      <div className="flex justify-between w-full items-center px-2 font-pixel text-[10px]">
        <div className="text-cyan-400">
          SCORE:{score.toString().padStart(4, '0')}
        </div>
        <button 
          onClick={() => setIsPaused(p => !p)}
          className="px-2 py-1 bg-cyan-400 text-black hover:bg-magenta-500 hover:text-white transition-colors"
        >
          {isPaused ? '[RESUME]' : '[PAUSE]'}
        </button>
      </div>

      <div 
        className="relative bg-[#050505] border-2 border-white overflow-hidden"
        style={{ width: GRID_SIZE * 16, height: GRID_SIZE * 16 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/20" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute ${
              i === 0 
                ? 'bg-cyan-400 z-10 shadow-[0_0_10px_#00ffff]' 
                : 'bg-magenta-500'
            }`}
            style={{
              width: 14,
              height: 14,
              left: segment.x * 16 + 1,
              top: segment.y * 16 + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-white animate-pulse"
          style={{
            width: 10,
            height: 10,
            left: food.x * 16 + 3,
            top: food.y * 16 + 3,
          }}
        />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 z-20">
            <h2 className="text-magenta-500 text-2xl font-pixel animate-bounce">FATAL ERROR</h2>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-cyan-400 text-black font-pixel text-xs hover:bg-white transition-all shadow-[4px_4px_0px_#ff00ff]"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {isPaused && !isGameOver && score === 0 && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 z-20">
            <button
              onClick={() => setIsPaused(false)}
              className="px-4 py-2 bg-magenta-500 text-white font-pixel text-xs hover:bg-cyan-400 hover:text-black transition-all shadow-[4px_4px_0px_#00ffff]"
            >
              INIT_GAME
            </button>
            <p className="text-white text-[8px] font-pixel">USE ARROWS</p>
          </div>
        )}
      </div>
    </div>
  );
};
