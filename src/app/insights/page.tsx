
'use client';

import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Market Insights</h1>
        </div>
        <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
          <CardHeader>
            <CardTitle>AI Market Analysis</CardTitle>
            <CardDescription>Deep dives into market trends powered by GenAI.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Lightbulb className="h-12 w-12 text-primary animate-bounce" />
            </div>
            <p className="text-muted-foreground max-w-md">
              This section will feature AI-generated reports on sector performance, volatility alerts, and investment opportunities.
            </p>
          </CardContent>
        </Card>
      </main>
      <Disclaimer />
    </div>
  );
}
