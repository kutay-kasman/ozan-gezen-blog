'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: string;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export default function HomePage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts/public')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-paper-dark">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="border-engraving inline-block p-8 mb-8 rounded-lg bg-paper-light/50">
              {t('heroTitle') && (
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4 embossed">
                  {t('heroTitle')}
                </h1>
              )}
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-ink max-w-2xl mx-auto leading-tight">
                {t('heroSubtitle')}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-federal-green/30"></div>
              <div className="w-3 h-3 rounded-full border border-federal-green"></div>
              <div className="w-2 h-2 rounded-full bg-federal-green"></div>
              <div className="w-3 h-3 rounded-full border border-federal-green"></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-federal-green/30"></div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            {loading ? (
              <div className="space-y-8">
                {[1, 2].map(i => (
                  <div key={i} className="paper-card p-8 rounded-lg animate-pulse">
                    <div className="h-6 bg-paper-dark/30 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-paper-dark/30 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-paper-dark/30 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-federal-green/30 flex items-center justify-center mx-auto mb-6 p-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full text-federal-green/40"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="7" strokeDasharray="5 2 8 3" />
                    <circle cx="12" cy="12" r="4" strokeDasharray="3 2" />
                    <path d="M12 2v2M12 15v2M7 12h2M15 12h2" />
                    <path d="M12 7v2M12 12h3" />
                    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-ink-light mb-3">{t('noArticlesTitle')}</h2>
                <p className="text-ink-muted">
                  {t('noArticlesText')}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post, index) => (
                  <Link key={post.id} href={`/${post.slug}`}>
                    <Card hover className={`group ${index === 0 ? 'border-engraving' : ''}`}>
                      <div className="flex flex-col md:flex-row">
                        {/* Cover Image */}
                        {post.coverImage && (
                          <div className="md:w-1/3 h-48 md:h-auto relative bg-paper-dark">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-6 md:p-8">
                          {/* Date */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-federal-green"></div>
                            <time className="text-sm text-ink-muted tracking-wide uppercase">
                              {formatDate(post.createdAt)}
                            </time>
                          </div>

                          {/* Title */}
                          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink group-hover:text-federal-green transition-colors mb-3">
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-ink-light leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Read more */}
                          <div className="mt-4 flex items-center text-federal-green font-medium text-sm group-hover:gap-3 transition-all">
                            <span>{t('readArticle')}</span>
                            <svg
                              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
