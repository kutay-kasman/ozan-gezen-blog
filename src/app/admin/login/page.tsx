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
                    <div className="w-16 h-16 rounded-full border-2 border-federal-green flex items-center justify-center mx-auto mb-4 bg-paper-light embossed-inset p-2.5">
                        <svg 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1.2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="w-full h-full text-federal-green"
                        >
                            <circle cx="12" cy="12" r="11" />
                            <circle cx="12" cy="12" r="8" strokeDasharray="14 4 10 6" />
                            <circle cx="12" cy="12" r="5" strokeDasharray="6 3 8 2" strokeDashoffset="2" />
                            <circle cx="12" cy="12" r="2" strokeDasharray="2 1" />
                            <path d="M12 1v2M12 19v2M1 12h2M19 12h2" />
                            <path d="M12 4v1M12 9v1M12 14v1M12 20v1" opacity="0.3" />
                            <path d="M4 12h1M9 12h1M14 12h1M20 12h1" opacity="0.3" />
                            <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
                        </svg>
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
