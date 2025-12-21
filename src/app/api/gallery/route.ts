import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        const where = categoryId ? { categoryId } : {};

        const images = await prisma.galleryImage.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });
        return NextResponse.json(images);
    } catch (error: any) {
        console.error('Error fetching gallery images:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { src, alt, categoryId } = body;

        const image = await prisma.galleryImage.create({
            data: {
                src,
                alt,
                categoryId: categoryId || null
            },
            include: { category: true }
        });

        return NextResponse.json(image);
    } catch (error: any) {
        console.error('Error creating gallery image:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
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

    await prisma.galleryImage.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
