'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AboutSection() {
  const t = useTranslations('about');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section 
      ref={ref}
      className="relative py-20 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
                alt="Hemophilia patients"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FF6B35] rounded-full opacity-20 blur-2xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-block">
              <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
                {t('badge', { defaultValue: 'About Us' })}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight">
              {t('title', { defaultValue: 'Every Patient Deserves a Better Future!' })}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('description', { defaultValue: 'The Birjand Hemophilia Society has been working since 1967 to improve the quality of life for hemophilia patients and their families through medical, educational, and support services.' })}
            </p>

            <p className="text-gray-600 leading-relaxed">
              {t('mission', { defaultValue: 'We provide comprehensive care including medications, counseling, and educational programs to ensure patients live healthy and fulfilling lives.' })}
            </p>

            <Button 
              size="lg"
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {t('cta', { defaultValue: 'More About Us' })}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
