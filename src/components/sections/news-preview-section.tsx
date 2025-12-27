'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useRef, useCallback } from 'react';
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

  // Timer ref to manage restart delay
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Embla Carousel setup with AutoScroll
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      direction: isRtl ? 'rtl' : 'ltr',
    },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: true, // Stop on interaction, we'll restart manually
        stopOnMouseEnter: true,
        stopOnFocusIn: false,
        speed: 1,
        direction: isRtl ? 'backward' : 'forward',
      }),
    ]
  );

  // Restart auto-scroll after pointer up (touch release)
  const handlePointerUp = useCallback(() => {
    if (!emblaApi) return;

    // Clear any existing timer
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }

    // Restart auto-scroll after 2 seconds
    restartTimerRef.current = setTimeout(() => {
      const autoScroll = emblaApi.plugins()?.autoScroll;
      if (autoScroll) {
        autoScroll.play();
      }
    }, 2000);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Listen for pointer up (touch release / mouse release)
    emblaApi.on('pointerUp', handlePointerUp);

    return () => {
      emblaApi.off('pointerUp', handlePointerUp);
      // Clear timer on cleanup
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, [emblaApi, handlePointerUp]);

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
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-52 md:w-80 h-72 md:h-96 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || newsItems.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden relative">
      {/* Header */}
      <div className="container mx-auto px-4 mb-6 md:mb-10 text-center">
        <span className="inline-block text-primary font-semibold text-xs md:text-sm tracking-wider mb-2">
          {t('badge', { defaultValue: 'News & Updates' })}
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
          {t('title', { defaultValue: 'Latest News' })}
        </h2>
        <p className="text-gray-500 text-xs md:text-sm mt-2 md:mt-3 max-w-2xl mx-auto hidden md:block">
          {isRtl
            ? 'خبرها خودکار حرکت می‌کنند؛ با اسکرول ماوس یا کشیدن، کنترل دست شماست.'
            : 'News scrolls automatically; drag or scroll to control.'}
        </p>
      </div>

      {/* Embla Carousel */}
      <div
        className="overflow-hidden"
        ref={emblaRef}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="flex-none w-[200px] sm:w-[280px] md:w-[320px] lg:w-[350px] pl-4 md:pl-5"
            >
              <Link href={`/${locale}/news/${news.id}`} className="block h-full group">
                <article className="h-full bg-white border border-gray-100 rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-36 sm:h-44 md:h-52 overflow-hidden bg-gray-100">
                    <Image
                      src={news.image}
                      alt={locale === 'fa' ? news.title : news.titleEn || news.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    {news.category && (
                      <span className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-sm">
                        {locale === 'fa' ? news.category.nameFa : news.category.name}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    {/* Date */}
                    <div className="flex items-center gap-4 text-[10px] md:text-xs text-gray-400 mb-2 md:mb-4 font-medium">
                      <span className="flex items-center gap-1 bg-gray-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {formatDate(news.date, news.dateFa)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 text-sm md:text-xl leading-snug mb-2 md:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {locale === 'fa' ? news.title : news.titleEn || news.title}
                    </h3>

                    {/* Excerpt - hidden on mobile */}
                    <p className="hidden md:block text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                      {locale === 'fa' ? news.excerpt : news.excerptEn || news.excerpt}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center text-primary font-bold text-xs md:text-sm tracking-wide mt-auto">
                      {t('read_more', { defaultValue: 'Read More' })}
                      <span className="mx-1 md:mx-2">
                        {isRtl ? <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> : <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />}
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
      <div className="text-center mt-8 md:mt-12">
        <Link href={`/${locale}/news`}>
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-colors shadow-lg hover:shadow-xl">
            {t('view_all', { defaultValue: 'View All News' })}
          </button>
        </Link>
      </div>
    </section>
  );
}
