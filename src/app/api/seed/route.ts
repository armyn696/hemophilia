import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        // Check if admin user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username: 'admin' }
        });

        if (existingUser) {
            // Update password
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await prisma.user.update({
                where: { username: 'admin' },
                data: { password: hashedPassword }
            });
            return NextResponse.json({ message: 'Admin password updated successfully!' });
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                username: 'admin',
                password: hashedPassword,
                name: 'Administrator'
            }
        });

        return NextResponse.json({ message: 'Admin user created successfully!' });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
