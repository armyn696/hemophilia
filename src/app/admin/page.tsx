'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAdminLanguage } from '@/components/admin/admin-language-context';

export default function AdminDashboard() {
    const { t, isRTL } = useAdminLanguage();
    const [stats, setStats] = useState({ newsCount: 0, galleryCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : ''}`}>
                {t('dashboard')}
            </h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CardTitle className="text-sm font-medium">{t('totalNews')}</CardTitle>
                        <Newspaper className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className={isRTL ? 'text-right' : ''}>
                        <div className="text-2xl font-bold">{stats.newsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {isRTL ? 'مقالات خبری منتشر شده' : 'Published news articles'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CardTitle className="text-sm font-medium">{t('totalImages')}</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className={isRTL ? 'text-right' : ''}>
                        <div className="text-2xl font-bold">{stats.galleryCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {isRTL ? 'تصاویر در گالری' : 'Images in the gallery'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
