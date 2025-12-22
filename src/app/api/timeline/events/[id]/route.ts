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
    const { title, titleEn, description, descriptionEn, date, dateEn, image, periodId, order } = body;

    const event = await prisma.timelineEvent.update({
        where: { id },
        data: {
            title,
            titleEn,
            description,
            descriptionEn,
            date,
            dateEn,
            image,
            periodId,
            order
        }
    });

    return NextResponse.json(event);
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const event = await prisma.timelineEvent.findUnique({
        where: { id },
        include: {
            period: true
        }
    });

    if (!event) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(event);
}
