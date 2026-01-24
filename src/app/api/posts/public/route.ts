import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET published posts (public endpoint)
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                createdAt: true,
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json([]);
    }
}
