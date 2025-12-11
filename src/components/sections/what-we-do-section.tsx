'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function WhatWeDoSection() {
  const t = useTranslations('whatwedo');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getCardAnimation = (index: number) => ({
    initial: { opacity: 0, y: 50 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    transition: { delay: index * 0.2, duration: 0.6 }
  });

  const services = [
    {
      iconPath: '/icons/patient-registration.svg',
      title: t('services.patient_care.title', { defaultValue: 'Patient Registration' }),
      description: t('services.patient_care.description', { defaultValue: 'Register and manage patient information for comprehensive care.' }),
      color: '#3B82F6' // Blue
    },
    {
      iconPath: '/icons/medical-support.svg',
      title: t('services.medical.title', { defaultValue: 'Medical Support' }),
      description: t('services.medical.description', { defaultValue: 'Providing medications and specialized medical services.' }),
      color: '#EF4444' // Red
    },
    {
      iconPath: '/icons/education.svg',
      title: t('services.education.title', { defaultValue: 'Education' }),
      description: t('services.education.description', { defaultValue: 'Educational workshops for patients and families.' }),
      color: '#10B981' // Green
    },
    {
      iconPath: '/icons/support-services.svg',
      title: t('services.support.title', { defaultValue: 'Support Services' }),
      description: t('services.support.description', { defaultValue: 'Psychological and social counseling for patients.' }),
      color: '#F59E0B' // Orange
    },
  ];

  return (
    <section 
      id="what-we-do"
      ref={ref}
      className="relative py-20 bg-[#FFF8F3]"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-6xl mx-auto">
          {services.map((service, index) => {
            return (
              <motion.div
                key={index}
                {...getCardAnimation(index)}
                className="group text-center"
              >
                <div className="space-y-3">
                  {/* Icon Container */}
                  <div className="flex justify-center">
                    <div 
                      className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <Image
                        src={service.iconPath}
                        alt={service.title}
                        width={48}
                        height={48}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 
                    className="text-base md:text-lg font-bold"
                    style={{ color: service.color }}
                  >
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed px-2">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
