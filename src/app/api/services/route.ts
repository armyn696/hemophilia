import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { mergeServiceSections, serviceSections } from '@/lib/services';

interface ServiceSectionInput {
    key: string;
    title?: string;
    titleEn?: string;
    summary?: string;
    summaryEn?: string;
    content?: string;
    contentEn?: string;
    order?: number;
}

async function ensureServiceTable() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ServiceSection" (
            "id" TEXT NOT NULL,
            "key" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "titleEn" TEXT,
            "summary" TEXT NOT NULL,
            "summaryEn" TEXT,
            "content" TEXT NOT NULL,
            "contentEn" TEXT,
            "order" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "ServiceSection_pkey" PRIMARY KEY ("id")
        );
    `);
    await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "ServiceSection_key_key" ON "ServiceSection"("key");
    `);
}

export async function GET() {
    try {
        const sections = await prisma.serviceSection.findMany({
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(mergeServiceSections(sections), {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
            },
        });
    } catch {
        return NextResponse.json(serviceSections, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const sections: ServiceSectionInput[] = Array.isArray(body.sections) ? body.sections : [];
    const allowedKeys = new Set<string>(serviceSections.map((section) => section.key));

    await ensureServiceTable();

    const saved = await Promise.all(
        sections
            .filter((section) => allowedKeys.has(section.key))
            .map((section, index) =>
                prisma.serviceSection.upsert({
                    where: { key: section.key },
                    create: {
                        key: section.key,
                        title: section.title || '',
                        titleEn: section.titleEn || null,
                        summary: section.summary || '',
                        summaryEn: section.summaryEn || null,
                        content: section.content || '',
                        contentEn: section.contentEn || null,
                        order: section.order ?? index,
                    },
                    update: {
                        title: section.title || '',
                        titleEn: section.titleEn || null,
                        summary: section.summary || '',
                        summaryEn: section.summaryEn || null,
                        content: section.content || '',
                        contentEn: section.contentEn || null,
                        order: section.order ?? index,
                    },
                })
            )
    );

    return NextResponse.json(mergeServiceSections(saved));
}
