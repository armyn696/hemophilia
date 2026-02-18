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
import { Loader2, Upload, Calendar, ArrowLeftRight } from 'lucide-react';
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

    // Direction states for each field (auto-detect + manual override)
    const [directions, setDirections] = useState({
        title: 'rtl' as 'rtl' | 'ltr',
        excerpt: 'rtl' as 'rtl' | 'ltr',
        content: 'rtl' as 'rtl' | 'ltr',
        titleEn: 'ltr' as 'rtl' | 'ltr',
        excerptEn: 'ltr' as 'rtl' | 'ltr',
        contentEn: 'ltr' as 'rtl' | 'ltr',
    });

    // Detect if text starts with RTL character (Persian/Arabic)
    const detectDirection = (text: string): 'rtl' | 'ltr' => {
        const rtlRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        const trimmed = text.trim();
        if (trimmed.length === 0) return 'rtl'; // default for empty
        return rtlRegex.test(trimmed) ? 'rtl' : 'ltr';
    };

    // Handle text change with auto-detection
    const handleTextChange = (field: 'title' | 'excerpt' | 'titleEn' | 'excerptEn' | 'content' | 'contentEn', value: string) => {
        setFormData({ ...formData, [field]: value });
        // Auto-detect direction based on content (only for title and excerpt, content is handled manually usually but auto-detect helps)
        const detected = detectDirection(value);
        setDirections(prev => ({ ...prev, [field]: detected }));
    };

    // Toggle direction manually
    const toggleDirection = (field: 'title' | 'excerpt' | 'titleEn' | 'excerptEn' | 'content' | 'contentEn') => {
        setDirections(prev => ({
            ...prev,
            [field]: prev[field] === 'rtl' ? 'ltr' : 'rtl'
        }));
    };

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
        console.log('[News Form] ===== Upload started =====');

        if (!e.target.files?.[0]) {
            console.log('[News Form] No file selected');
            return;
        }

        setUploading(true);
        const file = e.target.files[0];

        console.log('[News Form] File selected:', {
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)} KB`
        });

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            console.log('[News Form] Sending upload request to /api/upload...');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            console.log('[News Form] Response status:', res.status, res.statusText);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('[News Form] Upload failed:', errorData);
                throw new Error(errorData.error || `Upload failed: ${res.status}`);
            }

            const data = await res.json();
            console.log('[News Form] ✓ Upload successful! Response:', data);

            setFormData({ ...formData, image: data.url });
            toast.success(isRTL ? 'تصویر آپلود شد' : 'Image uploaded');
            console.log('[News Form] ===== Upload finished successfully =====');
        } catch (error: any) {
            console.error('[News Form] ❌ Upload error:', error.message);
            toast.error(isRTL ? `خطا در آپلود تصویر: ${error.message}` : `Failed to upload image: ${error.message}`);
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

        // Validate that image is uploaded
        if (!formData.image) {
            toast.error(isRTL ? 'لطفاً ابتدا تصویر کاور را آپلود کنید' : 'Please upload a cover image first');
            return;
        }

        setLoading(true);

        try {
            const url = initialData?.id ? `/api/news/${initialData.id}` : '/api/news';
            const method = initialData?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to save');
            }

            toast.success(initialData?.id
                ? (isRTL ? 'خبر ویرایش شد' : 'News updated')
                : (isRTL ? 'خبر ایجاد شد' : 'News created')
            );
            router.push('/admin/news');
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(isRTL
                ? `خطا در ذخیره: ${errorMessage}`
                : `Error saving: ${errorMessage}`
            );
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
                        <Label>{isRTL ? 'تصویر کاور *' : 'Cover Image *'}</Label>
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="title">عنوان (فارسی) *</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleDirection('title')}
                                        className="h-6 px-2 text-xs gap-1"
                                        title={`جهت فعلی: ${directions.title.toUpperCase()} - کلیک برای تغییر`}
                                    >
                                        <ArrowLeftRight className="w-3 h-3" />
                                        {directions.title.toUpperCase()}
                                    </Button>
                                </div>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleTextChange('title', e.target.value)}
                                    required
                                    dir={directions.title}
                                    className={directions.title === 'rtl' ? 'text-right' : 'text-left'}
                                    placeholder="عنوان خبر به فارسی..."
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="excerpt">خلاصه (فارسی) *</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleDirection('excerpt')}
                                        className="h-6 px-2 text-xs gap-1"
                                        title={`جهت فعلی: ${directions.excerpt.toUpperCase()} - کلیک برای تغییر`}
                                    >
                                        <ArrowLeftRight className="w-3 h-3" />
                                        {directions.excerpt.toUpperCase()}
                                    </Button>
                                </div>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => handleTextChange('excerpt', e.target.value)}
                                    required
                                    rows={3}
                                    dir={directions.excerpt}
                                    className={directions.excerpt === 'rtl' ? 'text-right' : 'text-left'}
                                    placeholder="خلاصه کوتاه از خبر..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">محتوا (فارسی) *</Label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => handleTextChange('content', content)}
                                    placeholder="محتوای کامل خبر به فارسی..."
                                    direction={directions.content}
                                    onDirectionChange={(dir) => toggleDirection('content')}
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="titleEn">Title (English)</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleDirection('titleEn')}
                                        className="h-6 px-2 text-xs gap-1"
                                        title={`Current direction: ${directions.titleEn.toUpperCase()} - Click to change`}
                                    >
                                        <ArrowLeftRight className="w-3 h-3" />
                                        {directions.titleEn.toUpperCase()}
                                    </Button>
                                </div>
                                <Input
                                    id="titleEn"
                                    value={formData.titleEn}
                                    onChange={(e) => handleTextChange('titleEn', e.target.value)}
                                    dir={directions.titleEn}
                                    className={directions.titleEn === 'rtl' ? 'text-right' : 'text-left'}
                                    placeholder="News title in English..."
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="excerptEn">Excerpt (English)</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleDirection('excerptEn')}
                                        className="h-6 px-2 text-xs gap-1"
                                        title={`Current direction: ${directions.excerptEn.toUpperCase()} - Click to change`}
                                    >
                                        <ArrowLeftRight className="w-3 h-3" />
                                        {directions.excerptEn.toUpperCase()}
                                    </Button>
                                </div>
                                <Textarea
                                    id="excerptEn"
                                    value={formData.excerptEn}
                                    onChange={(e) => handleTextChange('excerptEn', e.target.value)}
                                    rows={3}
                                    dir={directions.excerptEn}
                                    className={directions.excerptEn === 'rtl' ? 'text-right' : 'text-left'}
                                    placeholder="Brief summary of the news..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contentEn">Content (English)</Label>
                                <RichTextEditor
                                    content={formData.contentEn}
                                    onChange={(content) => handleTextChange('contentEn', content)}
                                    placeholder="Full news content in English..."
                                    direction={directions.contentEn}
                                    onDirectionChange={(dir) => toggleDirection('contentEn')}
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
