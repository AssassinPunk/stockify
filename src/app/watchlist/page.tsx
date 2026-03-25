
'use client';

import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function WatchlistPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Your Watchlist</h1>
        </div>
        <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>We are building a powerful watchlist feature for you.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Star className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground max-w-md">
              In the future, you will be able to save your favorite stocks here and track them in real-time across devices.
            </p>
          </CardContent>
        </Card>
      </main>
      <Disclaimer />
    </div>
  );
}
