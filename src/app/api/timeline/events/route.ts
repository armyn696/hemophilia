import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const events = await prisma.timelineEvent.findMany({
        include: {
            period: true
        },
        orderBy: { order: 'asc' }
    });
    return NextResponse.json(events);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, titleEn, description, descriptionEn, date, dateEn, image, periodId, order } = body;

    const event = await prisma.timelineEvent.create({
        data: {
            title,
            titleEn,
            description,
            descriptionEn,
            date,
            dateEn,
            image,
            periodId,
            order: order || 0
        }
    });

    return NextResponse.json(event);
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

    await prisma.timelineEvent.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });
}
