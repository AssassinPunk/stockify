
'use client';

import { useState, useEffect } from 'react';
import { realtimeService } from '@/lib/realtime-service';

/**
 * useRealtimePrice hook subscribes to simulated WebSocket updates for a specific symbol.
 */
export function useRealtimePrice(symbol: string, initialPrice: number, initialChange: number, initialPercent: number) {
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [currentChange, setCurrentChange] = useState(initialChange);
  const [currentPercent, setCurrentPercent] = useState(initialPercent);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((update) => {
      if (update.symbol === symbol) {
        setIsUpdating(true);
        
        // Calculate new values based on the tick
        const tickValue = initialPrice * update.change;
        setCurrentPrice(prev => prev + tickValue);
        setCurrentChange(prev => prev + tickValue);
        
        // Reset the "updating" pulse effect after a short delay
        setTimeout(() => setIsUpdating(false), 300);
      }
    });

    return () => unsubscribe();
  }, [symbol, initialPrice]);

  return { 
    price: currentPrice, 
    change: currentChange, 
    percentChange: (currentChange / (currentPrice - currentChange)) * 100,
    isUpdating 
  };
}
