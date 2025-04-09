
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Confetti from './Confetti';
import { toast } from "sonner";

interface ScratchCardProps {
  width?: number;
  height?: number;
  coverColor?: string;
  brushSize?: number;
  revealPercentage?: number;
  prizeAmount?: string;
  isWinner?: boolean;
  onScratchComplete?: () => void;
  className?: string;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  width = 300,
  height = 150,
  coverColor = '#7B64C3',
  brushSize = 30,
  revealPercentage = 50,
  prizeAmount = '$10.000',
  isWinner = true,
  onScratchComplete,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Track the total pixels and scratched pixels to calculate percentage
  const totalPixelsRef = useRef(width * height);
  const scratchedPixelsRef = useRef(0);
  const pixelsCheckedRef = useRef(false);

  // Initialize canvas
  useEffect(() => {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Get context
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill with cover color
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);
    
    // For better touch experience
    setIsTouchDevice('ontouchstart' in window);
    
    setLoading(false);
  }, [width, height, coverColor]);

  // Check percentage of scratched area
  const checkRevealPercentage = useCallback(() => {
    if (pixelsCheckedRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    // Check every 4th value (alpha channel)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 50) { // If pixel is mostly transparent
        transparentPixels++;
      }
    }
    
    scratchedPixelsRef.current = transparentPixels;
    const percentRevealed = (transparentPixels / totalPixelsRef.current) * 100;
    
    if (percentRevealed > revealPercentage) {
      setIsRevealed(true);
      pixelsCheckedRef.current = true;
      
      if (onScratchComplete) {
        onScratchComplete();
      }
      
      if (isWinner) {
        toast.success("Congratulations! You won!", {
          position: "top-center",
        });
      } else {
        toast.error("Sorry! Try again!", {
          position: "top-center",
        });
      }
    }
  }, [width, height, revealPercentage, onScratchComplete, isWinner]);
  
  // Scratch functionality
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalCompositeOperation = 'destination-out'; // Erase mode
    
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2, false);
    ctx.fill();
    
    // Check if we've revealed enough
    if (!isRevealed) {
      checkRevealPercentage();
    }
  }, [brushSize, isRevealed, checkRevealPercentage]);

  // Mouse/Touch handlers
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    scratch(x, y);
  }, [scratch]);
  
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    scratch(x, y);
  }, [isScratching, scratch]);
  
  const handleEnd = useCallback(() => {
    setIsScratching(false);
  }, []);

  return (
    <div 
      className={cn(
        "relative rounded-lg shadow-lg overflow-hidden transition-all",
        isRevealed && "animate-scale-up",
        className
      )}
      style={{ width, height }}
      ref={canvasContainerRef}
    >
      {/* Prize background */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center font-bold text-2xl",
          isWinner ? "bg-gradient-to-br from-yellow-300 to-yellow-500" : "bg-gradient-to-br from-gray-200 to-gray-400"
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          {isWinner ? (
            <>
              <span className="text-sm uppercase font-medium opacity-80">You won</span>
              <span className="text-3xl font-black text-white drop-shadow-md">{prizeAmount}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-white drop-shadow-md">Try again</span>
          )}
        </div>
      </div>
      
      {/* Scratch overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer touch-none"
        onMouseDown={!isTouchDevice ? handleStart : undefined}
        onMouseMove={!isTouchDevice ? handleMove : undefined}
        onMouseUp={!isTouchDevice ? handleEnd : undefined}
        onMouseLeave={!isTouchDevice ? handleEnd : undefined}
        onTouchStart={isTouchDevice ? handleStart : undefined}
        onTouchMove={isTouchDevice ? handleMove : undefined}
        onTouchEnd={isTouchDevice ? handleEnd : undefined}
      />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
        </div>
      )}
      
      {/* Confetti when revealed and winner */}
      {isRevealed && isWinner && <Confetti />}
      
      {/* Instructions overlay */}
      {!isRevealed && !isScratching && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
          <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
            Scratch to reveal
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;
