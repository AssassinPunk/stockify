'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';

export default function NewsError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const [retrying, startRetry] = useTransition();
  // reset() alone redraws the failed result it already has; the refresh asks the server again.
  const retry = () => startRetry(() => { router.refresh(); reset(); });

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Global News Hub</h1>
        <section className="rounded-2xl bg-card p-5" aria-label="News">
          <h2 className="text-base font-semibold">News feeds</h2>
          <p role="alert" className="mt-2 text-sm text-muted-foreground">
            Couldn&apos;t load the news feeds.{' '}
            <button type="button" onClick={retry} disabled={retrying} className="font-medium text-foreground underline underline-offset-2">{retrying ? 'Trying again…' : 'Try again'}</button>
          </p>
        </section>
      </main>
      <Disclaimer />
    </div>
  );
}
