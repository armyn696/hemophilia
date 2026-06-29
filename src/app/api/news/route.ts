import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const news = await prisma.news.findMany({
        orderBy: { date: 'desc' },
        select: {
            id: true,
            title: true,
            titleEn: true,
            excerpt: true,
            excerptEn: true,
            content: true,
            contentEn: true,
            date: true,
            dateFa: true,
            categoryId: true,
            category: true,
            author: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const payload = news.map((item) => ({
        ...item,
        image: `/api/news/${item.id}/image`,
    }));

    return NextResponse.json(payload, {
        headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
    });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, titleEn, excerpt, excerptEn, content, contentEn, image, categoryId, date, dateFa } = body;

    const news = await prisma.news.create({
        data: {
            title,
            titleEn,
            excerpt,
            excerptEn,
            content,
            contentEn,
            image,
            categoryId: categoryId || null,
            date: new Date(date),
            dateFa,
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
