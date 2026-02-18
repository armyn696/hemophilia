import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const news = await prisma.news.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!news) {
            return NextResponse.json({ error: 'News not found' }, { status: 404 });
        }

        return NextResponse.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { title, titleEn, excerpt, excerptEn, content, contentEn, image, categoryId, date, dateFa } = body;

        // Validate required fields
        if (!image) {
            return NextResponse.json(
                { error: 'Cover image is required' },
                { status: 400 }
            );
        }

        if (!title || !excerpt || !content) {
            return NextResponse.json(
                { error: 'Title, excerpt, and content are required' },
                { status: 400 }
            );
        }

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
    } catch (error) {
        console.error('Error updating news:', error);
        return NextResponse.json(
            { error: 'Failed to update news. Please try again.' },
            { status: 500 }
        );
    }
}
