import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    const news = await prisma.news.findUnique({
        where: { id },
    });

    if (!news) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
}
