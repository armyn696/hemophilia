'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProgramsSection() {
  const t = useTranslations('programs');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const programs = [
    {
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070',
      badge: t('program1.badge', { defaultValue: 'HEALTH' }),
      title: t('program1.title', { defaultValue: 'Medical Treatment Support' }),
      description: t('program1.description', { defaultValue: 'Providing essential medications and medical supplies for hemophilia patients.' }),
      raised: 5670000,
      goal: 8000000,
      badgeColor: '#FF6B35'
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032',
      badge: t('program2.badge', { defaultValue: 'HEALTH' }),
      title: t('program2.title', { defaultValue: 'Patient Education Programs' }),
      description: t('program2.description', { defaultValue: 'Educational workshops and training sessions for patients and families.' }),
      raised: 12500000,
      goal: 15000000,
      badgeColor: '#FF6B35'
    },
    {
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070',
      badge: t('program3.badge', { defaultValue: 'HEALTH' }),
      title: t('program3.title', { defaultValue: 'Psychological Support Services' }),
      description: t('program3.description', { defaultValue: 'Counseling and mental health support for patients and their families.' }),
      raised: 8940000,
      goal: 12000000,
      badgeColor: '#FF6B35'
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section 
      ref={ref}
      className="relative py-20 bg-[#FFF8F3]"
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
            {t('badge', { defaultValue: 'Support Our Programs' })}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] mt-4">
            {t('title', { defaultValue: 'They Need Helping' })}
          </h2>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <Badge 
                  className="text-xs font-semibold px-3 py-1"
                  style={{ backgroundColor: program.badgeColor, color: 'white' }}
                >
                  {program.badge}
                </Badge>

                <h3 className="text-xl font-bold text-[#2C3E50]">
                  {program.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {program.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(program.raised / program.goal) * 100}%`,
                        backgroundColor: program.badgeColor
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2C3E50] font-bold">
                      Raised: {formatCurrency(program.raised)}
                    </span>
                    <span className="text-gray-500">
                      Goal: {formatCurrency(program.goal)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
