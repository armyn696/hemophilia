import { NextResponse } from 'next/server';
import { writeFile, mkdir, access, constants } from 'fs/promises';
import { join } from 'path';
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

        // Convert to buffer
        console.log('[Upload API] Converting file to buffer...');
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log('[Upload API] ✓ Buffer created, size:', buffer.length, 'bytes');

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.' + file.name.split('.').pop();
        console.log('[Upload API] Generated filename:', filename);

        // Get upload directory path
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        console.log('[Upload API] Upload directory:', uploadDir);

        // Ensure uploads directory exists
        try {
            console.log('[Upload API] Creating upload directory if not exists...');
            await mkdir(uploadDir, { recursive: true });
            console.log('[Upload API] ✓ Upload directory ready');
        } catch (mkdirError: any) {
            console.log('[Upload API] Note during mkdir:', mkdirError.message);
        }

        // Check directory permissions
        try {
            await access(uploadDir, constants.W_OK);
            console.log('[Upload API] ✓ Directory is writable');
        } catch (accessError: any) {
            console.log('[Upload API] ❌ Directory not writable:', accessError.message);
            return NextResponse.json({
                error: 'Upload directory not writable',
                details: accessError.message
            }, { status: 500 });
        }

        // Write file
        const filePath = join(uploadDir, filename);
        console.log('[Upload API] Writing file to:', filePath);

        try {
            await writeFile(filePath, buffer);
            console.log('[Upload API] ✓ File written successfully');
        } catch (writeError: any) {
            console.log('[Upload API] ❌ Failed to write file:', writeError.message);
            return NextResponse.json({
                error: 'Failed to write file',
                details: writeError.message
            }, { status: 500 });
        }

        const url = `/uploads/${filename}`;
        console.log('[Upload API] ✓ Upload complete! URL:', url);
        console.log('[Upload API] ===== Upload request finished successfully =====');

        return NextResponse.json({ url });

    } catch (error: any) {
        console.error('[Upload API] ❌ Unexpected error:', error);
        console.error('[Upload API] Error stack:', error.stack);
        return NextResponse.json({
            error: 'Upload failed',
            details: error.message
        }, { status: 500 });
    }
}
