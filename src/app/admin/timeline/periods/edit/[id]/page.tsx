import { prisma } from '@/lib/prisma';
import PeriodForm from '@/components/admin/period-form';
import { notFound } from 'next/navigation';

interface EditPeriodPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPeriodPage({ params }: EditPeriodPageProps) {
    const { id } = await params;
    const period = await prisma.timelinePeriod.findUnique({
        where: { id },
    });

    if (!period) {
        notFound();
    }

    const formattedPeriod = {
        id: period.id,
        title: period.title,
        titleEn: period.titleEn || '',
        order: period.order,
        image: period.image || '',
    };

    return <PeriodForm initialData={formattedPeriod} />;
}
