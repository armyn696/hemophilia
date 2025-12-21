'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, CreditCard, CheckCircle2, UserX, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

const donationAmounts = [50000, 100000, 250000, 500000, 1000000];

export default function DonatePage() {
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
      <div className="w-full lg:w-1/2 h-full overflow-hidden flex items-center justify-center bg-[#FDFBF7] p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 p-8 lg:p-10 relative"
        >
          {/* Back to Home - Absolute */}
          <div className={`absolute top-6 ${isRtl ? 'right-8' : 'left-8'}`}>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6B35] transition-colors group"
            >
              {isRtl ? (
                <>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">بازگشت</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Back</span>
                </>
              )}
            </Link>
          </div>

          <div className="space-y-6">
            {/* Logo & Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#FF8F65] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                  <Heart className="w-7 h-7 text-white" fill="white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {locale === 'fa' ? 'کمک به کانون هموفیلی' : 'Support Hemophilia Society'}
                </h1>
                <p className="text-gray-500 text-sm">
                  {locale === 'fa' 
                    ? 'با کمک شما، زندگی بیماران را تغییر می‌دهیم'
                    : 'Your donation changes lives'}
                </p>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <Label className="text-gray-800 font-semibold text-sm">
                  {locale === 'fa' ? 'مبلغ کمک (تومان)' : 'Donation Amount'}
                </Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {donationAmounts.slice(0, 5).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border-2 ${
                      selectedAmount === amount
                        ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
                        : 'border-gray-50 bg-gray-50/50 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
                <div className="col-span-1">
                  <Input
                    type="number"
                    placeholder={locale === 'fa' ? 'دلخواه...' : 'Custom...'}
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="h-[38px] text-center text-xs font-bold border-2 border-gray-50 bg-gray-50/50 focus:border-[#FF6B35] rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Anonymous Donation Toggle */}
            <div className="flex items-center justify-between p-3 bg-neutral-50/80 rounded-2xl border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isAnonymous ? 'bg-[#FF6B35]/10' : 'bg-white shadow-sm'}`}>
                  <UserX className={`w-4 h-4 ${isAnonymous ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-[13px]">
                    {locale === 'fa' ? 'کمک به صورت ناشناس' : 'Donate Anonymously'}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {locale === 'fa' ? 'هویت شما محفوظ می‌ماند' : 'Your identity will be protected'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="data-[state=checked]:bg-[#FF6B35]"
              />
            </div>

            {/* Donor Info - Simplified grid */}
            {!isAnonymous && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Input
                    type="text"
                    placeholder={locale === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="h-11 bg-gray-50/30 border-gray-100 focus:border-[#FF6B35] rounded-xl px-4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="tel"
                    placeholder={locale === 'fa' ? 'شماره تماس' : 'Phone'}
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="h-11 bg-gray-50/30 border-gray-100 focus:border-[#FF6B35] rounded-xl px-4"
                  />
                  <Input
                    type="email"
                    placeholder={locale === 'fa' ? 'ایمیل (اختیاری)' : 'Email'}
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="h-11 bg-gray-50/30 border-gray-100 focus:border-[#FF6B35] rounded-xl px-4"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF8F65] hover:opacity-90 rounded-2xl shadow-[0_10px_25px_-5px_rgba(255,107,53,0.4)] transition-all active:scale-[0.98]"
                disabled={getFinalAmount() === 0}
              >
                <CreditCard className="w-5 h-5 ml-2" />
                {locale === 'fa' 
                  ? `پرداخت ${formatCurrency(getFinalAmount())} تومان`
                  : `Donate ${formatCurrency(getFinalAmount())}`
                }
              </Button>
            </div>

            {/* Small Footer Trust */}
            <div className="flex items-center justify-center gap-6 pt-1">
              <div className="flex items-center gap-1.5 grayscale opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] font-medium text-gray-500 tracking-wider uppercase">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-medium text-gray-500 tracking-wider uppercase">Direct Impact</span>
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
