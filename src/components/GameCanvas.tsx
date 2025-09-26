import React, { useEffect, useRef } from 'react';
import { WitchingHourGame } from '../phaser/Game';

interface GameCanvasProps {
  className?: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ className = '' }) => {
  const gameRef = useRef<WitchingHourGame | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the game when component mounts
    if (containerRef.current && !gameRef.current) {
      const containerId = 'phaser-game-container';
      containerRef.current.id = containerId;

      gameRef.current = new WitchingHourGame(containerId);
    }

    // Cleanup function to destroy the game when component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy();
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`game-canvas-wrapper ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <div
        ref={containerRef}
        className="phaser-game-container"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#1a1a2e',
          // borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default GameCanvas;
