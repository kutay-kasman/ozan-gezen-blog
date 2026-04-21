import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        
        // Data can be:
        // 1. A single post object (from Single Download)
        // 2. An array of post objects (from All Download)
        // 3. A "backupData" object containing posts + settings (from Automate Backup)
        
        let posts: any[] = [];
        let settings: any[] = [];

        if (Array.isArray(data)) {
            // Case 2: Array of posts
            posts = data;
        } else if (data.posts && Array.isArray(data.posts)) {
            // Case 3: Complete backup object
            posts = data.posts;
            settings = data.settings || [];
        } else if (data.slug) {
            // Case 1: Single post object
            posts = [data];
        }

        console.log(`🏠 Restoring ${posts.length} posts and ${settings.length} site settings...`);

        // 1. Restore Site Settings
        if (Array.isArray(settings)) {
            for (const setting of settings) {
                await prisma.siteSettings.upsert({
                    where: { id: setting.id || 'main' },
                    update: {
                        aboutBio: setting.aboutBio,
                        aboutPhoto: setting.aboutPhoto,
                    },
                    create: {
                        id: setting.id || 'main',
                        aboutBio: setting.aboutBio,
                        aboutPhoto: setting.aboutPhoto,
                    },
                });
            }
        }

        // 2. Restore Posts and their Comments
        const results = {
            processed: 0,
            commentsRestored: 0,
            errors: 0
        };

        for (const post of posts) {
            try {
                // Determine if we should create or update based on slug (unique)
                const upsertedPost = await prisma.post.upsert({
                    where: { slug: post.slug },
                    update: {
                        title: post.title,
                        content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
                        excerpt: post.excerpt,
                        coverImage: post.coverImage,
                        status: post.status,
                        updatedAt: new Date(),
                    },
                    create: {
                        id: post.id || undefined, // Use existing ID if provided
                        title: post.title,
                        slug: post.slug,
                        content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
                        excerpt: post.excerpt || null,
                        coverImage: post.coverImage || null,
                        status: post.status || 'DRAFT',
                    }
                });

                // 3. Restore Comments if present in the data
                // We handle comments by deleting existing ones for this post and re-inserting
                // to match the state of the backup.
                if (Array.isArray(post.comments)) {
                    // Delete existing comments for this specific post
                    await prisma.comment.deleteMany({
                        where: { postId: upsertedPost.id }
                    });

                    // Create new comments from backup
                    if (post.comments.length > 0) {
                        await prisma.comment.createMany({
                            data: post.comments.map((comment: any) => ({
                                id: comment.id || undefined, // Use existing ID if provided
                                name: comment.name,
                                content: comment.content,
                                postId: upsertedPost.id,
                                createdAt: comment.createdAt ? new Date(comment.createdAt) : undefined
                            }))
                        });
                        results.commentsRestored += post.comments.length;
                    }
                }

                results.processed++;
            } catch (err) {
                console.error(`❌ Error restoring post "${post.title || post.slug}":`, err);
                results.errors++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Restored ${results.processed} posts and ${results.commentsRestored} comments.`,
            results 
        });

    } catch (error) {
        console.error('Error during restoration:', error);
        return NextResponse.json(
            { error: 'Failed to restore data' },
            { status: 500 }
        );
    }
}
