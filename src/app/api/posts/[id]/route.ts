import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

interface Props {
    params: Promise<{ id: string }>;
}

// GET single post
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Parse content from string to JSON for client
        return NextResponse.json({
            ...post,
            content: post.content,
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// UPDATE post
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Check if slug is taken by another post
        const existing = await prisma.post.findFirst({
            where: {
                slug: data.slug,
                NOT: { id },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'A post with this slug already exists' },
                { status: 400 }
            );
        }

        const post = await prisma.post.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
                excerpt: data.excerpt || null,
                coverImage: data.coverImage || null,
                status: data.status,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE post
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
