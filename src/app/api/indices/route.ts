import { NextResponse } from 'next/server';
import { fetchLiveIndianIndices } from '@/lib/yahoo-finance';

export async function GET() {
  try {
    const data = await fetchLiveIndianIndices({ cache: 'no-store' });
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to fetch indices' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}

