'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LogoutButton } from './LogoutButton';
import { useLanguage } from '@/lib/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
}

export default function AdminDashboard() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPosts = () => {
        setLoading(true);
        fetch('/api/posts')
            .then(res => {
                if (res.status === 401) {
                    router.push('/admin/login');
                    return [];
                }
                return res.json();
            })
            .then(data => {
                setPosts(data || []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, [router]);

    function formatDate(date: string): string {
        return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    }

    const handleDownloadPost = (post: Post) => {
        const postData = {
            title: post.title,
            slug: post.slug,
            status: post.status,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${post.slug}-backup.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleDownloadAll = () => {
        if (posts.length === 0) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `all-posts-backup-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleDownloadPDF = async (post: Post) => {
        setActionLoading(true);
        try {
            const doc = new jsPDF({
                unit: 'pt',
                format: 'a4',
            });

            // Create a temporary container for PDF rendering
            const container = document.createElement('div');
            container.style.width = '595pt'; // A4 width
            container.style.padding = '40pt';
            container.style.backgroundColor = 'white';
            container.style.color = '#1a1a1a';
            container.style.fontFamily = 'serif';

            container.innerHTML = `
                <h1 style="font-size: 24pt; margin-bottom: 10pt;">${post.title}</h1>
                <p style="color: #666; margin-bottom: 20pt;">${formatDate(post.createdAt)}</p>
                <div style="font-size: 12pt; line-height: 1.6;">${post.content}</div>
            `;
            document.body.appendChild(container);

            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save(`${post.slug}.pdf`);
            
            document.body.removeChild(container);
        } catch (err) {
            console.error('PDF Export Error:', err);
            alert('PDF could not be generated.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setActionLoading(true);
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const res = await fetch('/api/posts/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert(language === 'tr' ? 'Yedek başarıyla yüklendi!' : 'Backup restored successfully!');
                fetchPosts();
            } else {
                const err = await res.json();
                alert(err.error || 'Restore failed');
            }
        } catch (err) {
            console.error('Restore Error:', err);
            alert('Invalid backup file');
        } finally {
            setActionLoading(false);
            event.target.value = ''; // Reset input
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
            {/* Admin Header */}
            <header className="border-b border-paper-dark bg-paper-light/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-federal-green flex items-center justify-center bg-paper">
                            <span className="text-federal-green font-serif text-sm font-bold">$</span>
                        </div>
                        <div>
                            <h1 className="font-serif text-lg font-bold text-ink">{t('adminDashboard')}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link href="/admin/about" className="text-sm text-ink-muted hover:text-federal-green transition-colors">
                            {t('aboutTitle')}
                        </Link>
                        <Link href="/" className="text-sm text-ink-muted hover:text-federal-green transition-colors">
                            {t('adminViewSite')}
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Actions Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-ink">{t('adminArticles')}</h2>
                        <p className="text-ink-muted mt-1">{posts.length} {t('adminArticlesTotal')}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleRestore}
                                className="hidden"
                                id="restore-upload"
                                disabled={actionLoading}
                            />
                            <label
                                htmlFor="restore-upload"
                                className={`
                                    inline-flex items-center px-4 py-2 border border-paper-dark rounded-md 
                                    text-sm font-medium text-ink bg-paper-light hover:bg-paper-dark 
                                    transition-colors cursor-pointer
                                    ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                                </svg>
                                {language === 'tr' ? 'Yedek Yükle' : 'Restore Backup'}
                            </label>
                        </div>
                        <Button variant="secondary" onClick={handleDownloadAll} disabled={posts.length === 0 || actionLoading}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {language === 'tr' ? 'Tümünü Yedekle' : 'Backup All'}
                        </Button>
                        <Link href="/admin/editor/new">
                            <Button disabled={actionLoading}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {t('adminNewArticle')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Posts List */}
                {posts.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-federal-green/30 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-federal-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="font-serif text-xl text-ink mb-2">{t('adminNoArticles')}</h3>
                        <p className="text-ink-muted mb-6">{t('adminCreateFirst')}</p>
                        <Link href="/admin/editor/new">
                            <Button>{t('adminCreateArticle')}</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Card key={post.id} hover className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-serif text-lg font-bold text-ink truncate">
                                                {post.title || 'Untitled'}
                                            </h3>
                                            <span className={`
                        px-2 py-0.5 text-xs font-medium rounded-full
                        ${post.status === 'PUBLISHED'
                                                    ? 'bg-federal-green/10 text-federal-green'
                                                    : 'bg-seal-gold/20 text-seal-gold-dark'
                                                }
                      `}>
                                                {post.status === 'PUBLISHED' ? t('editorPublished') : t('editorDraft')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-ink-muted">
                                            {t('adminLastEdited')} {formatDate(post.updatedAt)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        {post.status === 'PUBLISHED' && (
                                            <Link
                                                href={`/${post.slug}`}
                                                className="p-2 text-ink-muted hover:text-federal-green transition-colors"
                                                title="View"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => handleDownloadPost(post)}
                                            className="p-2 text-ink-muted hover:text-federal-green transition-colors"
                                            title={language === 'tr' ? 'Yedeği İndir' : 'Download Backup'}
                                            disabled={actionLoading}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(post)}
                                            className="p-2 text-ink-muted hover:text-federal-green transition-colors"
                                            title={language === 'tr' ? 'PDF Olarak İndir' : 'Download as PDF'}
                                            disabled={actionLoading}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                        <Link
                                            href={`/admin/editor/${post.id}`}
                                            className="p-2 text-ink-muted hover:text-federal-green transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
