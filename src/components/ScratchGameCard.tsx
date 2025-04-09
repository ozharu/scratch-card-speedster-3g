
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ScratchCard from './ScratchCard';
import { toast } from "sonner";
import { Sparkles } from 'lucide-react';

interface ScratchGameCardProps {
  onNewGame?: () => void;
}

const ScratchGameCard: React.FC<ScratchGameCardProps> = ({ onNewGame }) => {
  const [gameComplete, setGameComplete] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Generate random prize amount
  const generatePrize = () => {
    const prizes = ['$5', '$10', '$20', '$50', '$100', '$500', '$1000', '$5000', '$10000'];
    return prizes[Math.floor(Math.random() * prizes.length)];
  };
  
  // Randomly determine if the current card is a winner (20% chance)
  const [prizeAmount] = useState(generatePrize());
  
  const handleScratchComplete = () => {
    setGameComplete(true);
  };
  
  const handleNewGame = () => {
    setLoading(true);
    
    // Simulate network delay for 3G connection
    setTimeout(() => {
      const newIsWinner = Math.random() < 0.2; // 20% chance to win
      setIsWinner(newIsWinner);
      setGameComplete(false);
      setLoading(false);
      
      if (onNewGame) {
        onNewGame();
      }
      
      toast.info("New game card ready!", {
        description: "Scratch to reveal your prize",
        position: "top-center",
      });
    }, 800);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl animate-fade-in">
      <CardHeader className="pb-3 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold">
          <Sparkles size={20} className="animate-pulse text-yellow-200" />
          Scratch & Win
          <Sparkles size={20} className="animate-pulse text-yellow-200" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex items-center justify-center p-6 relative">
        <ScratchCard
          width={280}
          height={140}
          brushSize={25}
          isWinner={isWinner}
          prizeAmount={prizeAmount}
          onScratchComplete={handleScratchComplete}
          className="mx-auto"
        />
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="text-sm text-gray-600">Loading new card...</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center pb-6">
        <Button 
          onClick={handleNewGame}
          disabled={loading || !gameComplete}
          className={`w-40 ${gameComplete ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700' : 'bg-gray-300'}`}
        >
          {loading ? 'Loading...' : 'New Card'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScratchGameCard;
