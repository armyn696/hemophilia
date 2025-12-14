'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, Heart } from 'lucide-react';
import { ImagesSlider } from '@/components/ui/images-slider';

const heroImages = [
  '/images/hero-slide-1.jpg',
  '/images/hero-slide-2.png',
];

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const isRtl = locale === 'fa';

  const title = isRtl
    ? 'حمایت شما، جریان زندگی آن‌هاست'
    : 'Your support keeps their lives flowing';

  const subtitle = isRtl
    ? 'کانون هموفیلی بیرجند کنار بیماران هموفیلی و خانواده‌هایشان می‌ایستد تا از درمان، مراقبت و یک زندگی باکیفیت محروم نمانند.'
    : 'Birjand Hemophilia Foundation stands beside patients and their families, ensuring they receive essential treatment, care, and a dignified quality of life.';

  const ctaLabel = isRtl ? 'قهرمان باشید' : 'Be a hero';

  const scrollToNext = () => {
    const nextSection = document.getElementById('what-we-do');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ImagesSlider
      className="min-h-screen"
      images={heroImages}
      overlayClassName="bg-black/25"
    >
      <div className="absolute inset-0 z-50">
        <div className="h-full w-full px-4 md:px-12 pt-24 pb-4 md:pb-16 flex items-end md:items-start">
          <div
            className={`max-w-xl mt-0 md:mt-10 ${
              isRtl ? 'ml-auto text-right' : 'mr-auto text-left'
            }`}
          >
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 md:space-y-6 backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl px-5 py-5 md:px-10 md:py-8 shadow-2xl border border-white/20"
            >
              <motion.h1
                className={`text-2xl md:text-5xl lg:text-6xl font-bold leading-tight text-white ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h1>
              
              <motion.p
                className={`text-sm md:text-lg text-gray-200 leading-relaxed ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {subtitle}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className={`flex flex-col sm:flex-row gap-4 items-center ${
                  isRtl ? 'justify-end' : 'justify-start'
                }`}
              >
                <Link href={`/${locale}/donate`}>
                  <Button
                    size="lg"
                    className="text-base md:text-lg px-6 md:px-10 py-4 md:py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isRtl ? (
                      <>
                        <span>{ctaLabel}</span>
                        <Heart className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        <span>{ctaLabel}</span>
                      </>
                    )}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNext}
        >
          <div className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors">
            <span className="text-sm font-medium uppercase tracking-wider">{t('scroll_down')}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ImagesSlider>
  );
}
