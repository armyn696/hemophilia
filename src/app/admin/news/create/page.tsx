import NewsForm from '@/components/admin/news-form';

export default function CreateNewsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Create News</h1>
            <NewsForm />
        </div>
    );
}
