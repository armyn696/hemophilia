'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminLanguage } from '@/components/admin/admin-language-context';

interface NewsCategory {
    id: string;
    name: string;
    nameFa: string;
}

export default function AdminNewsCategories() {
    const [categories, setCategories] = useState<NewsCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', nameFa: '' });
    const { t, isRTL } = useAdminLanguage();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/news-categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            toast.error(isRTL ? 'خطا در بارگذاری دسته‌بندی‌ها' : 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCategory.name.trim() || !newCategory.nameFa.trim()) {
            toast.error(isRTL ? 'هر دو نام الزامی است' : 'Both names are required');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/news-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create');
            }

            const category = await res.json();
            setCategories([...categories, category]);
            setNewCategory({ name: '', nameFa: '' });
            toast.success(isRTL ? 'دسته‌بندی ایجاد شد' : 'Category created');
        } catch (error: any) {
            toast.error(error.message || (isRTL ? 'خطا در ایجاد دسته‌بندی' : 'Failed to create category'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(isRTL ? 'آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟' : 'Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/news-categories?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');

            setCategories(categories.filter(c => c.id !== id));
            toast.success(isRTL ? 'دسته‌بندی حذف شد' : 'Category deleted');
        } catch (error) {
            toast.error(isRTL ? 'خطا در حذف دسته‌بندی' : 'Failed to delete category');
        }
    };

    return (
        <div className="space-y-8">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-3xl font-bold">
                    {isRTL ? 'مدیریت دسته‌بندی اخبار' : 'News Categories Management'}
                </h1>
            </div>

            {/* Add New Category Form */}
            <Card>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Plus className="w-5 h-5" />
                        {isRTL ? 'افزودن دسته‌بندی جدید' : 'Add New Category'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nameFa">نام فارسی *</Label>
                                <Input
                                    id="nameFa"
                                    value={newCategory.nameFa}
                                    onChange={(e) => setNewCategory({ ...newCategory, nameFa: e.target.value })}
                                    dir="rtl"
                                    placeholder="مثال: رویدادها"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">English Name *</Label>
                                <Input
                                    id="name"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    dir="ltr"
                                    placeholder="e.g., Events"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                            {isRTL ? 'ایجاد دسته‌بندی' : 'Create Category'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Categories */}
            <Card>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Tag className="w-5 h-5" />
                        {isRTL ? 'دسته‌بندی‌های موجود' : 'Existing Categories'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                        </div>
                    ) : categories.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            {isRTL ? 'هیچ دسته‌بندی وجود ندارد' : 'No categories yet'}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                            <Tag className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className={isRTL ? 'text-right' : ''}>
                                            <p className="font-medium">{category.nameFa}</p>
                                            <p className="text-sm text-gray-500">{category.name}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            handleDelete(category.id);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
