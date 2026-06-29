import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fileToImageUrl } from '@/lib/upload-image';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Check file size (limit to 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'فایل بیش از حد بزرگ است (حداکثر 5MB)',
            }, { status: 400 });
        }

        const url = await fileToImageUrl(file);

        return NextResponse.json({ url });
    } catch {
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
