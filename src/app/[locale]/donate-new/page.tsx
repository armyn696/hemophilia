'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, CreditCard, CheckCircle2, UserX, ArrowLeft } from 'lucide-react';
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
<div className="w-full lg:w-1/2 h-full overflow-hidden flex items-center justify-center bg-[#FAF9F6] p-4 lg:p-10">
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,107,53,0.1)] p-6 lg:p-8 relative"
>
{/* Back to Home - Absolute */}
<div className="absolute top-6 left-8">
<Link
href={`/${locale}`}
className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-800 transition-colors"
>
                  {isRtl ? (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      <span>بازگشت</span>
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </>
                  )}

</Link>
</div>

<div className="space-y-4 lg:space-y-6">
{/* Logo & Header */}
<div className="text-center space-y-2">
<div className="flex justify-center pt-4">
<div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8F65] rounded-xl flex items-center justify-center shadow-lg">
<Heart className="w-6 h-6 text-white" fill="white" />
</div>
</div>
<div>
<h1 className="text-2xl font-bold text-gray-900">
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
<div className="space-y-1.5">

                <Label className="text-gray-700 font-medium text-xs">
                  {locale === 'fa' ? 'مبلغ کمک (تومان)' : 'Donation Amount'}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {donationAmounts.slice(0, 6).map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-medium transition-all border-2 ${
                        selectedAmount === amount
                          ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder={locale === 'fa' ? 'مبلغ دلخواه...' : 'Custom amount...'}
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="h-10 text-center text-base border-2 border-gray-200 focus:border-[#FF6B35] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Anonymous Donation Toggle */}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isAnonymous ? 'bg-[#FF6B35]/10' : 'bg-gray-200'}`}>
                    <UserX className={`w-4 h-4 ${isAnonymous ? 'text-[#FF6B35]' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-xs">
                      {locale === 'fa' ? 'کمک ناشناس' : 'Anonymous Donation'}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {locale === 'fa' ? 'اطلاعات شما نمایش داده نمی‌شود' : 'Your info will be hidden'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  className="scale-75 data-[state=checked]:bg-[#FF6B35]"
                />
              </div>

              {/* Donor Info - Hidden when anonymous */}
              {!isAnonymous && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-gray-700 font-medium text-xs">
                      {locale === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                    </Label>
                    <Input
                      type="text"
                      placeholder={locale === 'fa' ? 'نام شما...' : 'Your name...'}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="h-9 text-sm border-2 border-gray-200 focus:border-[#FF6B35] rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium text-xs">
                      {locale === 'fa' ? 'شماره تماس' : 'Phone Number'}
                    </Label>
                    <Input
                      type="tel"
                      placeholder={locale === 'fa' ? '09123456789' : '+1234567890'}
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="h-9 text-sm border-2 border-gray-200 focus:border-[#FF6B35] rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium text-xs">
                      {locale === 'fa' ? 'ایمیل (اختیاری)' : 'Email (optional)'}
                    </Label>
                    <Input
                      type="email"
                      placeholder={locale === 'fa' ? 'email@example.com' : 'email@example.com'}
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="h-9 text-sm border-2 border-gray-200 focus:border-[#FF6B35] rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#FF6B35] to-[#FF8F65] hover:from-[#E55A2B] hover:to-[#FF6B35] rounded-xl shadow-lg shadow-orange-100"
                disabled={getFinalAmount() === 0}
              >
                <CreditCard className="w-4 h-4 ml-2" />
                {locale === 'fa' 
                  ? `پرداخت ${formatCurrency(getFinalAmount())} تومان`
                  : `Donate ${formatCurrency(getFinalAmount())}`
                }
              </Button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 text-gray-400 text-[10px]">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{locale === 'fa' ? 'پرداخت امن' : 'Secure'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{locale === 'fa' ? 'رسید آنلاین' : 'Receipt'}</span>
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
              {locale === 'fa' ? '— کانون هموفیلی خراسان جنوبی' : '— South Khorasan Hemophilia Society'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
