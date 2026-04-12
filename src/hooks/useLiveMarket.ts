
'use client';

import { useState, useEffect } from 'react';
import { Quote } from '@/types/market';

/**
 * Custom hook to poll the market quotes API every 3 seconds.
 */
export function useLiveMarket() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/market/quotes', { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setQuotes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching live market quotes:', error);
      }
    };

    // Initial fetch
    fetchQuotes();

    // Set up polling interval (3000ms)
    const interval = setInterval(fetchQuotes, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return { quotes, loading };
}
