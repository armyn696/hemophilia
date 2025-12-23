import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    console.log('[Upload API] ===== Upload request started =====');

    try {
        // Check session
        console.log('[Upload API] Checking session...');
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('[Upload API] ❌ No session found - Unauthorized');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log('[Upload API] ✓ Session valid for user:', session.user?.name);

        // Parse form data
        console.log('[Upload API] Parsing form data...');
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.log('[Upload API] ❌ No file in request');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log('[Upload API] ✓ File received:', {
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)} KB`
        });

        // Check file size (limit to 5MB for database storage)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            console.log('[Upload API] ❌ File too large:', file.size);
            return NextResponse.json({
                error: 'فایل بیش از حد بزرگ است (حداکثر 5MB)',
                details: 'File size exceeds 5MB limit'
            }, { status: 400 });
        }

        // Convert to buffer and then to base64
        console.log('[Upload API] Converting file to base64...');
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');

        // Create data URL
        const mimeType = file.type || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64}`;

        console.log('[Upload API] ✓ Base64 conversion complete');
        console.log('[Upload API] Data URL length:', dataUrl.length, 'characters');
        console.log('[Upload API] ===== Upload finished successfully =====');

        return NextResponse.json({ url: dataUrl });

    } catch (error: any) {
        console.error('[Upload API] ❌ Unexpected error:', error);
        console.error('[Upload API] Error stack:', error.stack);
        return NextResponse.json({
            error: 'Upload failed',
            details: error.message
        }, { status: 500 });
    }
}
