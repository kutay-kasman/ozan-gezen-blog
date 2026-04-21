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
        
        // Data can be a single post object or the "backupData" object containing posts + settings
        const posts = Array.isArray(data) ? data : (data.posts || []);
        const settings = data.settings || [];

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

        // 2. Restore Posts
        const results = {
            created: 0,
            updated: 0,
            errors: 0
        };

        for (const post of posts) {
            try {
                // Determine if we should create or update based on slug (unique)
                await prisma.post.upsert({
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
                        id: post.id, // Keep the same ID if possible
                        title: post.title,
                        slug: post.slug,
                        content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
                        excerpt: post.excerpt || null,
                        coverImage: post.coverImage || null,
                        status: post.status || 'DRAFT',
                    }
                });
                results.updated++; // Upsert doesn't tell us if it created or updated easily without checking first
            } catch (err) {
                console.error(`❌ Error restoring post "${post.title}":`, err);
                results.errors++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Restored ${posts.length} posts and settings.`,
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
