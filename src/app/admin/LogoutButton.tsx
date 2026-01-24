'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export function LogoutButton() {
    const router = useRouter();
    const { t } = useLanguage();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-ink-muted hover:text-red-600 transition-colors"
        >
            {t('adminSignOut')}
        </button>
    );
}
