'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

interface NewsCategory {
  id: string;
  name: string;
  nameFa: string;
}

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  image: string;
  category?: NewsCategory | null;
  date: string;
  dateFa?: string;
  author: string;
}

export default function NewsDetailPage() {
  const t = useTranslations('news');
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isRtl = locale === 'fa';

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setNewsItem(data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  const formatDate = (dateString: string, dateFa?: string) => {
    if (locale === 'fa' && dateFa) return dateFa;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF8F3] dark:bg-neutral-950">
        <Navigation />
        <main className="flex-1 pt-28 pb-16 px-4 md:px-8 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF8F3] dark:bg-neutral-950">
        <Navigation />
        <main className="flex-1 pt-28 pb-16 px-4 md:px-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {isRtl ? 'خبر یافت نشد' : 'News not found'}
            </h1>
            <Link href={`/${locale}/news`}>
              <Button>{isRtl ? 'بازگشت به اخبار' : 'Back to News'}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F3] dark:bg-neutral-950">
      <Navigation />

      <main className="flex-1 pt-28 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link href={`/${locale}/news`}>
              <Button variant="ghost" className="group hover:text-[#A91D3A] hover:bg-red-50 dark:hover:bg-neutral-900">
                {isRtl ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                {isRtl ? 'بازگشت به اخبار' : 'Back to News'}
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="mb-8 text-center md:text-start">
            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-gray-500 mb-4">
              <span className="bg-red-100 text-[#A91D3A] px-3 py-1 rounded-full font-medium">
                {newsItem.category ? (isRtl ? newsItem.category.nameFa : newsItem.category.name) : ''}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(newsItem.date, newsItem.dateFa)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{newsItem.author}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] dark:text-white leading-tight mb-6">
              {isRtl ? newsItem.title : (newsItem.titleEn || newsItem.title)}
            </h1>
          </div>

          {/* Featured Image */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl mb-10">
            <Image
              src={newsItem.image}
              alt={newsItem.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Content */}
          <article
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-[#2C3E50] prose-a:text-[#A91D3A] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-[#A91D3A] prose-blockquote:bg-red-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: isRtl ? newsItem.content : (newsItem.contentEn || newsItem.content) }}
          />

          {/* Share/Footer area could go here */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            {/* Placeholder for share buttons or related news */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
