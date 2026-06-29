'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Save, Loader2, HeartPulse, HandHeart, GraduationCap, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { serviceSections, type ServiceSectionContent, type ServiceSectionKey } from '@/lib/services';
import { useAdminLanguage } from '@/components/admin/admin-language-context';

const icons: Record<ServiceSectionKey, ComponentType<{ className?: string }>> = {
    medical: HeartPulse,
    support: HandHeart,
    education: GraduationCap,
    awareness: Megaphone,
};

export default function AdminServicesPage() {
    const { isRTL } = useAdminLanguage();
    const [sections, setSections] = useState<ServiceSectionContent[]>(serviceSections);
    const [activeKey, setActiveKey] = useState<ServiceSectionKey>('medical');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadServices() {
            try {
                const res = await fetch('/api/services');
                const data = await res.json();
                setSections(data);
                if (data[0]?.key) setActiveKey(data[0].key);
            } catch {
                toast.error(isRTL ? 'خطا در بارگذاری خدمات' : 'Failed to load services');
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, [isRTL]);

    const updateSection = (key: ServiceSectionKey, field: keyof ServiceSectionContent, value: string) => {
        setSections((current) =>
            current.map((section) =>
                section.key === key ? { ...section, [field]: value } : section
            )
        );
    };

    const saveSections = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections }),
            });

            if (!res.ok) throw new Error('Failed to save services');

            const data = await res.json();
            setSections(data);
            toast.success(isRTL ? 'خدمات ذخیره شد' : 'Services saved');
        } catch {
            toast.error(isRTL ? 'خطا در ذخیره خدمات' : 'Failed to save services');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : ''}>
                    <h1 className="text-3xl font-bold">
                        {isRTL ? 'مدیریت خدمات' : 'Services Management'}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {isRTL
                            ? 'محتوای تب‌های صفحه خدمات را از اینجا ویرایش کنید.'
                            : 'Edit the content used by the services page tabs.'}
                    </p>
                </div>
                <Button onClick={saveSections} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span className={isRTL ? 'mr-2' : 'ml-2'}>
                        {isRTL ? 'ذخیره' : 'Save'}
                    </span>
                </Button>
            </div>

            <Tabs value={activeKey} onValueChange={(value) => setActiveKey(value as ServiceSectionKey)} dir={isRTL ? 'rtl' : 'ltr'}>
                <TabsList className="grid h-auto grid-cols-2 gap-2 bg-transparent p-0 lg:grid-cols-4">
                    {sections.map((section) => {
                        const Icon = icons[section.key];
                        return (
                            <TabsTrigger
                                key={section.key}
                                value={section.key}
                                className="h-auto justify-center gap-2 rounded-xl border bg-white px-3 py-3 data-[state=active]:border-red-600 data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                            >
                                <Icon className="w-4 h-4" />
                                {isRTL ? section.title : section.titleEn}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {sections.map((section) => (
                    <TabsContent key={section.key} value={section.key} className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className={isRTL ? 'text-right' : ''}>
                                    {isRTL ? `ویرایش بخش ${section.title}` : `Edit ${section.titleEn}`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>{isRTL ? 'عنوان فارسی' : 'Persian Title'}</Label>
                                        <Input
                                            dir="rtl"
                                            value={section.title}
                                            onChange={(event) => updateSection(section.key, 'title', event.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{isRTL ? 'عنوان انگلیسی' : 'English Title'}</Label>
                                        <Input
                                            dir="ltr"
                                            value={section.titleEn}
                                            onChange={(event) => updateSection(section.key, 'titleEn', event.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>{isRTL ? 'خلاصه فارسی' : 'Persian Summary'}</Label>
                                        <Textarea
                                            dir="rtl"
                                            className="min-h-24"
                                            value={section.summary}
                                            onChange={(event) => updateSection(section.key, 'summary', event.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{isRTL ? 'خلاصه انگلیسی' : 'English Summary'}</Label>
                                        <Textarea
                                            dir="ltr"
                                            className="min-h-24"
                                            value={section.summaryEn}
                                            onChange={(event) => updateSection(section.key, 'summaryEn', event.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>{isRTL ? 'متن کامل فارسی' : 'Persian Content'}</Label>
                                        <Textarea
                                            dir="rtl"
                                            className="min-h-56"
                                            value={section.content}
                                            onChange={(event) => updateSection(section.key, 'content', event.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{isRTL ? 'متن کامل انگلیسی' : 'English Content'}</Label>
                                        <Textarea
                                            dir="ltr"
                                            className="min-h-56"
                                            value={section.contentEn}
                                            onChange={(event) => updateSection(section.key, 'contentEn', event.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
