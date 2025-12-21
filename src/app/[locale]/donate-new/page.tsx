'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, CreditCard, CheckCircle2, UserX } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

const donationAmounts = [50000, 100000, 250000, 500000, 1000000];

export default function DonateNewPage() {
  const t = useTranslations('donate');
  const locale = useLocale();
  const isRtl = locale === 'fa';

  const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(amount);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (customAmount) return parseInt(customAmount) || 0;
    return selectedAmount || 0;
  };

  return (
    <div className={`h-screen flex overflow-hidden ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 h-full overflow-hidden flex items-center justify-center bg-[#FDF8F1] p-4 lg:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-orange-900/5 p-6 lg:p-8 relative"
        >
          {/* Back to Home - Absolute */}
          <div className={`absolute top-6 ${isRtl ? 'right-8' : 'left-8'}`}>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-800 transition-colors"
            >
              <Heart className="w-3 h-3" />
              <span>{locale === 'fa' ? 'صفحه اصلی' : 'Home'}</span>
            </Link>
          </div>
          
          <div className="space-y-4 lg:space-y-6">
            {/* Logo & Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8F65] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
              </div>
              <div className="pt-2">
                <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
                  {locale === 'fa' ? 'کمک به کانون هموفیلی' : 'Support Hemophilia'}
                </h1>
                <p className="text-gray-500 text-[11px] lg:text-xs">
                  {locale === 'fa' 
                    ? 'با کمک شما، زندگی بیماران را تغییر می‌دهیم'
                    : 'Your donation changes lives'}
                </p>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
              <Label className="text-gray-900 font-bold text-xs px-1">
                {locale === 'fa' ? 'مبلغ کمک (تومان)' : 'Donation Amount'}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {donationAmounts.slice(0, 3).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-2 rounded-xl text-[11px] font-bold transition-all border-2 ${
                      selectedAmount === amount
                        ? 'border-[#FF6B35] bg-orange-50/50 text-[#FF6B35]'
                        : 'border-gray-50 bg-gray-50/50 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {donationAmounts.slice(3, 5).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-2 rounded-xl text-[11px] font-bold transition-all border-2 ${
                      selectedAmount === amount
                        ? 'border-[#FF6B35] bg-orange-50/50 text-[#FF6B35]'
                        : 'border-gray-50 bg-gray-50/50 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                placeholder={locale === 'fa' ? 'مبلغ دلخواه...' : 'Custom...'}
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="h-10 text-center text-sm border-none bg-gray-50/80 focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/20 rounded-xl transition-all"
              />
            </div>

            {/* Anonymous Donation Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isAnonymous ? 'bg-[#FF6B35]/10' : 'bg-white shadow-sm'}`}>
                  <UserX className={`w-4 h-4 ${isAnonymous ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xs">
                    {locale === 'fa' ? 'کمک ناشناس' : 'Anonymous'}
                  </p>
                  <p className="text-[10px] text-gray-400 opacity-80">
                    {locale === 'fa' ? 'اطلاعات شما پنهان می‌ماند' : 'Your info stays hidden'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="scale-90 data-[state=checked]:bg-[#FF6B35]"
              />
            </div>

            {/* Donor Info */}
            {!isAnonymous && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder={locale === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="h-10 text-xs border-none bg-gray-50/80 focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/20 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="tel"
                    placeholder={locale === 'fa' ? 'شماره تماس' : 'Phone'}
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="h-10 text-xs border-none bg-gray-50/80 focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/20 rounded-xl"
                  />
                  <Input
                    type="email"
                    placeholder={locale === 'fa' ? 'ایمیل (اختیاری)' : 'Email'}
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="h-10 text-xs border-none bg-gray-50/80 focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/20 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                className="w-full h-12 text-sm font-bold bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-2xl shadow-xl shadow-orange-200 transition-all hover:-translate-y-0.5"
                disabled={getFinalAmount() === 0}
              >
                <CreditCard className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                {locale === 'fa' 
                  ? `پرداخت ${formatCurrency(getFinalAmount())} تومان`
                  : `Donate ${formatCurrency(getFinalAmount())}`
                }
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-gray-300 text-[10px] pt-1">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{locale === 'fa' ? 'امن' : 'Secure'}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{locale === 'fa' ? 'آنلاین' : 'Receipt'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
  
        {/* Right Side - Image */}
        <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/images/donate-hero.png"
          alt="Donation"
          fill
          className="object-cover"
          priority
        />
        {/* Liquid Glass Quote Card */}
        <div className="absolute bottom-12 right-12 flex justify-end">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl max-w-md">
            <p className="text-xl font-light text-white leading-relaxed mb-3 text-right">
              {locale === 'fa' 
                ? '"کمک شما، امید را در دل بیماران زنده نگه می‌دارد"'
                : '"Your support keeps hope alive in patients\' hearts"'
              }
            </p>
            <p className="text-white/70 text-sm text-right">
              {locale === 'fa' ? '— کانون هموفیلی بیرجند' : '— Hemophilia Society'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
