import { ImageGallery } from '@/components/ui/image-gallery';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useTranslations } from 'next-intl';

export default function GalleryPage() {
  const t = useTranslations('gallery');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
          <ImageGallery />
        </div>
      </main>
      <Footer />
    </div>
  );
}
