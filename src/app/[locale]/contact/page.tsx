'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, ArrowRight, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F3] dark:bg-neutral-950">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-16 max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-[#A91D3A] font-bold text-sm md:text-base uppercase tracking-wider mb-3"
            >
              {t('title')}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight"
            >
              {t('form_title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
            >
              {t('address_text')}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Contact Form */}
            <motion.div 
              className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">
                {isRtl ? 'بیایید درباره پروژه‌تان صحبت کنیم' : "Let's Talk About Your Project"}
              </h2>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t('name')}
                  </Label>
                  <Input 
                    id="name" 
                    placeholder={isRtl ? "نام کامل خود را وارد کنید" : "Your full name"}
                    className="h-14 rounded-xl bg-neutral-50 border-neutral-200 focus:border-[#A91D3A] focus:ring-[#A91D3A] transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t('email_label')}
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={isRtl ? "ما به شما پاسخ خواهیم داد" : "We'll get back to you here"}
                    className="h-14 rounded-xl bg-neutral-50 border-neutral-200 focus:border-[#A91D3A] focus:ring-[#A91D3A] transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {isRtl ? 'نام شرکت' : 'Company Name'}
                  </Label>
                  <Input 
                    id="company" 
                    placeholder={isRtl ? "نماینده کدام مجموعه هستید؟" : "Let us know who you represent"}
                    className="h-14 rounded-xl bg-neutral-50 border-neutral-200 focus:border-[#A91D3A] focus:ring-[#A91D3A] transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {isRtl ? 'موضوع' : 'Subject'}
                  </Label>
                  <Input 
                    id="subject" 
                    placeholder={isRtl ? "موضوع پیام چیست؟" : "What's this about?"}
                    className="h-14 rounded-xl bg-neutral-50 border-neutral-200 focus:border-[#A91D3A] focus:ring-[#A91D3A] transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t('message')}
                  </Label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A91D3A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 transition-all resize-none"
                    placeholder={isRtl ? "به ما بگویید چگونه می‌توانیم کمک کنیم" : "Tell us how we can help"}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#A91D3A] hover:bg-[#e55a2b] text-white h-14 rounded-xl text-base font-semibold shadow-lg shadow-red-200/50 dark:shadow-none transition-all duration-300 mt-4"
                >
                  {t('send')}
                </Button>
              </form>
            </motion.div>

            {/* Right Column: Info & Map */}
            <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-12 h-full">
              {/* Direct Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                  {isRtl ? 'ارتباط مستقیم را ترجیح می‌دهید؟' : 'Prefer a Direct Approach?'}
                </h3>
                <div className="space-y-6">
                  <a href="tel:+985632212999" className="flex items-center gap-4 text-neutral-600 dark:text-neutral-300 hover:text-[#A91D3A] transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#A91D3A] group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-lg" dir="ltr">056-32212999</span>
                  </a>
                  <a href="mailto:hemophiliaskh@gmail.com" className="flex items-center gap-4 text-neutral-600 dark:text-neutral-300 hover:text-[#A91D3A] transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#A91D3A] group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-lg">hemophiliaskh@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-300">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#A91D3A]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-lg">
                      {isRtl ? 'شنبه تا پنج شنبه، ۸ صبح تا ۱۴' : 'Saturday to Thursday, 8 AM - 2 PM'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative flex-1 w-full rounded-[2rem] overflow-hidden shadow-lg min-h-[300px]"
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3296.8!2d59.2211!3d32.8661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f30e0f5b6b6b6b6%3A0x1234567890abcdef!2sMotahhari%20St%2C%20Birjand%2C%20South%20Khorasan%20Province!5e0!3m2!1sen!2s!4v1716988242085!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
