import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// Helper to get authenticated user ID
async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tye_session');

  if (!sessionCookie?.value) {
    return null;
  }

  const [userId] = sessionCookie.value.split(':');
  return userId || null;
}

// GET /api/account/equipment - Get user's equipment
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const equipment = await prisma.equipment.findMany({
      where: { userId },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('[EQUIPMENT GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}

// POST /api/account/equipment - Add new equipment
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Equipment name is required' },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.create({
      data: {
        userId,
        name: name.trim(),
        fromOrder: false,
      },
    });

    console.log(`[EQUIPMENT ADD] User ${userId} added: ${name}`);

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('[EQUIPMENT ADD] Error:', error);
    return NextResponse.json(
      { error: 'Failed to add equipment' },
      { status: 500 }
    );
  }
}

// DELETE /api/account/equipment - Remove equipment
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership and that it's not from an order
    const equipment = await prisma.equipment.findFirst({
      where: { id, userId },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    if (equipment.fromOrder) {
      return NextResponse.json(
        { error: 'Cannot delete equipment from orders' },
        { status: 400 }
      );
    }

    await prisma.equipment.delete({
      where: { id },
    });

    console.log(`[EQUIPMENT DELETE] User ${userId} removed: ${equipment.name}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[EQUIPMENT DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete equipment' },
      { status: 500 }
    );
  }
}
