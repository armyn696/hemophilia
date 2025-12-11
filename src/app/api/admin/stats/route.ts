import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [newsCount, galleryCount] = await Promise.all([
            prisma.news.count(),
            prisma.galleryImage.count(),
        ]);

        return NextResponse.json({ newsCount, galleryCount });
    } catch (error) {
        return NextResponse.json({ newsCount: 0, galleryCount: 0 });
    }
}
