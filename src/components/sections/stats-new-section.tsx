'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function StatsNewSection() {
  const t = useTranslations('stats');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    {
      number: '30+',
      label: t('provinces', { defaultValue: 'Provinces' }),
    },
    {
      number: '15000+',
      label: t('patients', { defaultValue: 'Patients' }),
    },
  ];

  return (
    <section 
      ref={ref}
      className="relative py-20 bg-gradient-to-b from-[#FFF8F3] to-white"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block">
              <span className="text-[#A91D3A] font-semibold text-sm uppercase tracking-wider">
                {t('badge', { defaultValue: 'Our Impact' })}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight">
              {t('title', { defaultValue: 'How We Support Hemophilia Patients' })}
            </h2>
            
            <p className="text-gray-600 text-base leading-relaxed">
              {t('description', { defaultValue: 'We have been providing comprehensive care and support to hemophilia patients in Birjand region for over 50 years, ensuring access to medications, education, and counseling services.' })}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="text-4xl md:text-5xl font-bold text-[#2C3E50]">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2078"
                alt="Healthcare support"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-[#A91D3A] rounded-full opacity-30" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
