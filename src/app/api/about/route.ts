import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET about info (public)
export async function GET() {
    try {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: 'main' },
        });

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    id: 'main',
                    aboutPhoto: null,
                    aboutBio: null,
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching about:', error);
        return NextResponse.json(
            { error: 'Failed to fetch about info' },
            { status: 500 }
        );
    }
}

// PUT update about info (admin only)
export async function PUT(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'main' },
            update: {
                aboutPhoto: data.aboutPhoto,
                aboutBio: data.aboutBio,
            },
            create: {
                id: 'main',
                aboutPhoto: data.aboutPhoto,
                aboutBio: data.aboutBio,
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating about:', error);
        return NextResponse.json(
            { error: 'Failed to update about info' },
            { status: 500 }
        );
    }
}
