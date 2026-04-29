'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';


export function Header() {
    const { t } = useLanguage();

    return (
        <header className="border-b border-paper-dark bg-paper-light/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                <Link href="/" className="group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-federal-green flex items-center justify-center bg-paper embossed-inset p-1.5">
                            <svg 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.8" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                className="w-full h-full text-federal-green"
                            >
                                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                                <path d="M12 2a10 10 0 0 1 10 10M12 2v4M12 18v4M2 12h4M18 12h4" />
                                <path d="M8 12a4 4 0 1 1 4 4" />
                                <path d="M12 8v4h4" />
                                <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
                            </svg>
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

                </nav>
            </div>
        </header>
    );
}
