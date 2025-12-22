import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, titleEn, order, image } = body;

    const period = await prisma.timelinePeriod.update({
        where: { id },
        data: {
            title,
            titleEn,
            order,
            image
        }
    });

    return NextResponse.json(period);
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const period = await prisma.timelinePeriod.findUnique({
        where: { id },
        include: {
            events: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!period) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(period);
}
