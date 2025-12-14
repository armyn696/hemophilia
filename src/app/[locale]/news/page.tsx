'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsPage() {
  const t = useTranslations('news');
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('category.all', { defaultValue: 'All' }) },
    { id: 'events', label: t('category.events', { defaultValue: 'Events' }) },
    { id: 'medical', label: t('category.medical', { defaultValue: 'Medical' }) },
    { id: 'education', label: t('category.education', { defaultValue: 'Education' }) },
    { id: 'research', label: t('category.research', { defaultValue: 'Research' }) },
  ];

  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setAllNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = allNews.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-[#FDF2F4] dark:from-neutral-900 dark:to-neutral-950" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
              {t('page_title', { defaultValue: 'News & Updates' })}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400">
              {t('page_description', { defaultValue: 'Stay informed about the latest news, events, and updates from Birjand Hemophilia Society' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-y border-red-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 order-2 md:order-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant="ghost"
                    className={`rounded-full px-6 py-2 font-medium transition-all ${selectedCategory === category.id
                      ? 'bg-[#A91D3A] text-white shadow-md hover:bg-[#e55a2b] hover:text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                      }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-96 order-1 md:order-2">
                <div className={`absolute top-1/2 -translate-y-1/2 ${locale === 'fa' ? 'left-4' : 'right-4'}`}>
                  <Search className="w-5 h-5 text-neutral-400" />
                </div>
                <Input
                  type="text"
                  placeholder={t('search_placeholder', { defaultValue: 'Search news...' })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-6 text-base rounded-full border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-[#A91D3A] focus:border-[#A91D3A] ${locale === 'fa' ? 'pl-12 pr-6' : 'pr-12 pl-6'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A91D3A]"></div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700">
                <div className="mb-4 text-neutral-300 dark:text-neutral-600">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                  {t('no_results', { defaultValue: 'No news found matching your criteria.' })}
                </p>
                <Button
                  variant="link"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-[#A91D3A] mt-2"
                >
                  {locale === 'fa' ? 'پاک کردن فیلترها' : 'Clear filters'}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link href={`/${locale}/news/${news.id}`}>
                      <div className="group h-full flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-60 overflow-hidden">
                          <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className={`absolute top-4 ${locale === 'fa' ? 'right-4' : 'left-4'}`}>
                            <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-[#A91D3A] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-red-100 dark:border-neutral-800">
                              {categories.find(c => c.id === news.category)?.label}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Meta */}
                          <div className="flex items-center gap-4 text-xs font-medium text-neutral-400 mb-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(news.date)}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{news.author}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3 group-hover:text-[#A91D3A] transition-colors line-clamp-2 leading-tight">
                            {news.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                            {news.excerpt}
                          </p>

                          {/* Read More */}
                          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
                            <div className="flex items-center gap-2 text-[#A91D3A] font-bold text-sm group-hover:gap-3 transition-all">
                              <span>{t('read_more', { defaultValue: 'Read More' })}</span>
                              {locale === 'fa' ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
