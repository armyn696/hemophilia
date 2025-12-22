'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, Calendar } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import RichTextEditor from './rich-text-editor';
import { useAdminLanguage } from './admin-language-context';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

interface NewsCategory {
    id: string;
    name: string;
    nameFa: string;
}

interface NewsFormProps {
    initialData?: {
        id?: string;
        title: string;
        titleEn?: string;
        excerpt: string;
        excerptEn?: string;
        content: string;
        contentEn?: string;
        image: string;
        categoryId?: string;
        date: string;
        dateFa?: string;
    };
}

export default function NewsForm({ initialData }: NewsFormProps) {
    const router = useRouter();
    const { t, isRTL } = useAdminLanguage();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<NewsCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Parse initial Persian date
    const getInitialPersianDate = () => {
        if (initialData?.dateFa) {
            return new DateObject({
                date: initialData.dateFa,
                calendar: persian,
                locale: persian_fa
            });
        }
        return new DateObject({ calendar: persian, locale: persian_fa });
    };

    const [persianDate, setPersianDate] = useState<DateObject | null>(getInitialPersianDate());
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        titleEn: initialData?.titleEn || '',
        excerpt: initialData?.excerpt || '',
        excerptEn: initialData?.excerptEn || '',
        content: initialData?.content || '',
        contentEn: initialData?.contentEn || '',
        image: initialData?.image || '',
        categoryId: initialData?.categoryId || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dateFa: initialData?.dateFa || '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/news-categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const { url } = await res.json();
            setFormData({ ...formData, image: url });
            toast.success(isRTL ? 'تصویر آپلود شد' : 'Image uploaded');
        } catch (error) {
            toast.error(isRTL ? 'خطا در آپلود تصویر' : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handlePersianDateChange = (date: DateObject | null) => {
        setPersianDate(date);
        if (date) {
            setFormData({ ...formData, dateFa: date.format('D MMMM YYYY') });
        } else {
            setFormData({ ...formData, dateFa: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = initialData?.id ? `/api/news/${initialData.id}` : '/api/news';
            const method = initialData?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success(initialData?.id
                ? (isRTL ? 'خبر ویرایش شد' : 'News updated')
                : (isRTL ? 'خبر ایجاد شد' : 'News created')
            );
            router.push('/admin/news');
            router.refresh();
        } catch (error) {
            toast.error(isRTL ? 'خطا در ذخیره' : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Common Fields Card */}
            <Card>
                <CardHeader>
                    <CardTitle>{isRTL ? 'تنظیمات عمومی' : 'General Settings'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">{t('category')}</Label>
                        {loadingCategories ? (
                            <div className="flex items-center gap-2 p-3 border rounded-md">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm text-muted-foreground">
                                    {isRTL ? 'در حال بارگذاری...' : 'Loading...'}
                                </span>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-3 border rounded-md text-sm text-muted-foreground">
                                {isRTL ? 'هیچ دسته‌بندی وجود ندارد. ابتدا دسته‌بندی ایجاد کنید.' : 'No categories. Please create one first.'}
                            </div>
                        ) : (
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={isRTL ? 'انتخاب دسته‌بندی' : 'Select category'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {isRTL ? category.nameFa : category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{isRTL ? 'تصویر کاور' : 'Cover Image'}</Label>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {formData.image && (
                                <div className="relative w-32 h-24 rounded-lg overflow-hidden border">
                                    <Image
                                        src={formData.image}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                />
                                <Button type="button" variant="outline" asChild disabled={uploading}>
                                    <label htmlFor="image-upload" className={`cursor-pointer flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        {uploading ? <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                                        {formData.image
                                            ? (isRTL ? 'تغییر تصویر' : 'Change Image')
                                            : (isRTL ? 'آپلود تصویر' : 'Upload Image')
                                        }
                                    </label>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bilingual Content Card */}
            <Card>
                <CardHeader>
                    <CardTitle>{isRTL ? 'محتوای دوزبانه' : 'Bilingual Content'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="fa" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="fa">🇮🇷 فارسی</TabsTrigger>
                            <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                        </TabsList>

                        {/* Farsi Tab */}
                        <TabsContent value="fa" className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    تاریخ شمسی
                                </Label>
                                <div dir="rtl">
                                    <DatePicker
                                        value={persianDate}
                                        onChange={handlePersianDateChange}
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                        format="D MMMM YYYY"
                                        inputClass="w-full px-3 py-2 border border-input rounded-md bg-background text-right focus:outline-none focus:ring-2 focus:ring-ring"
                                        containerClassName="w-full"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">روی فیلد کلیک کنید تا تقویم باز شود</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">عنوان (فارسی) *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    dir="rtl"
                                    placeholder="عنوان خبر به فارسی..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">خلاصه (فارسی) *</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    required
                                    rows={3}
                                    dir="rtl"
                                    placeholder="خلاصه کوتاه از خبر..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">محتوا (فارسی) *</Label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    placeholder="محتوای کامل خبر به فارسی..."
                                />
                            </div>
                        </TabsContent>

                        {/* English Tab */}
                        <TabsContent value="en" className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Date (Gregorian)
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Select the date in Gregorian calendar</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="titleEn">Title (English)</Label>
                                <Input
                                    id="titleEn"
                                    value={formData.titleEn}
                                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                    dir="ltr"
                                    placeholder="News title in English..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerptEn">Excerpt (English)</Label>
                                <Textarea
                                    id="excerptEn"
                                    value={formData.excerptEn}
                                    onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                                    rows={3}
                                    dir="ltr"
                                    placeholder="Brief summary of the news..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contentEn">Content (English)</Label>
                                <RichTextEditor
                                    content={formData.contentEn}
                                    onChange={(content) => setFormData({ ...formData, contentEn: content })}
                                    placeholder="Full news content in English..."
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button type="submit" disabled={loading || uploading}>
                    {loading && <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                    {isRTL ? 'ذخیره خبر' : 'Save News'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    {t('cancel')}
                </Button>
            </div>
        </form>
    );
}
