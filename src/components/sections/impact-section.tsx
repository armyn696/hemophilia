'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const impactAreas = [
  {
    id: 1,
    titleFa: 'خدمات پزشکی',
    titleEn: 'Medical Services',
    descFa: 'تأمین داروها و درمان‌های تخصصی برای بیماران',
    descEn: 'Providing specialized medications and treatments for patients',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500',
    position: 'top-left',
  },
  {
    id: 2,
    titleFa: 'آموزش و آگاهی',
    titleEn: 'Education & Awareness',
    descFa: 'برگزاری کارگاه‌ها و دوره‌های آموزشی برای بیماران و خانواده‌ها',
    descEn: 'Hosting workshops and training for patients and families',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=500',
    position: 'top-right',
  },
  {
    id: 3,
    titleFa: 'با هم، زندگی بیماران را تغییر می‌دهیم',
    titleEn: 'Together, We Transform Lives',
    descFa: 'اگر به کمک به دیگران علاقه‌مندید و می‌خواهید در محیطی پویا فعالیت کنید، ما منتظر شما هستیم!',
    descEn: 'If you\'re passionate about helping others thrive in a supportive environment, we want you!',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=500',
    position: 'center',
    isMain: true,
  },
  {
    id: 4,
    titleFa: 'حمایت اضطراری',
    titleEn: 'Emergency Support',
    descFa: 'کمک فوری در شرایط بحرانی و اورژانسی',
    descEn: 'Immediate aid during emergencies and crises',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=500',
    position: 'bottom-left',
  },
  {
    id: 5,
    titleFa: 'سلامت و تندرستی',
    titleEn: 'Health & Wellness',
    descFa: 'تأمین لوازم پزشکی، تغذیه و مراقبت‌های بهداشتی',
    descEn: 'Provide medical supplies, nutrition, and healthcare',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500',
    position: 'bottom-right',
  },
];

export default function ImpactSection() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isRtl = locale === 'fa';

  return (
    <section ref={ref} className="pt-24 pb-12 bg-[#FDF2F4]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50]">
            {isRtl ? (
              <>
                کمک شما <span className="text-[#A91D3A]">کجا</span> می‌رود؟
              </>
            ) : (
              <>
                Where Your <span className="text-[#A91D3A]">Support</span> Creates Change
              </>
            )}
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            {isRtl
              ? 'با کمک شما، در این ۵ حوزه به بیماران هموفیلی خدمات ارائه می‌دهیم'
              : 'Your donations help us provide services in these 5 key areas'}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {/* Top Left Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300 border border-neutral-100"
          >
            <div className="relative h-28 md:h-52 overflow-hidden">
              <Image
                src={impactAreas[0].image}
                alt={isRtl ? impactAreas[0].titleFa : impactAreas[0].titleEn}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="p-3 md:p-5 bg-white">
              <h3 className="text-xs md:text-lg font-bold text-[#2C3E50] mb-1 md:mb-2">
                {isRtl ? impactAreas[0].titleFa : impactAreas[0].titleEn}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed hidden md:block">
                {isRtl ? impactAreas[0].descFa : impactAreas[0].descEn}
              </p>
            </div>
          </motion.div>

          {/* Center Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#FDF2F4] rounded-2xl overflow-hidden row-span-2 group flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300 border border-red-100"
          >
            <div className="relative flex-1 min-h-[140px] md:min-h-[280px] overflow-hidden">
              <Image
                src={impactAreas[2].image}
                alt={isRtl ? impactAreas[2].titleFa : impactAreas[2].titleEn}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="p-6 text-center bg-white">
              <h3 className="text-sm md:text-lg lg:text-xl font-bold text-[#2C3E50] mb-2 md:mb-3">
                {isRtl ? impactAreas[2].titleFa : impactAreas[2].titleEn}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-5 leading-relaxed hidden md:block">
                {isRtl ? impactAreas[2].descFa : impactAreas[2].descEn}
              </p>
              <Link href={`/${locale}/donate`}>
                <Button className="bg-[#A91D3A] hover:bg-[#8B1538] text-white rounded-full px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm font-medium shadow-lg shadow-red-200/50">
                  {isRtl ? 'همراه ما شوید' : 'Join Our Team'}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Top Right Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#FDF2F4] rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300 border border-red-100"
          >
            <div className="relative h-28 md:h-52 overflow-hidden">
              <Image
                src={impactAreas[1].image}
                alt={isRtl ? impactAreas[1].titleFa : impactAreas[1].titleEn}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="p-3 md:p-5 bg-white">
              <h3 className="text-xs md:text-lg font-bold text-[#2C3E50] mb-1 md:mb-2">
                {isRtl ? impactAreas[1].titleFa : impactAreas[1].titleEn}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed hidden md:block">
                {isRtl ? impactAreas[1].descFa : impactAreas[1].descEn}
              </p>
            </div>
          </motion.div>

          {/* Bottom Left Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#FDF2F4] rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300 border border-red-100"
          >
            <div className="relative h-28 md:h-52 overflow-hidden">
              <Image
                src={impactAreas[3].image}
                alt={isRtl ? impactAreas[3].titleFa : impactAreas[3].titleEn}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="p-3 md:p-5 bg-white">
              <h3 className="text-xs md:text-lg font-bold text-[#2C3E50] mb-1 md:mb-2">
                {isRtl ? impactAreas[3].titleFa : impactAreas[3].titleEn}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed hidden md:block">
                {isRtl ? impactAreas[3].descFa : impactAreas[3].descEn}
              </p>
            </div>
          </motion.div>

          {/* Bottom Right Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[#FDF2F4] rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300 border border-red-100"
          >
            <div className="relative h-28 md:h-52 overflow-hidden">
              <Image
                src={impactAreas[4].image}
                alt={isRtl ? impactAreas[4].titleFa : impactAreas[4].titleEn}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="p-3 md:p-5 bg-white">
              <h3 className="text-xs md:text-lg font-bold text-[#2C3E50] mb-1 md:mb-2">
                {isRtl ? impactAreas[4].titleFa : impactAreas[4].titleEn}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed hidden md:block">
                {isRtl ? impactAreas[4].descFa : impactAreas[4].descEn}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
