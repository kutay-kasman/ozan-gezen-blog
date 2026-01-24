'use client';

import { useLanguage } from '@/lib/LanguageContext';

export function LanguageSwitcher() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 text-sm font-medium text-ink-light hover:text-federal-green transition-colors px-2 py-1 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'TR'}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 bg-paper-light border border-paper-dark rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[120px]">
                <button
                    onClick={() => setLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-dark/30 transition-colors ${language === 'en' ? 'text-federal-green font-medium' : 'text-ink'
                        }`}
                >
                    {t('languageEn')}
                </button>
                <button
                    onClick={() => setLanguage('tr')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-dark/30 transition-colors ${language === 'tr' ? 'text-federal-green font-medium' : 'text-ink'
                        }`}
                >
                    {t('languageTr')}
                </button>
            </div>
        </div>
    );
}
