'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

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

export default function NewsPreviewSection() {
  const t = useTranslations('news');
  const locale = useLocale();
  const isRtl = locale === 'fa';

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create AutoScroll plugin instance with useRef to prevent recreation
  const autoScrollOptions = useRef(
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      speed: 1,
      direction: isRtl ? 'backward' : 'forward',
    })
  );

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      skipSnaps: true,
      direction: isRtl ? 'rtl' : 'ltr',
    },
    [autoScrollOptions.current]
  );

  // Reinitialize when locale changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({
        loop: true,
        align: 'start',
        dragFree: true,
        skipSnaps: true,
        direction: isRtl ? 'rtl' : 'ltr',
      });
    }
  }, [emblaApi, isRtl]);

  // Fetch news
  useEffect(() => {
    fetch('/api/news')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setNewsItems(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string, dateFa?: string) => {
    if (locale === 'fa' && dateFa) return dateFa;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-80 h-96 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || newsItems.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      {/* Header */}
      <div className="container mx-auto px-4 mb-10 text-center">
        <span className="inline-block text-primary font-semibold text-sm tracking-wider mb-2">
          {t('badge', { defaultValue: 'News & Updates' })}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {t('title', { defaultValue: 'Latest News' })}
        </h2>
        <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
          {isRtl
            ? 'خبرها خودکار حرکت می‌کنند؛ با اسکرول ماوس یا کشیدن، کنترل دست شماست.'
            : 'News scrolls automatically; drag or scroll to control.'}
        </p>
      </div>

      {/* Embla Carousel */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div
          className="flex"
          style={{
            touchAction: 'pan-y pinch-zoom',
            marginLeft: 'calc(var(--slide-spacing) * -1)',
          }}
        >
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="flex-shrink-0 flex-grow-0 pl-6"
              style={{
                flexBasis: 'min(100%, 350px)',
                minWidth: 0,
              }}
            >
              <Link href={`/${locale}/news/${news.id}`} className="block h-full group">
                <article className="h-full bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <Image
                      src={news.image}
                      alt={locale === 'fa' ? news.title : news.titleEn || news.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    {news.category && (
                      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {locale === 'fa' ? news.category.nameFa : news.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(news.date, news.dateFa)}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-xl leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {locale === 'fa' ? news.title : news.titleEn || news.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                      {locale === 'fa' ? news.excerpt : news.excerptEn || news.excerpt}
                    </p>

                    <div className="flex items-center text-primary font-bold text-sm tracking-wide">
                      {t('read_more', { defaultValue: 'Read More' })}
                      <span className="mx-2">
                        {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link href={`/${locale}/news`}>
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl">
            {t('view_all', { defaultValue: 'View All News' })}
          </button>
        </Link>
      </div>
    </section>
  );
}
