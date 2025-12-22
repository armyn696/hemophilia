'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Upload, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAdminLanguage } from '@/components/admin/admin-language-context';

interface PeriodFormData {
    title: string;
    titleEn: string;
    order: number;
    image: string;
}

interface PeriodFormProps {
    initialData?: PeriodFormData & { id: string };
}

export default function PeriodForm({ initialData }: PeriodFormProps) {
    const router = useRouter();
    const { t, isRTL } = useAdminLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<PeriodFormData>({
        title: initialData?.title || '',
        titleEn: initialData?.titleEn || '',
        order: initialData?.order || 0,
        image: initialData?.image || '',
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setFormData(prev => ({ ...prev, image: data.url }));
            toast.success(isRTL ? 'تصویر آپلود شد' : 'Image uploaded');
        } catch (error) {
            toast.error(isRTL ? 'خطا در آپلود تصویر' : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error(isRTL ? 'لطفاً عنوان را وارد کنید' : 'Please enter a title');
            return;
        }

        setLoading(true);

        try {
            const url = initialData
                ? `/api/timeline/periods/${initialData.id}`
                : '/api/timeline/periods';

            const res = await fetch(url, {
                method: initialData ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success(isRTL
                ? (initialData ? 'دوره ویرایش شد' : 'دوره ایجاد شد')
                : (initialData ? 'Period updated' : 'Period created')
            );
            router.push('/admin/timeline');
            router.refresh();
        } catch (error) {
            toast.error(isRTL ? 'خطا در ذخیره دوره' : 'Failed to save period');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/timeline">
                        <ArrowRight className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">
                    {initialData ? t('editPeriod') : t('createPeriod')}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('titleFa')} *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder={isRTL ? 'مثال: اردیبهشت ۱۴۰۴' : 'e.g., May 2025'}
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="titleEn">{t('titleEn')}</Label>
                            <Input
                                id="titleEn"
                                value={formData.titleEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                                placeholder="e.g., May 2025"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="order">{t('order')}</Label>
                        <Input
                            id="order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="w-32"
                        />
                        <p className="text-xs text-muted-foreground">
                            {isRTL ? 'عدد کوچکتر = نمایش بالاتر' : 'Lower number = displayed first'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('image')}</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {formData.image ? (
                            <div className="relative w-48 h-32 rounded-lg overflow-hidden group">
                                <Image src={formData.image} alt="Period" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4" />
                                )}
                                {t('uploadImage')}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                    {t('save')}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    {t('cancel')}
                </Button>
            </div>
        </form>
    );
}
