'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { useAdminLanguage } from '@/components/admin/admin-language-context';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    image: string;
    category: string;
}

export default function AdminNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, isRTL } = useAdminLanguage();

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch('/api/news');
            const data = await res.json();
            setNews(data);
        } catch (error) {
            toast.error(isRTL ? 'خطا در بارگذاری اخبار' : 'Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(isRTL ? 'آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟' : 'Are you sure you want to delete this news item?')) return;

        try {
            const res = await fetch(`/api/news?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            toast.success(isRTL ? 'خبر حذف شد' : 'News deleted');
            setNews(news.filter(item => item.id !== id));
        } catch (error) {
            toast.error(isRTL ? 'خطا در حذف خبر' : 'Failed to delete news');
        }
    };

    return (
        <div className="space-y-8">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-3xl font-bold">{t('newsManagement')}</h1>
                <Button asChild>
                    <Link href="/admin/news/create" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('addNews')}
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
            ) : news.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {t('noData')}
                </div>
            ) : (
                <div className="grid gap-4">
                    {news.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className={`p-0 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="relative w-32 h-24 shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className={`flex-1 min-w-0 py-4 ${isRTL ? 'text-right' : ''}`}>
                                    <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                                    <div className={`flex items-center gap-4 text-sm text-muted-foreground mt-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                        <span className="capitalize px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded-full text-xs">
                                            {item.category}
                                        </span>
                                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <Calendar className="w-3 h-3" />
                                            <span>{format(new Date(item.date), 'MMM d, yyyy', isRTL ? { locale: faIR } : undefined)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 ${isRTL ? 'pl-4' : 'pr-4'}`}>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/news/edit/${item.id}`}>
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
