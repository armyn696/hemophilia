'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
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

  // Embla Carousel with AutoScroll for continuous loop
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      direction: isRtl ? 'rtl' : 'ltr',
      dragFree: true,
      containScroll: false,
    },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        speed: 1, // Adjust speed (pixels per frame approx)
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins().autoScroll;
    if (!autoScroll) return;

    // If not playing, or moving forward, switch to move backward
    if (!autoScroll.isPlaying()) autoScroll.play();
    // AutoScroll doesn't have a simple "reverse" method in v8 same way, 
    // but negative speed makes it go other way. 
    // However, simplest UX for buttons with AutoScroll is usually just "scrollPrev" standard method
    // which temporarily overrides auto-scroll.
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

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
      <div className="container mx-auto px-4 mb-10 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full">
            <span className="inline-block text-primary font-semibold text-sm tracking-wider mb-2">
              {t('badge', { defaultValue: 'News & Updates' })}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {t('title', { defaultValue: 'Latest News' })}
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
              {isRtl ? 'خبرها خودکار حرکت می‌کنند؛ با اسکرول ماوس یا کشیدن، کنترل دست شماست.' : 'News scrolls automatically; drag or scroll to control.'}
            </p>
          </div>
        </div>
      </div>

      <div className="embla relative" ref={emblaRef}>
        <div className="embla__container flex touch-pan-y">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="embla__slide flex-none w-[300px] sm:w-[350px] px-3"
              style={{ minWidth: 0 }}
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

                    <div className="flex items-center text-primary font-bold text-sm tracking-wide group/btn">
                      {t('read_more', { defaultValue: 'Read More' })}
                      <span className="mx-2 transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform">
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
