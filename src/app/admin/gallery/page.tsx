'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload, Loader2, Plus, FolderPlus, Tag } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAdminLanguage } from '@/components/admin/admin-language-context';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface GalleryCategory {
    id: string;
    name: string;
    nameFa: string;
    _count?: {
        images: number;
    };
}

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    categoryId?: string;
    category?: GalleryCategory;
}

export default function AdminGallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '', nameFa: '' });
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
    const [uploadCategoryId, setUploadCategoryId] = useState<string>('none');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const router = useRouter();
    const { t, isRTL, language } = useAdminLanguage();

    useEffect(() => {
        fetchData();
    }, [selectedCategoryId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = selectedCategoryId === 'all' 
                ? '/api/gallery' 
                : `/api/gallery?categoryId=${selectedCategoryId}`;
            
            const [imagesRes, categoriesRes] = await Promise.all([
                fetch(url),
                fetch('/api/gallery/categories')
            ]);
            
            const imagesData = await imagesRes.json();
            const categoriesData = await categoriesRes.json();
            
            setImages(imagesData);
            setCategories(categoriesData);
        } catch (error) {
            toast.error(isRTL ? 'خطا در بارگذاری داده‌ها' : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];

        try {
            // Single request - upload file and save to DB together
            const formData = new FormData();
            formData.append('file', file);
            formData.append('alt', file.name);
            if (uploadCategoryId !== 'none') {
                formData.append('categoryId', uploadCategoryId);
            }

            const res = await fetch('/api/gallery', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }

            toast.success(isRTL ? 'تصویر با موفقیت آپلود شد' : 'Image uploaded successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error.message || (isRTL ? 'خطا در آپلود تصویر' : 'Failed to upload image'));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(isRTL ? 'آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟' : 'Are you sure you want to delete this image?')) return;

        try {
            const res = await fetch(`/api/gallery?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            toast.success(isRTL ? 'تصویر حذف شد' : 'Image deleted');
            setImages(images.filter(img => img.id !== id));
        } catch (error) {
            toast.error(isRTL ? 'خطا در حذف تصویر' : 'Failed to delete image');
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name) return;

        try {
            const res = await fetch('/api/gallery/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });

            if (!res.ok) throw new Error('Failed to create category');

            toast.success(isRTL ? 'دسته‌بندی ایجاد شد' : 'Category created');
            setNewCategory({ name: '', nameFa: '' });
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error(isRTL ? 'خطا در ایجاد دسته‌بندی' : 'Failed to create category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm(isRTL ? 'آیا از حذف این دسته‌بندی مطمئن هستید؟ تصاویر آن به بخش "بدون دسته‌بندی" منتقل می‌شوند.' : 'Are you sure you want to delete this category? Its images will be moved to "No Category".')) return;

        try {
            const res = await fetch(`/api/gallery/categories?id=${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete');

            toast.success(isRTL ? 'دسته‌بندی حذف شد' : 'Category deleted');
            fetchData();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : (isRTL ? 'خطا در حذف دسته‌بندی' : 'Failed to delete category'));
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                <h1 className="text-3xl font-bold">{t('galleryManagement')}</h1>
                
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Category Management */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <FolderPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                {t('categories')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('addCategory')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('categoryNameEn')}</label>
                                    <Input 
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                        placeholder="Events, Medical, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('categoryNameFa')}</label>
                                    <Input 
                                        value={newCategory.nameFa}
                                        onChange={(e) => setNewCategory({ ...newCategory, nameFa: e.target.value })}
                                        placeholder="رویدادها، پزشکی و ..."
                                    />
                                </div>
                                <Button onClick={handleCreateCategory} className="w-full">
                                    {t('save')}
                                </Button>

                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold mb-2">{t('categories')}</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {categories.map(cat => (
                                            <div key={cat.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                <span>{isRTL ? cat.nameFa || cat.name : cat.name}</span>
                                                <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(cat.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Image Upload */}
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Select value={uploadCategoryId} onValueChange={setUploadCategoryId}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('selectCategory')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('noCategory')}</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {isRTL ? cat.nameFa || cat.name : cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="relative">
                            <input
                                type="file"
                                id="upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                            <Button asChild disabled={uploading}>
                                <label htmlFor="upload" className={`cursor-pointer flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    {uploading ? (
                                        <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    ) : (
                                        <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    )}
                                    {t('uploadImage')}
                                </label>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                    variant={selectedCategoryId === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategoryId('all')}
                    size="sm"
                >
                    {t('all')}
                </Button>
                {categories.map(cat => (
                    <Button 
                        key={cat.id}
                        variant={selectedCategoryId === cat.id ? 'default' : 'outline'}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        size="sm"
                    >
                        {isRTL ? cat.nameFa || cat.name : cat.name}
                        <span className="ml-1 opacity-60">({cat._count?.images || 0})</span>
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                    {t('noData')}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <Card key={image.id} className="overflow-hidden group relative">
                            <div className="aspect-square relative">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    {image.category && (
                                        <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {isRTL ? image.category.nameFa : image.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
