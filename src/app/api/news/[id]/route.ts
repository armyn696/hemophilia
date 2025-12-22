import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const news = await prisma.news.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!news) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
}

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
    const { title, titleEn, excerpt, excerptEn, content, contentEn, image, categoryId, date, dateFa } = body;

    const news = await prisma.news.update({
        where: { id },
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
        },
    });

    return NextResponse.json(news);
}
