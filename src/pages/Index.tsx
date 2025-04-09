
import React, { useState, useEffect } from 'react';
import ScratchGameCard from '@/components/ScratchGameCard';
import NetworkIndicator from '@/components/NetworkIndicator';
import { Toaster } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading on 3G connection
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNewGame = () => {
    // This will be handled by the ScratchGameCard component
    console.log('New game requested');
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4 relative overflow-hidden">
      {/* Network status indicator */}
      <NetworkIndicator />
      
      {/* Loading screen */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-gray-600 text-sm">Loading game on 3G network...</p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <ScratchGameCard onNewGame={handleNewGame} />
          
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Optimized for 3G connections</p>
            <p className="mt-1">Scratch the card to reveal your prize!</p>
          </div>
        </div>
      )}
      
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Index;
