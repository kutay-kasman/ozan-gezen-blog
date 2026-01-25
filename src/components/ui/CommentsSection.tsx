'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useState, useEffect } from 'react';

interface Comment {
    id: string;
    name: string;
    content: string;
    createdAt: string;
}

interface CommentsSectionProps {
    postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
    const { t, language } = useLanguage();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?postId=${postId}`);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, content, postId }),
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments([newComment, ...comments]);
                setName('');
                setContent('');
            }
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateStr));
    };

    return (
        <section className="mt-12 pt-8 border-t border-paper-dark">
            <h3 className="font-serif text-2xl font-bold text-ink mb-6">{t('commentsTitle')}</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8 paper-card p-6 rounded-lg">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-ink-light mb-2">
                        {t('commentsName')}
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('commentsNamePlaceholder')}
                        className="w-full px-4 py-2 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-ink-light mb-2">
                        {t('commentsContent')}
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t('commentsContentPlaceholder')}
                        rows={4}
                        className="w-full px-4 py-2 rounded-md resize-none"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting || !name.trim() || !content.trim()}
                    className="btn-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? t('commentsSubmitting') : t('commentsSubmit')}
                </button>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="paper-card p-4 rounded-lg animate-pulse">
                            <div className="h-4 bg-paper-dark/30 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-paper-dark/30 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <p className="text-ink-muted text-center py-8">{t('commentsEmpty')}</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="paper-card p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-ink">{comment.name}</span>
                                <time className="text-xs text-ink-muted">{formatDate(comment.createdAt)}</time>
                            </div>
                            <p className="text-ink-light whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
