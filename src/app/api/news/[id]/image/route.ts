import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeDataUrl, isDataUrl } from '@/lib/news-images';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const news = await prisma.news.findUnique({
        where: { id },
        select: {
            image: true,
            updatedAt: true,
        },
    });

    if (!news) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    if (!isDataUrl(news.image)) {
        return NextResponse.redirect(new URL(news.image, request.url));
    }

    const decoded = decodeDataUrl(news.image);
    if (!decoded) {
        return NextResponse.json({ error: 'Invalid image data' }, { status: 422 });
    }

    const etag = `"${id}-${news.updatedAt.getTime()}-${decoded.body.length}"`;
    if (request.headers.get('if-none-match') === etag) {
        return new Response(null, {
            status: 304,
            headers: {
                ETag: etag,
                'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
            },
        });
    }

    return new Response(decoded.body, {
        headers: {
            'Content-Type': decoded.contentType,
            'Content-Length': String(decoded.body.length),
            ETag: etag,
            'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        },
    });
}
