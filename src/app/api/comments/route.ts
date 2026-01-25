import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/comments?postId=xxx - Get all comments for a post
export async function GET(request: NextRequest) {
    const postId = request.nextUrl.searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, content, postId } = body;

        if (!name || !content || !postId) {
            return NextResponse.json(
                { error: 'name, content, and postId are required' },
                { status: 400 }
            );
        }

        // Verify post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const comment = await prisma.comment.create({
            data: {
                name: name.trim(),
                content: content.trim(),
                postId,
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
