'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { useLanguage } from '@/lib/LanguageContext';

import Link from 'next/link';

interface Props {
    params: Promise<{ id: string }>;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    status: string;
}

export default function EditorPage({ params }: Props) {
    const { id } = use(params);
    const isNew = id === 'new';
    const router = useRouter();
    const { t } = useLanguage();

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<string>('DRAFT');
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Handle image upload to Cloudinary
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await res.json();
            setCoverImage(data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    // Generate slug from title
    useEffect(() => {
        if (isNew && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setSlug(generatedSlug);
        }
    }, [title, isNew]);

    // Fetch existing post
    useEffect(() => {
        if (!isNew) {
            fetch(`/api/posts/${id}`)
                .then((res) => {
                    if (res.status === 401) {
                        router.push('/admin/login');
                        throw new Error('Unauthorized');
                    }
                    return res.json();
                })
                .then((data: Post) => {
                    setTitle(data.title || '');
                    setSlug(data.slug || '');
                    setExcerpt(data.excerpt || '');
                    setCoverImage(data.coverImage || '');
                    setContent(typeof data.content === 'string' ? data.content : JSON.stringify(data.content));
                    setStatus(data.status || 'DRAFT');
                    setLoading(false);
                })
                .catch((err) => {
                    if (err.message !== 'Unauthorized') {
                        setError('Failed to load post');
                    }
                    setLoading(false);
                });
        }
    }, [id, isNew, router]);

    const handleSave = async (newStatus: string) => {
        setSaving(true);
        setError('');

        try {
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? '/api/posts' : `/api/posts/${id}`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || 'Untitled',
                    slug: slug || `post-${Date.now()}`,
                    excerpt,
                    coverImage: coverImage || null,
                    content: content || JSON.stringify({ type: 'doc', content: [] }),
                    status: newStatus,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            const savedPost = await res.json();

            if (isNew) {
                router.push(`/admin/editor/${savedPost.id}`);
            }

            setStatus(newStatus);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            router.push('/admin');
        } catch {
            setError('Failed to delete post');
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
            {/* Editor Header */}
            <header className="border-b border-paper-dark bg-paper-light/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 text-ink-muted hover:text-federal-green transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="font-serif text-lg font-bold text-ink">
                                {isNew ? t('editorNew') : t('editorEdit')}
                            </h1>
                            <p className="text-xs text-ink-muted">
                                {status === 'PUBLISHED' ? t('editorPublished') : t('editorDraft')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        {!isNew && (
                            <button
                                onClick={handleDelete}
                                className="text-sm text-red-500 hover:text-red-600 transition-colors"
                            >
                                {t('editorDelete')}
                            </button>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSave('DRAFT')}
                            disabled={saving}
                        >
                            {t('editorSaveDraft')}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleSave('PUBLISHED')}
                            disabled={saving}
                        >
                            {saving ? t('editorSaving') : t('editorPublish')}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('editorTitlePlaceholder')}
                            className="w-full text-4xl font-serif font-bold bg-transparent border-none outline-none placeholder:text-ink-muted/50"
                        />
                    </div>

                    {/* Slug */}
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                        <span>{t('editorSlugLabel')}</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder={t('editorSlugPlaceholder')}
                            className="flex-1 bg-paper-light px-2 py-1 rounded border border-paper-dark text-ink"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">{t('editorExcerptLabel')}</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder={t('editorExcerptPlaceholder')}
                            rows={2}
                            className="w-full px-4 py-3 rounded-md resize-none"
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">{t('editorCoverLabel')}</label>

                        {/* Image Preview */}
                        {coverImage && (
                            <div className="mb-3 relative">
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    className="w-full max-h-48 object-cover rounded-md border border-paper-dark"
                                />
                                <button
                                    type="button"
                                    onClick={() => setCoverImage('')}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex gap-3 items-center mb-2">
                            <label className="cursor-pointer bg-federal-green text-paper-light px-4 py-2 rounded-md hover:bg-federal-green/90 transition-colors text-sm font-medium">
                                {uploading ? t('editorUploading') : t('editorUploadImage')}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-ink-muted text-sm">{t('editorOrEnterUrl')}</span>
                        </div>

                        {/* URL Input */}
                        <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder={t('editorCoverPlaceholder')}
                            className="w-full px-4 py-3 rounded-md"
                        />
                    </div>

                    {/* Editor */}
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">{t('editorContentLabel')}</label>
                        <TiptapEditor content={content} onChange={setContent} />
                    </div>
                </div>
            </main>
        </div>
    );
}
