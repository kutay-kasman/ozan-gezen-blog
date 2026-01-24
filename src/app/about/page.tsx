'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/lib/LanguageContext';

interface AboutData {
    aboutPhoto: string | null;
    aboutBio: string | null;
}

export default function AboutPage() {
    const { t } = useLanguage();
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/about')
            .then(res => res.json())
            .then(data => {
                setAboutData(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-paper">
                <Header />
                <main className="max-w-4xl mx-auto px-6 py-16">
                    <div className="text-center text-ink-muted">Loading...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-12 text-center">
                    {t('aboutTitle')}
                </h1>

                {aboutData?.aboutPhoto || aboutData?.aboutBio ? (
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                        {/* Photo */}
                        {aboutData.aboutPhoto && (
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-federal-green/20 shadow-lg">
                                    <img
                                        src={aboutData.aboutPhoto}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bio */}
                        {aboutData.aboutBio && (
                            <div className="flex-1">
                                <div className="prose prose-lg max-w-none">
                                    {aboutData.aboutBio.split('\n').map((paragraph, index) => (
                                        <p key={index} className="text-ink-light leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-federal-green/30 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-federal-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <p className="text-ink-muted">{t('aboutNoInfo')}</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
