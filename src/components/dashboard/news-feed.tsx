"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NewsArticle } from "@/lib/types";
import Link from "next/link";
import { Separator } from '@/components/ui/separator';

export default function NewsFeed({ news }: { news: NewsArticle[] }) {
  const [filter, setFilter] = useState('All');

  const seen = new Set<string>();
  const uniqueNews = news.filter(a => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  const filteredNews = filter === 'All' ? uniqueNews : uniqueNews.filter(n => n.category === filter);

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Market News</CardTitle>
            <Tabs defaultValue="All" onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Indices">Indices</TabsTrigger>
                    <TabsTrigger value="Stocks">Stocks</TabsTrigger>
                    <TabsTrigger value="Macro">Macro</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4 pr-4">
            {filteredNews.map((article, index) => (
              <div key={`${article.id}-${index}`}>
                <div className="space-y-1">
                  <Link href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors">
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{article.timestamp}</span>
                  </div>
                </div>
                {index < filteredNews.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
