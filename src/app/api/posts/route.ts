import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET all posts (for admin)
export async function GET() {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const posts = await prisma.post.findMany({
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// CREATE new post
export async function POST(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Check if slug already exists
        const existing = await prisma.post.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'A post with this slug already exists' },
                { status: 400 }
            );
        }

        // Store content as JSON string for SQLite
        const post = await prisma.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
                excerpt: data.excerpt || null,
                coverImage: data.coverImage || null,
                status: data.status || 'DRAFT',
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
