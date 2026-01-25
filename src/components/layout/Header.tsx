'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function Header() {
    const { t } = useLanguage();

    return (
        <header className="border-b border-paper-dark bg-paper-light/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                <Link href="/" className="group">
                    <div className="flex items-center gap-3">
                        {/* Currency Symbol */}
                        <div className="w-10 h-10 rounded-full border-2 border-federal-green flex items-center justify-center bg-paper embossed-inset">
                            <span className="text-federal-green font-serif text-xl font-bold">$</span>
                        </div>
                        <div>
                            <h1 className="font-serif text-xl font-bold text-ink tracking-tight group-hover:text-federal-green transition-colors">
                                {t('siteName')}
                            </h1>
                            <p className="text-xs text-ink-muted tracking-widest uppercase">
                                {t('siteTagline')}
                            </p>
                        </div>
                    </div>
                </Link>

                <nav className="flex items-center gap-4 sm:gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-ink-light hover:text-federal-green transition-colors"
                    >
                        {t('navArticles')}
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-ink-light hover:text-federal-green transition-colors"
                    >
                        {t('navAbout')}
                    </Link>
                    <LanguageSwitcher />
                </nav>
            </div>
        </header>
    );
}
