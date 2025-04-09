
import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    // Generate 30 confetti pieces with random properties
    const colors = [
      '#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C',
      '#7B64C3', '#7FC8F8', '#4CAF50', '#FF5722', '#9C27B0'
    ];
    
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 30; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100, // random position as percentage of container width
        y: -5 - Math.random() * 10, // start slightly above the viewport
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 10,
        delay: Math.random() * 0.5 // random delay for more natural effect
      });
    }
    
    setPieces(newPieces);
    
    // Clean up after animation completes
    const timer = setTimeout(() => {
      setPieces([]);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((piece) => (
        <div 
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
