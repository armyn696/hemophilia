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
      <div className="w-full lg:w-1/2 h-full overflow-hidden flex items-center justify-center bg-[#FDFBF7] p-4 lg:p-8 relative">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 p-8 lg:p-10 relative z-10"
        >
          {/* Back to Home - Absolute */}
          <div className={`absolute top-8 ${isRtl ? 'right-10' : 'left-10'}`}>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors group"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="w-4 h-4 ml-1" />
                  <span className="text-xs font-medium">بازگشت به صفحه اصلی</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Back to Home</span>
                </>
              )}
            </Link>
          </div>

          <div className="space-y-6 pt-4">
            {/* Logo & Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8F65] rounded-[1.25rem] flex items-center justify-center shadow-lg transform -rotate-3">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {locale === 'fa' ? 'کمک به کانون هموفیلی' : 'Support Hemophilia Society'}
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  {locale === 'fa' 
                    ? 'با کمک شما، زندگی بیماران را تغییر می‌دهیم'
                    : 'Your donation changes lives'}
                </p>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <Label className="text-gray-800 font-bold text-sm">
                  {locale === 'fa' ? 'مبلغ کمک (تومان)' : 'Donation Amount (Toman)'}
                </Label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {donationAmounts.slice(0, 3).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 px-1 rounded-2xl text-[13px] font-black transition-all border-2 ${
                      selectedAmount === amount
                        ? 'border-[#FF6B35] bg-white text-[#FF6B35] shadow-sm'
                        : 'border-gray-50 bg-gray-50/50 hover:border-gray-100 text-gray-600'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {donationAmounts.slice(3, 5).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 px-1 rounded-2xl text-[13px] font-black transition-all border-2 ${
                      selectedAmount === amount
                        ? 'border-[#FF6B35] bg-white text-[#FF6B35] shadow-sm'
                        : 'border-gray-50 bg-gray-50/50 hover:border-gray-100 text-gray-600'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
                <div className="col-span-1">
                  <Input
                    type="number"
                    placeholder={locale === 'fa' ? 'مبلغ دلخواه...' : 'Custom...'}
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="h-[46px] text-center text-[13px] font-black border-2 border-gray-50 bg-gray-50/50 focus:border-[#FF6B35] rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Anonymous Donation Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-[1.5rem] border border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl transition-colors ${isAnonymous ? 'bg-[#FF6B35]/10' : 'bg-white shadow-sm border border-gray-100'}`}>
                  <UserX className={`w-5 h-5 ${isAnonymous ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {locale === 'fa' ? 'کمک ناشناس' : 'Anonymous'}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium tracking-tight">
                    {locale === 'fa' ? 'نام شما نمایش داده نمی‌شود' : 'Your name won\'t be shown'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="data-[state=checked]:bg-[#FF6B35]"
              />
            </div>

            {/* Donor Info */}
            {!isAnonymous && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-bold text-sm px-1">
                    {locale === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                  </Label>
                  <Input
                    type="text"
                    placeholder={locale === 'fa' ? 'نام شما...' : 'Your name...'}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="h-12 bg-white border-2 border-gray-100 focus:border-[#FF6B35] rounded-2xl px-5 text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-800 font-bold text-sm px-1">
                      {locale === 'fa' ? 'شماره تماس' : 'Phone'}
                    </Label>
                    <Input
                      type="tel"
                      placeholder="09123456789"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="h-12 bg-white border-2 border-gray-100 focus:border-[#FF6B35] rounded-2xl px-5 text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-800 font-bold text-sm px-1">
                      {locale === 'fa' ? 'ایمیل (اختیاری)' : 'Email'}
                    </Label>
                    <Input
                      type="email"
                      placeholder="Email@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="h-12 bg-white border-2 border-gray-100 focus:border-[#FF6B35] rounded-2xl px-5 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                className="w-full h-[60px] text-lg font-black bg-[#FF6B35] hover:bg-[#FF8F65] text-white rounded-2xl shadow-[0_12px_30px_-10px_rgba(255,107,53,0.5)] transition-all active:scale-[0.98] border-b-4 border-black/10"
                disabled={getFinalAmount() === 0}
              >
                <CreditCard className="w-5 h-5 ml-2" />
                {locale === 'fa' 
                  ? `پرداخت ${formatCurrency(getFinalAmount())} تومان`
                  : `Pay ${formatCurrency(getFinalAmount())} Toman`
                }
              </Button>
            </div>

            {/* Small Footer Trust */}
            <div className="flex items-center justify-center gap-8 pt-2">
              <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all opacity-40 hover:opacity-100">
                <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Direct Impact</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all opacity-40 hover:opacity-100">
                <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Secure Payment</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
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
