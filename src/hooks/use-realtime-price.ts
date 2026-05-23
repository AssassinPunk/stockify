'use client';

import { useState, useEffect } from 'react';
import { realtimeService } from '@/lib/realtime-service';

export function useRealtimePrice(
  symbol: string,
  initialPrice: number,
  initialChange: number,
  initialPercent: number,
) {
  const [currentPrice,   setCurrentPrice]   = useState(initialPrice);
  const [currentChange,  setCurrentChange]  = useState(initialChange);
  const [currentPercent, setCurrentPercent] = useState(initialPercent);
  const [isUpdating,     setIsUpdating]     = useState(false);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((update) => {
      if (update.symbol !== symbol || update.price <= 0) return;
      setIsUpdating(true);
      setCurrentPrice(update.price);
      setCurrentChange(update.change);
      setCurrentPercent(update.percentChange);
      setTimeout(() => setIsUpdating(false), 300);
    });
    return () => { unsubscribe(); };
  }, [symbol]);

  return { price: currentPrice, change: currentChange, percentChange: currentPercent, isUpdating };
}
