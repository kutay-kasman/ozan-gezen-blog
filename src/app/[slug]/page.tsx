import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate static paths for all published posts
export async function generateStaticParams() {
    try {
        const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true },
        });
        return posts.map((post) => ({ slug: post.slug }));
    } catch {
        return [];
    }
}

async function getPost(slug: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { slug, status: 'PUBLISHED' },
        });
        return post;
    } catch {
        return null;
    }
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

// Render TipTap JSON content to HTML
function renderContent(content: unknown): string {
    // Handle string content (SQLite stores JSON as string)
    let parsedContent = content;
    if (typeof content === 'string') {
        try {
            parsedContent = JSON.parse(content);
        } catch {
            return '';
        }
    }

    if (!parsedContent || typeof parsedContent !== 'object') return '';

    const doc = parsedContent as { type: string; content?: unknown[] };
    if (doc.type !== 'doc' || !doc.content) return '';

    return doc.content.map((node: unknown) => renderNode(node)).join('');
}

function renderNode(node: unknown): string {
    if (!node || typeof node !== 'object') return '';

    const n = node as { type: string; content?: unknown[]; attrs?: Record<string, unknown>; text?: string; marks?: unknown[] };

    switch (n.type) {
        case 'paragraph':
            return `<p>${n.content?.map(renderNode).join('') || ''}</p>`;
        case 'heading': {
            const level = n.attrs?.level || 2;
            return `<h${level}>${n.content?.map(renderNode).join('') || ''}</h${level}>`;
        }
        case 'text':
            let text = n.text || '';
            if (n.marks) {
                n.marks.forEach((mark: unknown) => {
                    const m = mark as { type: string };
                    if (m.type === 'bold') text = `<strong>${text}</strong>`;
                    if (m.type === 'italic') text = `<em>${text}</em>`;
                    if (m.type === 'code') text = `<code>${text}</code>`;
                });
            }
            return text;
        case 'image':
            return `<img src="${n.attrs?.src}" alt="${n.attrs?.alt || ''}" />`;
        case 'bulletList':
            return `<ul>${n.content?.map(renderNode).join('') || ''}</ul>`;
        case 'orderedList':
            return `<ol>${n.content?.map(renderNode).join('') || ''}</ol>`;
        case 'listItem':
            return `<li>${n.content?.map(renderNode).join('') || ''}</li>`;
        case 'blockquote':
            return `<blockquote>${n.content?.map(renderNode).join('') || ''}</blockquote>`;
        case 'codeBlock':
            return `<pre><code>${n.content?.map(renderNode).join('') || ''}</code></pre>`;
        case 'horizontalRule':
            return '<hr />';
        default:
            return n.content?.map(renderNode).join('') || '';
    }
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const htmlContent = renderContent(post.content);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-ink-muted hover:text-federal-green transition-colors mb-8"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Back to articles
                    </Link>

                    {/* Article Header */}
                    <header className="mb-10">
                        {/* Date */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-federal-green"></div>
                            <time className="text-sm text-ink-muted tracking-wide uppercase">
                                {formatDate(post.createdAt)}
                            </time>
                        </div>

                        {/* Title */}
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink leading-tight mb-6 embossed">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-xl text-ink-light leading-relaxed border-l-2 border-federal-green pl-4">
                                {post.excerpt}
                            </p>
                        )}
                    </header>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="relative h-64 md:h-96 mb-10 rounded-lg overflow-hidden border-engraving">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div
                        className="prose prose-lg max-w-none tiptap"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                    {/* Article Footer */}
                    <footer className="mt-16 pt-8 border-t border-paper-dark">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-federal-green/30"></div>
                            <div className="text-federal-green font-serif text-xl">$</div>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-federal-green/30"></div>
                        </div>
                        <p className="text-center text-ink-muted text-sm mt-4">
                            Thanks for reading.
                        </p>
                    </footer>
                </article>
            </main>

            <Footer />
        </div>
    );
}
