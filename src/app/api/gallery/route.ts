import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fileToImageUrl } from '@/lib/upload-image';

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
        return NextResponse.json(images, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load gallery';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const contentType = request.headers.get('content-type') || '';

        // Handle multipart form data (direct file upload)
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File;
            const categoryId = formData.get('categoryId') as string | null;
            const alt = formData.get('alt') as string | null;

            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            // Check file size (5MB limit)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                return NextResponse.json({
                    error: 'فایل بیش از حد بزرگ است (حداکثر 5MB)',
                }, { status: 400 });
            }

            const imageUrl = await fileToImageUrl(file);

            // Save to database
            const image = await prisma.galleryImage.create({
                data: {
                    src: imageUrl,
                    alt: alt || file.name,
                    categoryId: categoryId && categoryId !== 'none' ? categoryId : null
                },
                include: { category: true }
            });

            return NextResponse.json(image);
        }

        // Handle JSON (legacy support)
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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to save gallery image';
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

    await prisma.galleryImage.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
