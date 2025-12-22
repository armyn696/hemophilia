import { prisma } from '@/lib/prisma';
import NewsForm from '@/components/admin/news-form';
import { notFound } from 'next/navigation';

interface EditNewsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
    const { id } = await params;
    const news = await prisma.news.findUnique({
        where: { id },
    });

    if (!news) {
        notFound();
    }

    // Convert Date to string and handle nulls for the form
    const formattedNews = {
        id: news.id,
        title: news.title,
        titleEn: news.titleEn || undefined,
        excerpt: news.excerpt,
        excerptEn: news.excerptEn || undefined,
        content: news.content,
        contentEn: news.contentEn || undefined,
        image: news.image,
        categoryId: news.categoryId || undefined,
        date: news.date.toISOString(),
        dateFa: news.dateFa || undefined,
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Edit News</h1>
            <NewsForm initialData={formattedNews} />
        </div>
    );
}
