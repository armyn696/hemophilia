'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

export default function NewsPreviewSection() {
  const t = useTranslations('news');
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNewsItems(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Card dimensions
  const cardWidth = 350;
  const cardGap = 32;
  const cardTotalWidth = cardWidth + cardGap;

  // Calculate how many times to duplicate to ensure seamless infinite scroll
  // For LTR mode we start in the middle, so we need MORE items to cover both directions
  // Need enough items to cover viewport * 3 (left buffer + visible + right buffer)
  const viewportBuffer = 4000; // pixels for one direction
  const minItemsNeeded = Math.ceil((viewportBuffer * 3) / cardTotalWidth);
  const duplicateCount = newsItems.length > 0 ? Math.max(10, Math.ceil(minItemsNeeded / newsItems.length)) : 0;

  // Duplicate items for infinite scroll
  const duplicatedItems = newsItems.length >= 1
    ? Array(duplicateCount).fill(newsItems).flat()
    : newsItems;

  // Total width of all duplicated items
  const totalDuplicatedWidth = cardTotalWidth * duplicatedItems.length;

  // Single set width is calculated from original items
  const singleSetWidth = cardTotalWidth * newsItems.length;

  // Motion values
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseTimeRef = useRef(0);
  const baseXRef = useRef(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize position - always start from 0
  useEffect(() => {
    if (newsItems.length > 0 && singleSetWidth > 0 && !isInitialized) {
      const isRtl = locale === 'fa';
      console.log('[NEWS INIT]', {
        locale,
        isRtl,
        singleSetWidth,
        totalDuplicatedWidth,
        newsItemsCount: newsItems.length,
        duplicatedCount: duplicatedItems.length
      });
      x.set(0);
      baseXRef.current = 0;
      baseTimeRef.current = performance.now();
      setIsInitialized(true);
    }
  }, [newsItems.length, singleSetWidth, locale, isInitialized, x, duplicatedItems.length, totalDuplicatedWidth]);

  // Auto-scroll animation
  useAnimationFrame((time) => {
    if (isDragging || newsItems.length === 0 || singleSetWidth === 0 || !isInitialized) return;

    const isRtl = locale === 'fa';

    // Speed: 40 pixels per second
    const speed = 40 / 1000;

    // Calculate elapsed time
    const elapsedTime = time - baseTimeRef.current;
    const scrollOffset = elapsedTime * speed;

    // Calculate new position (always move left for LTR, right for RTL)
    let newX = isRtl
      ? baseXRef.current + scrollOffset
      : baseXRef.current - scrollOffset;

    // Simple wrap around logic - both directions wrap using singleSetWidth
    // When we've scrolled one full set, reset back
    if (!isRtl) {
      // LTR: Moving left (negative) - wrap when we reach -singleSetWidth
      while (newX <= -singleSetWidth) {
        newX += singleSetWidth;
        baseXRef.current += singleSetWidth;
      }
    } else {
      // RTL: Moving right (positive) - wrap when we reach singleSetWidth
      while (newX >= singleSetWidth) {
        newX -= singleSetWidth;
        baseXRef.current -= singleSetWidth;
      }
    }

    x.set(newX);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Don't render carousel if no news items
  if (loading) {
    return (
      <section ref={ref} className="relative pt-10 pb-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return null; // Don't show section if no news
  }

  return (
    <section
      ref={ref}
      className="relative pt-10 pb-20 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#A91D3A] font-semibold text-sm uppercase tracking-wider">
            {t('badge', { defaultValue: 'News & Updates' })}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] mt-4">
            {t('title', { defaultValue: 'Latest News' })}
          </h2>
        </motion.div>
      </div>

      {/* Infinite Scroll News Carousel */}
      <div className="relative cursor-grab active:cursor-grabbing" ref={containerRef}>
        <motion.div
          className="flex gap-8 mb-12 pl-4"
          style={{ x }}
          drag="x"
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setIsDragging(false);

            const isRtl = locale === 'fa';

            // Update refs to continue from current position
            baseTimeRef.current = performance.now();
            baseXRef.current = x.get();

            // Wrap around after manual drag based on direction
            if (!isRtl) {
              // LTR: Wrap using singleSetWidth
              while (baseXRef.current <= -singleSetWidth) {
                baseXRef.current += singleSetWidth;
              }
              while (baseXRef.current > 0) {
                baseXRef.current -= singleSetWidth;
              }
            } else {
              // RTL: Wrap using singleSetWidth
              while (baseXRef.current >= singleSetWidth) {
                baseXRef.current -= singleSetWidth;
              }
              while (baseXRef.current < 0) {
                baseXRef.current += singleSetWidth;
              }
            }
            x.set(baseXRef.current);
          }}
        >
          {duplicatedItems.map((news: NewsItem, index: number) => (
            <div
              key={`news-${index}`}
              className="flex-shrink-0 w-[350px]"
            >
              <Link
                href={`/${locale}/news/${news.id}`}
                className={isDragging ? 'pointer-events-none' : ''}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category & Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#A91D3A]/10 text-[#A91D3A] text-xs font-bold px-3 py-1 rounded-full">
                        {news.category}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(news.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{news.author}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#2C3E50] mb-3 group-hover:text-[#A91D3A] transition-colors line-clamp-2">
                      {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {news.excerpt}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-[#A91D3A] font-semibold text-sm group-hover:gap-4 transition-all">
                      <span>{t('read_more', { defaultValue: 'Read More' })}</span>
                      {locale === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>

      {/* View All Button */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href={`/${locale}/news`}>
            <Button
              size="lg"
              className="bg-[#2C3E50] hover:bg-[#2C3E50]/90 text-white px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {t('view_all', { defaultValue: 'View All News' })}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
