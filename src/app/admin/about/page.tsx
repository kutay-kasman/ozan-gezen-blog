'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/lib/LanguageContext';

interface AboutData {
    aboutPhoto: string | null;
    aboutBio: string | null;
}

export default function AdminAboutPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [aboutData, setAboutData] = useState<AboutData>({ aboutPhoto: null, aboutBio: null });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/about')
            .then(res => {
                if (res.status === 401) {
                    router.push('/admin/login');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setAboutData({
                        aboutPhoto: data.aboutPhoto || '',
                        aboutBio: data.aboutBio || '',
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [router]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setAboutData(prev => ({ ...prev, aboutPhoto: data.url }));
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aboutData),
            });

            if (res.ok) {
                setMessage(t('aboutSaveSuccess'));
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-ink-muted">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-paper-dark bg-paper-light/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-ink-muted hover:text-federal-green transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="font-serif text-lg font-bold text-ink">{t('aboutTitle')}</h1>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? t('editorSaving') : t('editorSaveDraft')}
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {message && (
                    <div className="mb-6 p-4 bg-federal-green/10 border border-federal-green/20 rounded-md text-federal-green text-sm">
                        {message}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Photo Upload */}
                    <Card className="p-6">
                        <label className="block text-sm font-medium text-ink mb-4">
                            {t('aboutPhotoLabel')}
                        </label>

                        <div className="flex items-start gap-6">
                            {/* Photo Preview */}
                            <div className="w-32 h-32 rounded-full border-2 border-paper-dark overflow-hidden bg-paper flex-shrink-0">
                                {aboutData.aboutPhoto ? (
                                    <img
                                        src={aboutData.aboutPhoto}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 space-y-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    {uploading ? t('editorUploading') : t('editorUploadImage')}
                                </Button>

                                <div className="text-sm text-ink-muted">{t('editorOrEnterUrl')}</div>
                                <input
                                    type="url"
                                    value={aboutData.aboutPhoto || ''}
                                    onChange={(e) => setAboutData(prev => ({ ...prev, aboutPhoto: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-paper-dark rounded-md bg-paper focus:outline-none focus:ring-2 focus:ring-federal-green/20 text-sm"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Bio */}
                    <Card className="p-6">
                        <label className="block text-sm font-medium text-ink mb-4">
                            Bio
                        </label>
                        <textarea
                            value={aboutData.aboutBio || ''}
                            onChange={(e) => setAboutData(prev => ({ ...prev, aboutBio: e.target.value }))}
                            placeholder={t('aboutBioPlaceholder')}
                            rows={8}
                            className="w-full px-4 py-3 border border-paper-dark rounded-md bg-paper focus:outline-none focus:ring-2 focus:ring-federal-green/20 resize-none font-sans text-ink"
                        />
                    </Card>
                </div>
            </main>
        </div>
    );
}
