import { prisma } from '@/lib/prisma';
import EventForm from '@/components/admin/event-form';
import { notFound } from 'next/navigation';

interface EditEventPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const { id } = await params;
    const event = await prisma.timelineEvent.findUnique({
        where: { id },
    });

    if (!event) {
        notFound();
    }

    const formattedEvent = {
        id: event.id,
        title: event.title,
        titleEn: event.titleEn || '',
        description: event.description,
        descriptionEn: event.descriptionEn || '',
        date: event.date || '',
        dateEn: event.dateEn || '',
        image: event.image || '',
        periodId: event.periodId,
        order: event.order,
    };

    return <EventForm initialData={formattedEvent} />;
}
