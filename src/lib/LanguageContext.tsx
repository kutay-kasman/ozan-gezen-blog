'use client';

import { createContext, useContext, ReactNode } from 'react';
import { translations, TranslationKey } from './translations';

interface LanguageContextType {
    language: 'tr';
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const t = (key: TranslationKey): string => {
        return translations.tr[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language: 'tr', t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
