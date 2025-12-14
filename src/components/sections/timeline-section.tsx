'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';
import { CalendarDays } from 'lucide-react';

export default function TimelineSection() {
  const t = useTranslations('timeline');
  const locale = useLocale();
  const isRtl = locale === 'fa';

  const sectionImages: Record<string, string> = {
    ongoing: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032",
    may: "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?q=80&w=2070",
    august: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=2069",
    september: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=2070",
    october: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2032",
    november: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2064",
    december: "https://images.unsplash.com/photo-1515978445540-23bd71e8f988?q=80&w=2069",
    others: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070"
  };

  // Helper function to render activities list
  const ActivityList = ({ items, image }: { items: { title: string; description: string; time?: string }[], image: string }) => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
      <div dir={isRtl ? "rtl" : "ltr"} className={`relative ${isRtl ? "text-right" : "text-left"}`}>
        {/* Vertical dashed line */}
        <div className={`absolute top-4 bottom-4 ${isRtl ? "right-[19px]" : "left-[19px]"} w-0.5 bg-gradient-to-b from-red-200/50 via-red-200/50 to-transparent dark:from-neutral-800`} />
        
        <div className="flex flex-col gap-6">
          {items.map((item, index) => (
            <div key={index} className="relative group">
              {/* Custom Marker */}
              <div className={`absolute top-5 ${isRtl ? "right-[11px]" : "left-[11px]"} z-10`}>
                <div className="w-5 h-5 rounded-full bg-[#FDF2F4] dark:bg-neutral-950 border-2 border-red-200 group-hover:border-[#A91D3A] group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-300 group-hover:bg-[#A91D3A] transition-colors duration-300" />
                </div>
              </div>

              {/* Card Content */}
              <div className={`${isRtl ? "mr-8 md:mr-10" : "ml-8 md:ml-10"} bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-red-100/50 dark:border-neutral-800 group-hover:border-red-200/80 dark:group-hover:border-red-900/30`}>
                <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 mb-2 group-hover:text-[#A91D3A] transition-colors">
                  {item.title}
                </h3>
                
                {item.time && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A91D3A] mb-3 bg-red-50 dark:bg-red-950/20 w-fit px-2.5 py-1 rounded-md">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {item.time}
                  </div>
                )}
                
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl order-first md:order-last group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <Image 
          src={image} 
          alt="Timeline Event" 
          fill 
          className="object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>
    </div>
  );

  const sections = ['ongoing', 'may', 'august', 'september', 'october', 'november', 'december', 'others'];

  const data = sections.map(sectionKey => {
    const items = t.raw(`${sectionKey}.items`) as any[];
    return {
      title: t(`${sectionKey}.title`),
      content: <ActivityList items={items} image={sectionImages[sectionKey]} />
    };
  });

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
