'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Upload, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAdminLanguage } from '@/components/admin/admin-language-context';

interface Period {
    id: string;
    title: string;
    titleEn?: string;
}

interface EventFormData {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    date: string;
    dateEn: string;
    image: string;
    periodId: string;
    order: number;
}

interface EventFormProps {
    initialData?: EventFormData & { id: string };
}

export default function EventForm({ initialData }: EventFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, isRTL } = useAdminLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [periods, setPeriods] = useState<Period[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<EventFormData>({
        title: initialData?.title || '',
        titleEn: initialData?.titleEn || '',
        description: initialData?.description || '',
        descriptionEn: initialData?.descriptionEn || '',
        date: initialData?.date || '',
        dateEn: initialData?.dateEn || '',
        image: initialData?.image || '',
        periodId: initialData?.periodId || searchParams.get('periodId') || '',
        order: initialData?.order || 0,
    });

    useEffect(() => {
        fetchPeriods();
    }, []);

    const fetchPeriods = async () => {
        try {
            const res = await fetch('/api/timeline/periods');
            const data = await res.json();
            setPeriods(data);
        } catch (error) {
            console.error('Failed to load periods');
        }
    };

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

        if (!formData.title || !formData.description || !formData.periodId) {
            toast.error(isRTL ? 'لطفاً فیلدهای الزامی را پر کنید' : 'Please fill required fields');
            return;
        }

        setLoading(true);

        try {
            const url = initialData
                ? `/api/timeline/events/${initialData.id}`
                : '/api/timeline/events';

            const res = await fetch(url, {
                method: initialData ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success(isRTL
                ? (initialData ? 'رویداد ویرایش شد' : 'رویداد ایجاد شد')
                : (initialData ? 'Event updated' : 'Event created')
            );
            router.push('/admin/timeline');
            router.refresh();
        } catch (error) {
            toast.error(isRTL ? 'خطا در ذخیره رویداد' : 'Failed to save event');
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
                    {initialData ? t('editEvent') : t('createEvent')}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <Label>{t('selectPeriod')} *</Label>
                        <Select
                            value={formData.periodId}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, periodId: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('selectPeriod')} />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map((period) => (
                                    <SelectItem key={period.id} value={period.id}>
                                        {isRTL ? period.title : (period.titleEn || period.title)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('titleFa')} *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder={isRTL ? 'مثال: کارگاه آموزشی' : 'e.g., Workshop'}
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="titleEn">{t('titleEn')}</Label>
                            <Input
                                id="titleEn"
                                value={formData.titleEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                                placeholder="e.g., Workshop"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="description">{t('descriptionFa')} *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descriptionEn">{t('descriptionEn')}</Label>
                            <Textarea
                                id="descriptionEn"
                                value={formData.descriptionEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                                rows={4}
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="date">{isRTL ? 'تاریخ (فارسی)' : 'Date (Farsi)'}</Label>
                            <Input
                                id="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                placeholder={isRTL ? 'مثال: ۱۱ اردیبهشت' : 'e.g., May 11'}
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateEn">{isRTL ? 'تاریخ (انگلیسی)' : 'Date (English)'}</Label>
                            <Input
                                id="dateEn"
                                value={formData.dateEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, dateEn: e.target.value }))}
                                placeholder="e.g., May 11"
                                dir="ltr"
                            />
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
                        </div>
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
                                <Image src={formData.image} alt="Event" fill className="object-cover" />
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
