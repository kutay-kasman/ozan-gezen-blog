import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST() {
    try {
        const session = await getSession();
        session.isLoggedIn = false;
        await session.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
