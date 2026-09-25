import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// ── GET /api/wishlist ─────────────────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await prisma.wishlist.findMany({
    where: { user_id: session.user.id },
    orderBy: { added_at: 'desc' },
  });

  return NextResponse.json(items);
}

// ── POST /api/wishlist ────────────────────────────────────────────────────────
const addSchema = z.object({
  stock_symbol: z.string().min(1).max(20),
  stock_name:   z.string().min(1).max(200),
  notes:        z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { stock_symbol, stock_name, notes } = parsed.data;

  try {
    const item = await prisma.wishlist.create({
      data: {
        user_id:      session.user.id,
        stock_symbol: stock_symbol.toUpperCase(),
        stock_name,
        notes,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err: unknown) {
    // Unique constraint violation — already in watchlist
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Already in watchlist' }, { status: 409 });
    }
    console.error('[wishlist POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE /api/wishlist ──────────────────────────────────────────────────────
const deleteSchema = z.object({
  stock_symbol: z.string().min(1).max(20),
});

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await prisma.wishlist.deleteMany({
    where: {
      user_id:      session.user.id,
      stock_symbol: parsed.data.stock_symbol.toUpperCase(),
    },
  });

  return NextResponse.json({ success: true });
}
