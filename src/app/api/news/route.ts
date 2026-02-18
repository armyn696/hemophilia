import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            orderBy: { date: 'desc' },
            include: { category: true },
        });
        return NextResponse.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
    } catch (error) {
        console.error('Error creating news:', error);
        return NextResponse.json(
            { error: 'Failed to create news. Please try again.' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
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
    } catch (error) {
        console.error('Error deleting news:', error);
        return NextResponse.json(
            { error: 'Failed to delete news. Please try again.' },
            { status: 500 }
        );
    }
}
