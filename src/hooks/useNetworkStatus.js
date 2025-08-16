import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDinoGame, setShowDinoGame] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowDinoGame(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowDinoGame(true);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial network status
    if (!navigator.onLine) {
      setShowDinoGame(true);
    }

    // Test network connectivity periodically
    const testConnection = async () => {
      try {
        // Try to fetch a small resource to test connectivity
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        });
        setIsOnline(true);
        setShowDinoGame(false);
      } catch (error) {
        setIsOnline(false);
        setShowDinoGame(true);
      }
    };

    // Test connection every 30 seconds
    const intervalId = setInterval(testConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  const simulateNetworkError = () => {
    setIsOnline(false);
    setShowDinoGame(true);
  };

  const clearNetworkError = () => {
    setIsOnline(true);
    setShowDinoGame(false);
  };

  return {
    isOnline,
    showDinoGame,
    simulateNetworkError,
    clearNetworkError
  };
};

export default useNetworkStatus;
