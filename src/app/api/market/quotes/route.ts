
import { NextResponse } from 'next/server';
import { getQuotes } from '@/lib/marketData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quotes = await getQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Failed to fetch market quotes:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
