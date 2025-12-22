import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const periods = await prisma.timelinePeriod.findMany({
        include: {
            events: {
                orderBy: { order: 'asc' }
            }
        },
        orderBy: { order: 'asc' }
    });
    return NextResponse.json(periods);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, titleEn, order, image } = body;

    const period = await prisma.timelinePeriod.create({
        data: {
            title,
            titleEn,
            order: order || 0,
            image
        }
    });

    return NextResponse.json(period);
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.timelinePeriod.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });
}
