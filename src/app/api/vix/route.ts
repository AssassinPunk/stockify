import { NextResponse } from 'next/server';
import { fetchIndiaVix } from '@/lib/yahoo-finance';

export async function GET() {
  try {
    // Intraday updates so the gauge moves without refresh.
    const data = await fetchIndiaVix({
      range: '1d',
      interval: '5m',
      policy: { cache: 'no-store' },
    });
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to fetch VIX' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}

