'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function LoginPage() {
    const { t } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(t('loginError'));
            }
        } catch {
            setError(t('loginError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            {/* Language Switcher */}
            <div className="absolute top-6 right-6">
                <LanguageSwitcher />
            </div>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full border-2 border-federal-green flex items-center justify-center mx-auto mb-4 bg-paper-light embossed-inset">
                        <span className="text-federal-green font-serif text-3xl font-bold">$</span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-ink">{t('loginTitle')}</h1>
                    <p className="text-ink-muted mt-2">{t('loginSubtitle')}</p>
                </div>

                {/* Form */}
                <div className="paper-card p-8 rounded-lg border-engraving">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-ink mb-2">
                                {t('loginUsername')}
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-md"
                                placeholder={t('loginUsernamePlaceholder')}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
                                {t('loginPassword')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-md"
                                placeholder={t('loginPasswordPlaceholder')}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t('loginLoading') : t('loginButton')}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-ink-muted text-sm mt-6">
                    {t('loginProtected')}
                </p>
            </div>
        </div>
    );
}
