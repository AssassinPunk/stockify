
'use client';

import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GlowCard } from '@/components/ui/spotlight-card';
import { BookOpen, CandlestickChart, GraduationCap, Target } from 'lucide-react';

const UPCOMING_TOPICS = [
  { title: 'Stock Market Fundamentals', icon: BookOpen, glowColor: 'blue' },
  { title: 'Chart Patterns', icon: CandlestickChart, glowColor: 'purple' },
  { title: 'Trading Strategies', icon: Target, glowColor: 'green' },
] as const;

export default function EducationPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Education Center</h1>
        </div>
        <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Learn the basics of stock market and technical analysis.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <GraduationCap className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground max-w-md">
              Our comprehensive guide to stock market fundamentals, chart patterns, and trading strategies is currently under development. Stay tuned!
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-3">
          {UPCOMING_TOPICS.map(({ title, icon: Icon, glowColor }) => (
            <GlowCard key={title} glowColor={glowColor} customSize className="min-h-40">
              <div className="flex flex-col justify-between gap-6">
                <Icon className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
