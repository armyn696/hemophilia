'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, ArrowRight } from 'lucide-react';

export default function DonateSection() {
  const t = useTranslations('donate');
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('550');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fullName, setFullName] = useState('');

  const quickAmounts = [10, 25, 50, 100];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-20 bg-gradient-to-br from-[#F5F0EB] via-background to-[#E8D5C4] overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-2xl border-2 overflow-hidden bg-background/95 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h2>
              </div>

              {/* Donation Type Tabs */}
              <RadioGroup
                value={donationType}
                onValueChange={setDonationType}
                className="flex justify-center gap-2 mb-8"
              >
                <div className="flex gap-2 p-1 bg-muted rounded-full">
                  <Label
                    htmlFor="one-time"
                    className={`px-6 py-2 rounded-full cursor-pointer transition-all ${
                      donationType === 'one-time'
                        ? 'bg-background shadow-md font-semibold'
                        : 'hover:bg-background/50'
                    }`}
                  >
                    <RadioGroupItem value="one-time" id="one-time" className="sr-only" />
                    {t('one_time')}
                  </Label>
                  <Label
                    htmlFor="monthly"
                    className={`px-6 py-2 rounded-full cursor-pointer transition-all flex items-center gap-2 ${
                      donationType === 'monthly'
                        ? 'bg-primary text-primary-foreground shadow-md font-semibold'
                        : 'hover:bg-background/50'
                    }`}
                  >
                    <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                    {t('monthly')} 💚
                  </Label>
                </div>
              </RadioGroup>

              {/* Amount Input */}
              <div className="mb-6">
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-3xl font-bold text-center py-8 pr-24 border-2 focus:border-primary"
                    placeholder="0"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <select className="text-lg font-semibold bg-transparent border-none outline-none cursor-pointer">
                      <option value="USD">{locale === 'fa' ? t('currency') : 'USD'}</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant={amount === quickAmount.toString() ? 'default' : 'outline'}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-6 font-semibold"
                  >
                    {locale === 'fa' ? `${quickAmount.toLocaleString('fa-IR')}` : `$${quickAmount}`}
                  </Button>
                ))}
              </div>

              {/* Anonymous Donation Checkbox */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                  />
                  <Label
                    htmlFor="anonymous"
                    className="text-base font-medium cursor-pointer flex-1"
                  >
                    {t('donate_anonymously')}
                  </Label>
                </div>
              </div>

              {/* Full Name Input */}
              {!isAnonymous && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Input
                    type="text"
                    placeholder={t('full_name')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="py-6 text-base"
                  />
                </motion.div>
              )}

              {/* Terms Checkbox */}
              <div className="mb-8">
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium cursor-pointer leading-relaxed"
                  >
                    {t('agree_terms')}
                  </Label>
                </div>
              </div>

              {/* Donate Button and QR Code */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 py-6 text-lg font-semibold rounded-full"
                  disabled={!agreedToTerms}
                >
                  {t('donate_button')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="sm:w-auto py-6 px-6 rounded-full border-2"
                >
                  {t('qr_code')}
                </Button>
              </div>

              {/* Trouble with payment link */}
              <div className="text-center mt-6">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  {t('payment_trouble')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
