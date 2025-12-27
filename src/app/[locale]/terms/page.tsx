'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import {
    ShieldCheck,
    Scale,
    AlertCircle,
    Landmark,
    HandCoins,
    HeartHandshake,
    Globe
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1] as const
        }
    }
};

export default function TermsPage() {
    const t = useTranslations('termsPage');
    const locale = useLocale();
    const isRtl = locale === 'fa';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-x-hidden">
            <Navigation />

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] opacity-60" />
            </div>

            <main className="flex-grow relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-16 md:pt-40 md:pb-20">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-primary/20 shadow-sm text-primary font-bold text-sm mb-8 hover:shadow-md transition-shadow cursor-default">
                                <ShieldCheck className="w-5 h-5" />
                                {isRtl ? 'قوانین و شفافیت' : 'Terms & Transparency'}
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight drop-shadow-sm">
                                {t('title')}
                            </h1>
                            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                                {isRtl
                                    ? 'چارچوب فعالیت‌های ما بر پایه شفافیت، صداقت و رعایت اصول اخلاقی استوار است.'
                                    : 'Our framework of activities is built upon transparency, honesty, and adherence to ethical principles.'}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Terms Cards Section */}
                <section className="pb-32">
                    <div className="container mx-auto px-4">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
                        >
                            {/* Rule 1: Non-Political - Style: Blue/Calm */}
                            <motion.div
                                variants={itemVariants}
                                className="group relative bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-blue-500/20 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15)] transition-all duration-500 overflow-hidden"
                            >
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Background Icon */}
                                <div className="absolute top-10 right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                                    <Scale className="w-48 h-48 text-blue-600" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200">
                                        <Globe className="w-10 h-10" />
                                    </div>

                                    <h2 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-blue-700 transition-colors">
                                        {isRtl ? 'عدم موضع‌گیری سیاسی' : 'Non-Political Stance'}
                                    </h2>

                                    <div className="prose prose-lg text-gray-500 leading-8 flex-grow">
                                        <p className="text-justify">{t('rule1')}</p>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center text-sm font-bold text-blue-600">
                                        <span className="bg-blue-50 px-3 py-1 rounded-lg">
                                            {isRtl ? 'اصل اول' : 'Article I'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Rule 2: Financial - Style: Primary/Trust */}
                            <motion.div
                                variants={itemVariants}
                                className="group relative bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(var(--primary),0.15)] transition-all duration-500 overflow-hidden"
                            >
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Background Icon */}
                                <div className="absolute top-10 right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-3">
                                    <HandCoins className="w-48 h-48 text-primary" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-20 h-20 rounded-3xl bg-secondary/20 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-red-200">
                                        <HeartHandshake className="w-10 h-10" />
                                    </div>

                                    <h2 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-primary transition-colors">
                                        {isRtl ? 'شفافیت مالی' : 'Financial Transparency'}
                                    </h2>

                                    <div className="prose prose-lg text-gray-500 leading-8 flex-grow">
                                        <p className="text-justify">{t('rule2')}</p>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center text-sm font-bold text-primary">
                                        <span className="bg-secondary/20 px-3 py-1 rounded-lg">
                                            {isRtl ? 'اصل دوم' : 'Article II'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Footer Notification */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mt-24 text-center max-w-3xl mx-auto"
                        >
                            <div className="relative overflow-hidden bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="absolute left-0 top-0 w-1 h-full bg-primary" />
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-primary animate-pulse">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify md:text-right">
                                        {isRtl
                                            ? 'فعالیت در این وب‌سایت به منزله پذیرش دقیق این قوانین است. ما خود را موظف می‌دانیم هرگونه تغییر در این مفاد را از طریق همین صفحه به اطلاع شما برسانیم.'
                                            : 'Activity on this website constitutes strict acceptance of these terms. We are obliged to inform you of any changes to these provisions through this page.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
