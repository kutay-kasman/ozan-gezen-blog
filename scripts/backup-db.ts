import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const BACKUP_DIR = path.join(process.cwd(), 'data-backup');

async function main() {
    console.log('🚀 Starting Database Backup...');

    // 1. Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log(`📁 Created folder: ${BACKUP_DIR}`);
    }

    try {
        // 2. Fetch all data
        console.log('📑 Fetching posts...');
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: { comments: true }
        });

        console.log('⚙️ Fetching site settings...');
        const settings = await prisma.siteSettings.findMany();

        // 3. Save to JSON files
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // We save a "latest" version for easy git tracking, and a timestamped version just in case
        const backupData = {
            posts,
            settings,
            exportedAt: new Date().toISOString()
        };

        const latestFile = path.join(BACKUP_DIR, 'latest-backup.json');
        fs.writeFileSync(latestFile, JSON.stringify(backupData, null, 2));
        console.log(`✅ Backup saved to: ${latestFile}`);

        // Also save individual files for better diff visibility in GitHub
        fs.writeFileSync(path.join(BACKUP_DIR, 'posts.json'), JSON.stringify(posts, null, 2));
        fs.writeFileSync(path.join(BACKUP_DIR, 'settings.json'), JSON.stringify(settings, null, 2));
        
        console.log('✨ Backup completed successfully!');

    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
