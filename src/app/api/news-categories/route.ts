import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const categories = await prisma.newsCategory.findMany({
        orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(categories);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, nameFa } = body;

    if (!name || !nameFa) {
        return NextResponse.json({ error: 'Both name and nameFa are required' }, { status: 400 });
    }

    try {
        const category = await prisma.newsCategory.create({
            data: { name, nameFa },
        });
        return NextResponse.json(category);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
        }
        throw error;
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

    await prisma.newsCategory.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
