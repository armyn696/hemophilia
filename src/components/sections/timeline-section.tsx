'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';
import { CalendarDays, Loader2 } from 'lucide-react';
import { useDataCache } from '@/contexts/data-cache-context';

interface TimelineEvent {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  date?: string;
  dateEn?: string;
  image?: string;
}

interface TimelinePeriod {
  id: string;
  title: string;
  titleEn?: string;
  image?: string;
  events: TimelineEvent[];
}

export default function TimelineSection() {
  const t = useTranslations('timeline');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const [periods, setPeriods] = useState<TimelinePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const dataCache = useDataCache();

  useEffect(() => {
    const CACHE_KEY = 'timeline-periods';

    // Check cache first
    const cachedData = dataCache.get<TimelinePeriod[]>(CACHE_KEY);
    if (cachedData) {
      setPeriods(cachedData);
      setLoading(false);
      return;
    }

    async function fetchTimeline() {
      try {
        const res = await fetch('/api/timeline/periods');
        const data = await res.json();
        dataCache.set(CACHE_KEY, data);
        setPeriods(data);
      } catch (error) {
        console.error('Failed to load timeline');
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, [dataCache]);

  // Helper function to render activities list
  const ActivityList = ({ items, image }: { items: TimelineEvent[], image?: string }) => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
      <div dir={isRtl ? "rtl" : "ltr"} className={`relative ${isRtl ? "text-right" : "text-left"}`}>
        {/* Vertical dashed line */}
        <div className={`absolute top-4 bottom-4 ${isRtl ? "right-[19px]" : "left-[19px]"} w-0.5 bg-gradient-to-b from-red-200/50 via-red-200/50 to-transparent dark:from-neutral-800`} />

        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              {/* Custom Marker */}
              <div className={`absolute top-5 ${isRtl ? "right-[11px]" : "left-[11px]"} z-10`}>
                <div className="w-5 h-5 rounded-full bg-[#FDF2F4] dark:bg-neutral-950 border-2 border-red-200 group-hover:border-[#A91D3A] group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-300 group-hover:bg-[#A91D3A] transition-colors duration-300" />
                </div>
              </div>

              {/* Card Content */}
              <div className={`${isRtl ? "mr-8 md:mr-10" : "ml-8 md:ml-10"} bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-red-100/50 dark:border-neutral-800 group-hover:border-red-200/80 dark:group-hover:border-red-900/30`}>
                <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 mb-2 group-hover:text-[#A91D3A] transition-colors">
                  {isRtl ? item.title : (item.titleEn || item.title)}
                </h3>

                {(isRtl ? item.date : (item.dateEn || item.date)) && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A91D3A] mb-3 bg-red-50 dark:bg-red-950/20 w-fit px-2.5 py-1 rounded-md">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {isRtl ? item.date : (item.dateEn || item.date)}
                  </div>
                )}

                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {isRtl ? item.description : (item.descriptionEn || item.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {image && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl order-first md:order-last group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <Image
            src={image}
            alt="Timeline Event"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
    </div>
  );

  const data = periods.map(period => ({
    title: isRtl ? period.title : (period.titleEn || period.title),
    content: <ActivityList items={period.events} image={period.image || period.events[0]?.image} />
  }));

  if (loading) {
    return (
      <section className="relative bg-[#FDF2F4] py-20">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      </section>
    );
  }

  if (periods.length === 0) {
    return null; // Don't show section if no timeline data
  }

  return (
    <section className="relative bg-[#FDF2F4]">
      <div className="max-w-7xl mx-auto pt-20 pb-8 px-4 md:px-8 lg:px-10">
        <span className="text-[#A91D3A] font-semibold text-sm uppercase tracking-wider block text-center md:text-start">
          {t('badge')}
        </span>
        <h2 className="text-lg md:text-4xl mb-4 mt-4 text-[#2C3E50] max-w-4xl font-bold text-center md:text-start">
          {t('title')}
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl text-center md:text-start">
          {t('description')}
        </p>
      </div>
      <Timeline data={data} />
    </section>
  );
}
