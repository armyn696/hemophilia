import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

        if (!fs.existsSync(uploadsDir)) {
            return NextResponse.json({ error: 'Uploads directory not found' }, { status: 404 });
        }

        const files = fs.readdirSync(uploadsDir);
        const imageFiles = files.filter(f =>
            f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp')
        );

        // Get existing images in gallery
        const existingImages = await prisma.galleryImage.findMany({
            select: { src: true }
        });
        const existingSrcs = new Set(existingImages.map(img => img.src));

        // Get or create a default category
        let defaultCategory = await prisma.galleryCategory.findFirst({
            where: { name: 'restored' }
        });

        if (!defaultCategory) {
            defaultCategory = await prisma.galleryCategory.create({
                data: { name: 'restored', nameFa: 'بازیابی شده' }
            });
        }

        // Add images that don't exist in gallery
        let addedCount = 0;
        for (const file of imageFiles) {
            const src = `/uploads/${file}`;
            if (!existingSrcs.has(src)) {
                await prisma.galleryImage.create({
                    data: {
                        src,
                        alt: file.split('-')[0] || file,
                        categoryId: defaultCategory.id
                    }
                });
                addedCount++;
            }
        }

        return NextResponse.json({
            message: 'Gallery images restored',
            totalFilesFound: imageFiles.length,
            newImagesAdded: addedCount,
            alreadyExisted: imageFiles.length - addedCount
        });
    } catch (error: any) {
        console.error('Restore error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
