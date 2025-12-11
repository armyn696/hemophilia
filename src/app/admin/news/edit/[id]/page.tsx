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

    // Convert Date to string for the form
    const formattedNews = {
        ...news,
        date: news.date.toISOString(),
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Edit News</h1>
            <NewsForm initialData={formattedNews} />
        </div>
    );
}
