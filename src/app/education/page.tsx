
'use client';

import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

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
      </main>
      <Disclaimer />
    </div>
  );
}
