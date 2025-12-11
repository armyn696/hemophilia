import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const news = await prisma.news.findMany({
        orderBy: { date: 'desc' },
    });
    return NextResponse.json(news);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, image, category, date } = body;

    const news = await prisma.news.create({
        data: {
            title,
            excerpt,
            content,
            image,
            category,
            date: new Date(date),
            author: session.user?.name || 'Admin',
        },
    });

    return NextResponse.json(news);
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

    await prisma.news.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
