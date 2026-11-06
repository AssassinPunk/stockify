import type { ReactNode } from 'react';
import { GlowCard } from '@/components/ui/spotlight-card';
import { cn } from '@/lib/utils';

// Wraps an existing dashboard card in the spotlight border. The wrapped card
// supplies the padding and background, so its own border and hover lift are removed.
export default function GlowPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <GlowCard
      customSize
      className={cn('grid-cols-1 !gap-0 !p-0 [&>*]:!translate-y-0 [&>*]:border-0 [&>*]:shadow-none', className)}
    >
      {children}
    </GlowCard>
  );
}
