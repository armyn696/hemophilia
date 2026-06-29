'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { useLocale } from 'next-intl';
import { HeartPulse, HandHeart, GraduationCap, Megaphone, Loader2 } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { serviceSections, type ServiceSectionContent, type ServiceSectionKey } from '@/lib/services';

const icons: Record<ServiceSectionKey, ComponentType<{ className?: string }>> = {
    medical: HeartPulse,
    support: HandHeart,
    education: GraduationCap,
    awareness: Megaphone,
};

export default function ServicesPage() {
    const locale = useLocale();
    const isRtl = locale === 'fa';
    const [sections, setSections] = useState<ServiceSectionContent[]>(serviceSections);
    const [activeKey, setActiveKey] = useState<ServiceSectionKey>('medical');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadServices() {
            try {
                const res = await fetch('/api/services');
                if (!res.ok) throw new Error('Failed to load services');
                const data = await res.json();
                setSections(data);
                if (data[0]?.key) setActiveKey(data[0].key);
            } catch {
                setSections(serviceSections);
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navigation />

            <main className="flex-1 pt-[73px]">
                <section className="bg-[#FDF2F4] border-b border-red-100">
                    <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16">
                        <div className={`max-w-3xl ${isRtl ? 'text-right ml-auto' : 'text-left mr-auto'}`}>
                            <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-bold text-[#A91D3A] shadow-sm">
                                {isRtl ? 'خدمات کانون' : 'Our Services'}
                            </span>
                            <h1 className="mt-5 text-3xl md:text-5xl font-black leading-tight text-[#2C3E50]">
                                {isRtl ? 'خدمات کانون هموفیلی خراسان جنوبی' : 'South Khorasan Hemophilia Services'}
                            </h1>
                            <p className="mt-4 text-base md:text-lg leading-8 text-gray-600">
                                {isRtl
                                    ? 'در این بخش می‌توانید خدمات کانون را بر اساس حوزه درمانی، حمایتی، آموزشی و آگاهی‌بخشی مشاهده کنید.'
                                    : 'Explore services by medical care, support, education, and awareness categories.'}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-10 md:py-14">
                    <div className="container mx-auto px-4 max-w-7xl">
                        {loading ? (
                            <div className="flex justify-center py-24">
                                <Loader2 className="w-8 h-8 animate-spin text-[#A91D3A]" />
                            </div>
                        ) : (
                            <Tabs value={activeKey} onValueChange={(value) => setActiveKey(value as ServiceSectionKey)} dir={isRtl ? 'rtl' : 'ltr'}>
                                <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-4">
                                    {sections.map((section) => {
                                        const Icon = icons[section.key];
                                        return (
                                            <TabsTrigger
                                                key={section.key}
                                                value={section.key}
                                                className="h-auto rounded-xl border border-red-100 bg-white px-3 py-4 text-sm font-bold shadow-sm data-[state=active]:border-[#A91D3A] data-[state=active]:bg-[#A91D3A] data-[state=active]:text-white md:text-base"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Icon className="w-5 h-5" />
                                                    {isRtl ? section.title : section.titleEn}
                                                </span>
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>

                                {sections.map((section) => {
                                    const Icon = icons[section.key];
                                    return (
                                        <TabsContent key={section.key} value={section.key} className="mt-8">
                                            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
                                                <aside className="rounded-2xl border border-red-100 bg-[#FDF2F4] p-6 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A91D3A] text-white">
                                                            <Icon className="w-6 h-6" />
                                                        </div>
                                                        <h2 className="text-2xl font-black text-[#2C3E50]">
                                                            {isRtl ? section.title : section.titleEn}
                                                        </h2>
                                                    </div>
                                                    <p className="mt-5 text-sm md:text-base leading-8 text-gray-600">
                                                        {isRtl ? section.summary : section.summaryEn}
                                                    </p>
                                                </aside>

                                                <article className={`rounded-2xl border border-neutral-100 bg-white p-6 md:p-8 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                                                    <h3 className="text-xl md:text-2xl font-black text-[#2C3E50]">
                                                        {isRtl ? 'جزئیات خدمت' : 'Service Details'}
                                                    </h3>
                                                    <p className="mt-5 whitespace-pre-line text-base leading-9 text-gray-600">
                                                        {isRtl ? section.content : section.contentEn}
                                                    </p>
                                                </article>
                                            </div>
                                        </TabsContent>
                                    );
                                })}
                            </Tabs>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
