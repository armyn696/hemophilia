'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

export default function DonateNewSection() {
  const t = useTranslations('donate');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const [amount, setAmount] = useState('100');
  const quickAmounts = [10, 25, 50, 100, 250];

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <div className="inline-block">
            <span className="text-[#A91D3A] font-semibold text-sm uppercase tracking-wider">
              {t('badge', { defaultValue: 'Donation' })}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('title_new', { defaultValue: 'Building a Better Future' })}
          </h2>

          {/* Amount Input with Quick Buttons */}
          <div className="space-y-6">
            {/* Custom Amount Input */}
            <div className="flex justify-center">
              <div className="relative max-w-xs w-full">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 pr-4 py-6 text-2xl font-bold text-center bg-white/95 border-2 border-white rounded-full shadow-lg focus:ring-4 focus:ring-[#A91D3A]/30"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  onClick={() => setAmount(String(quickAmount))}
                  variant={amount === String(quickAmount) ? 'default' : 'outline'}
                  className={`px-8 py-6 rounded-full font-semibold text-lg transition-all ${
                    amount === String(quickAmount)
                      ? 'bg-white text-[#2C3E50] hover:bg-white/90'
                      : 'bg-white/10 text-white border-2 border-white hover:bg-white hover:text-[#2C3E50]'
                  }`}
                >
                  ${quickAmount}
                </Button>
              ))}
              <Button
                onClick={() => setAmount('')}
                variant="outline"
                className="px-8 py-6 rounded-full font-semibold text-lg bg-white/10 text-white border-2 border-white hover:bg-white hover:text-[#2C3E50] transition-all"
              >
                {t('custom_amount', { defaultValue: 'Custom Amount' })}
              </Button>
            </div>

            {/* Donate Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="px-12 py-7 bg-[#A91D3A] hover:bg-[#A91D3A]/90 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-[#A91D3A]/50 transition-all"
              >
                {t('donate_button', { defaultValue: 'Donate Now' })}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
