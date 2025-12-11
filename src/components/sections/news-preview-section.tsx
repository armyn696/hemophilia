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

  // Duplicate items for seamless infinite scroll only if we have 3+ items
  const duplicatedItems = newsItems.length >= 3 ? [...newsItems, ...newsItems] : newsItems;
  
  // Motion values for manual and auto scroll
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartTimeRef = useRef(0);
  const dragStartXRef = useRef(0);
  
  // Initialize animation start time
  useEffect(() => {
    dragStartTimeRef.current = performance.now();
  }, []);
  
  // Auto-scroll animation (100 seconds for full cycle - half speed)
  useAnimationFrame((t) => {
    if (isDragging || !containerRef.current) return;
    
    const cardWidth = 350 + 32; // card width + gap
    const totalWidth = cardWidth * newsItems.length;
    const isRtl = locale === 'fa';
    
    // Speed: pixels per millisecond (slower = half speed)
    const speed = totalWidth / 100000; // 100 seconds = 100000ms
    
    // Calculate elapsed time since drag ended
    const elapsedTime = t - dragStartTimeRef.current;
    const autoScrollOffset = elapsedTime * speed;
    
    // Combine manual drag position with auto-scroll
    // For RTL, we want to move in positive direction (right)
    // For LTR, we want to move in negative direction (left)
    let newX = isRtl 
      ? dragStartXRef.current + autoScrollOffset 
      : dragStartXRef.current - autoScrollOffset;
    
    // Wrap around for infinite scroll
    if (isRtl) {
      // For RTL: Start at negative offset (hidden left items) and move right towards 0
      // When newX > 0 (reached start), reset to -totalWidth
      while (newX > 0) {
        newX -= totalWidth;
        dragStartXRef.current -= totalWidth;
      }
      while (newX < -totalWidth) {
        newX += totalWidth;
        dragStartXRef.current += totalWidth;
      }
    } else {
      // For LTR: Start at 0 and move left towards -totalWidth
      while (newX < -totalWidth) {
        newX += totalWidth;
        dragStartXRef.current += totalWidth;
      }
      while (newX > 0) {
        newX -= totalWidth;
        dragStartXRef.current -= totalWidth;
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
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
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
          onDragEnd={(event, info) => {
            setIsDragging(false);
            
            // Update refs to continue from current position
            dragStartTimeRef.current = performance.now();
            dragStartXRef.current = x.get();
            
            // Wrap around after manual drag
            const cardWidth = 350 + 32;
            const totalWidth = cardWidth * newsItems.length;
            const isRtl = locale === 'fa';
            
            if (isRtl) {
              while (dragStartXRef.current > 0) {
                dragStartXRef.current -= totalWidth;
              }
              while (dragStartXRef.current < -totalWidth) {
                dragStartXRef.current += totalWidth;
              }
            } else {
              while (dragStartXRef.current < -totalWidth) {
                dragStartXRef.current += totalWidth;
              }
              while (dragStartXRef.current > 0) {
                dragStartXRef.current -= totalWidth;
              }
            }
          }}
        >
          {duplicatedItems.map((news, index) => (
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
                    <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold px-3 py-1 rounded-full">
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
                  <h3 className="text-xl font-bold text-[#2C3E50] mb-3 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                    {news.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {news.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-[#FF6B35] font-semibold text-sm group-hover:gap-4 transition-all">
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
