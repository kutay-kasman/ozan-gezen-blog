'use client';

import { useLanguage } from '@/lib/LanguageContext';

export function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-paper-dark bg-paper-light/50 mt-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left - Branding */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-federal-green flex items-center justify-center">
                            <span className="text-federal-green font-serif text-sm font-bold">$</span>
                        </div>
                        <span className="text-sm text-ink-muted">{t('siteName')}</span>
                    </div>

                    {/* Center - Copyright */}
                    <p className="text-sm text-ink-muted text-center">
                        © {currentYear} {t('footerCopy')}
                    </p>

                    {/* Right - Decorative */}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-federal-green/30"></div>
                        <div className="w-2 h-2 rounded-full bg-federal-green/50"></div>
                        <div className="w-2 h-2 rounded-full bg-federal-green"></div>
                    </div>
                </div>

                {/* Engraving-style separator */}
                <div className="mt-6 pt-6 border-t border-dashed border-paper-dark/50">
                    <p className="text-xs text-ink-muted/50 text-center tracking-widest uppercase">
                        {t('footerMotto')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
