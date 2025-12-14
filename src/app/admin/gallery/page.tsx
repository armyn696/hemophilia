'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAdminLanguage } from '@/components/admin/admin-language-context';

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
}

export default function AdminGallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { t, isRTL } = useAdminLanguage();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/gallery');
            const data = await res.json();
            setImages(data);
        } catch (error) {
            toast.error(isRTL ? 'خطا در بارگذاری تصاویر' : 'Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload file
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Upload failed');

            const { url } = await uploadRes.json();

            // 2. Save to DB
            const dbRes = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ src: url, alt: file.name }),
            });

            if (!dbRes.ok) throw new Error('Failed to save image');

            toast.success(isRTL ? 'تصویر با موفقیت آپلود شد' : 'Image uploaded successfully');
            fetchImages();
        } catch (error) {
            toast.error(isRTL ? 'خطا در آپلود تصویر' : 'Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input
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

    return (
        <div className="space-y-8">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-3xl font-bold">{t('galleryManagement')}</h1>
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

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
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
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
