
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ArrowDownToLine } from 'lucide-react';

const NetworkIndicator: React.FC = () => {
  const [networkType, setNetworkType] = useState<string>('3G');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Simulate 3G network for demo purposes
  useEffect(() => {
    setNetworkType('3G');
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div className="fixed bottom-2 right-2 flex items-center space-x-1 bg-white bg-opacity-80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium shadow-md">
      {isOnline ? (
        <>
          <Wifi size={12} className="text-green-500" />
          <span className="text-gray-600">{networkType}</span>
        </>
      ) : (
        <>
          <WifiOff size={12} className="text-red-500" />
          <span className="text-gray-600">Offline</span>
        </>
      )}
    </div>
  );
};

export default NetworkIndicator;
