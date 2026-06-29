'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import {
    BookOpen,
    Stethoscope,
    Users,
    Award,
    HeartHandshake,
    Megaphone,
    History,
    Target,
    Heart,
    Quote,
    CreditCard,
    Building2,
    CalendarDays
} from 'lucide-react';
import Image from 'next/image';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function AboutPage() {
    const t = useTranslations('aboutPage');
    const locale = useLocale();
    const isRtl = locale === 'fa';

    const activities = [
        { icon: BookOpen, title: t('activity1.title'), desc: t('activity1.desc') },
        { icon: Stethoscope, title: t('activity2.title'), desc: t('activity2.desc') },
        { icon: Users, title: t('activity3.title'), desc: t('activity3.desc') },
        { icon: Award, title: t('activity4.title'), desc: t('activity4.desc') },
        { icon: HeartHandshake, title: t('activity5.title'), desc: t('activity5.desc') },
        { icon: Megaphone, title: t('activity6.title'), desc: t('activity6.desc') },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        <Image
                            src="/images/hero-bg.webp"
                            alt="About Us Hero"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="container mx-auto px-4 relative z-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            /* ADJUST THIS VALUE TO MOVE TITLE UP/DOWN (e.g., translate-y-32) */
                            className="transform translate-y-14 pt-10"
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
                                {t('title')}
                            </h1>
                            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
                        </motion.div>
                    </div>
                </section>

                {/* Introduction & History */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                className="space-y-8"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                    <History className="w-4 h-4" />
                                    {t('history_title')}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                    {isRtl ? 'بیش از دو دهه خدمت صادقانه' : 'Over Two Decades of Dedicated Service'}
                                </h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                                    <p>{t('history_p1')}</p>
                                    <p>{t('history_p2')}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
                                <Image
                                    src="/images/hero-slide-2.jpg"
                                    alt="Organization History"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mission & Purpose */}
                <section className="py-24 bg-secondary/30 relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="max-w-4xl mx-auto text-center space-y-12"
                        >
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-bold text-sm mx-auto shadow-lg">
                                    <Target className="w-4 h-4" />
                                    {t('mission_title')}
                                </div>
                                <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed italic">
                                    "{t('mission_text')}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 transition-all hover:shadow-md">
                                    <p className="text-gray-700 leading-relaxed">
                                        {t('nature_text')}
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 transition-all hover:shadow-md">
                                    <p className="text-gray-700 leading-relaxed">
                                        {t('nature_team')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Activities Grid */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('activities_title')}</h2>
                            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <activity.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{activity.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Quote Section */}
                <section className="py-20 bg-primary text-white text-center overflow-hidden">
                    <div className="container mx-auto px-4 relative">
                        <Quote className="w-16 h-16 text-white/10 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        <motion.p
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-4xl font-bold leading-relaxed max-w-3xl mx-auto"
                        >
                            {t('quote')}
                        </motion.p>
                    </div>
                </section>

                {/* Donation & Bank Details */}
                <section className="py-24 bg-secondary/20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                            <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-gray-900">{t('donation_title')}</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {t('donation_text')}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-800 font-medium italic">
                                        {t('closing')}
                                    </p>
                                    <div className="text-primary font-black text-2xl">
                                        {t('footer_quote')}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 bg-gray-50 p-10 md:p-16 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-center">
                                <div className="bg-white p-8 rounded-3xl shadow-lg border border-primary/5 space-y-6">
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('bank_info.account_type')}</div>
                                            <div className="text-xl font-black text-gray-900">{t('bank_info.bank_name')}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>{isRtl ? 'به نام:' : 'Beneficiary:'}</span>
                                            </div>
                                            <div className="font-bold text-gray-900">{t('bank_info.account_name')}</div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Building2 className="w-4 h-4" />
                                                <span>{isRtl ? 'شماره حساب:' : 'Account Number:'}</span>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl text-center text-3xl font-black tracking-[0.2em] text-primary">
                                                {t('bank_info.account_number')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
