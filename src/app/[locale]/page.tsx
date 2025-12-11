import HeroSection from '@/components/sections/hero-section';
import ImpactSection from '@/components/sections/impact-section';
import NewsPreviewSection from '@/components/sections/news-preview-section';
import TimelineSection from '@/components/sections/timeline-section';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <HeroSection />
      <ImpactSection />
      <NewsPreviewSection />
      <TimelineSection />
      <Footer />
    </div>
  );
}
