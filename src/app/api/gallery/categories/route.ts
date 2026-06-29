import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const categories = await prisma.galleryCategory.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { images: true }
                }
            }
        });
        return NextResponse.json(categories, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
            },
        });
    } catch (error: unknown) {
        console.error('Error fetching categories:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch categories';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, nameFa } = body;

        console.log('Creating category:', { name, nameFa });

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const category = await prisma.galleryCategory.create({
            data: { name, nameFa },
        });

        return NextResponse.json(category);
    } catch (error: unknown) {
        console.error('Error creating category:', error);
        const message = error instanceof Error ? error.message : 'Failed to create category';
        return NextResponse.json({ error: message }, { status: 500 });
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

    // Move images to "Uncategorized" (set categoryId to null)
    await prisma.galleryImage.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
    });

    await prisma.galleryCategory.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
