'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const REFRESH_MS = 10 * 60 * 1000;

// Reloads the server-rendered calendar so a finished event also leaves a page that is already open.
export default function CalendarAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (!document.hidden) router.refresh();
    };
    const id = setInterval(refresh, REFRESH_MS);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [router]);

  return null;
}
