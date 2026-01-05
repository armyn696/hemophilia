'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit, ChevronDown, ChevronUp, Loader2, Calendar, GripVertical } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAdminLanguage } from '@/components/admin/admin-language-context';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimelineEvent {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    date?: string;
    image?: string;
    order: number;
}

interface TimelinePeriod {
    id: string;
    title: string;
    titleEn?: string;
    order: number;
    image?: string;
    events: TimelineEvent[];
}

// Sortable Event Item Component
function SortableEventItem({
    event,
    periodId,
    isRTL,
    onDelete
}: {
    event: TimelineEvent;
    periodId: string;
    isRTL: boolean;
    onDelete: (eventId: string, periodId: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: event.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded"
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {event.image && (
                <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                </div>
            )}
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                <p className="font-medium truncate">{isRTL ? event.title : (event.titleEn || event.title)}</p>
                {event.date && (
                    <div className={`flex items-center gap-1 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                    </div>
                )}
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/admin/timeline/events/edit/${event.id}`}>
                        <Edit className="w-3 h-3" />
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onPointerDown={(e) => {
                        e.preventDefault();
                        onDelete(event.id, periodId);
                    }}
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
}

// Sortable Period Card Component
function SortablePeriodCard({
    period,
    isExpanded,
    isRTL,
    t,
    onToggle,
    onDeletePeriod,
    onDeleteEvent,
    onEventReorder,
}: {
    period: TimelinePeriod;
    isExpanded: boolean;
    isRTL: boolean;
    t: (key: string) => string;
    onToggle: () => void;
    onDeletePeriod: (id: string) => void;
    onDeleteEvent: (eventId: string, periodId: string) => void;
    onEventReorder: (periodId: string, events: TimelineEvent[]) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: period.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleEventDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = period.events.findIndex((e) => e.id === active.id);
            const newIndex = period.events.findIndex((e) => e.id === over.id);
            const newEvents = arrayMove(period.events, oldIndex, newIndex);
            onEventReorder(period.id, newEvents);
        }
    };

    return (
        <Card ref={setNodeRef} style={style} className="overflow-hidden">
            <CardHeader
                className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${isRTL ? 'text-right' : ''}`}
                onClick={onToggle}
            >
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        {period.image && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                <Image src={period.image} alt={period.title} fill className="object-cover" />
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-lg">{isRTL ? period.title : (period.titleEn || period.title)}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {period.events.length} {t('events')}
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button variant="ghost" size="icon" asChild onClick={(e) => e.stopPropagation()}>
                            <Link href={`/admin/timeline/periods/edit/${period.id}`}>
                                <Edit className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeletePeriod(period.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-0">
                    <div className="border-t pt-4">
                        <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300">{t('events')}</h4>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/timeline/events/create?periodId=${period.id}`} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                    {t('addEvent')}
                                </Link>
                            </Button>
                        </div>

                        {period.events.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                                {isRTL ? 'هنوز رویدادی اضافه نشده' : 'No events added yet'}
                            </p>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleEventDragEnd}
                            >
                                <SortableContext
                                    items={period.events.map(e => e.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {period.events.map((event) => (
                                            <SortableEventItem
                                                key={event.id}
                                                event={event}
                                                periodId={period.id}
                                                isRTL={isRTL}
                                                onDelete={onDeleteEvent}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

export default function AdminTimeline() {
    const [periods, setPeriods] = useState<TimelinePeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(new Set());
    const { t, isRTL } = useAdminLanguage();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchPeriods();
    }, []);

    const fetchPeriods = async () => {
        try {
            const res = await fetch('/api/timeline/periods');
            const data = await res.json();
            setPeriods(data);
            setExpandedPeriods(new Set(data.map((p: TimelinePeriod) => p.id)));
        } catch (error) {
            toast.error(isRTL ? 'خطا در بارگذاری تاریخچه' : 'Failed to load timeline');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePeriod = async (id: string) => {
        if (!confirm(isRTL ? 'آیا مطمئن هستید؟ تمام رویدادهای این دوره نیز حذف می‌شوند.' : 'Are you sure? All events in this period will be deleted.')) return;

        try {
            const res = await fetch(`/api/timeline/periods?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success(isRTL ? 'دوره حذف شد' : 'Period deleted');
            setPeriods(periods.filter(p => p.id !== id));
        } catch (error) {
            toast.error(isRTL ? 'خطا در حذف دوره' : 'Failed to delete period');
        }
    };

    const handleDeleteEvent = async (eventId: string, periodId: string) => {
        if (!confirm(isRTL ? 'آیا مطمئن هستید که می‌خواهید این رویداد را حذف کنید؟' : 'Are you sure you want to delete this event?')) return;

        try {
            const res = await fetch(`/api/timeline/events?id=${eventId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success(isRTL ? 'رویداد حذف شد' : 'Event deleted');
            setPeriods(periods.map(p =>
                p.id === periodId
                    ? { ...p, events: p.events.filter(e => e.id !== eventId) }
                    : p
            ));
        } catch (error) {
            toast.error(isRTL ? 'خطا در حذف رویداد' : 'Failed to delete event');
        }
    };

    const togglePeriod = (id: string) => {
        setExpandedPeriods(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handlePeriodDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = periods.findIndex((p) => p.id === active.id);
            const newIndex = periods.findIndex((p) => p.id === over.id);
            const newPeriods = arrayMove(periods, oldIndex, newIndex);
            setPeriods(newPeriods);

            // Update order in database
            try {
                for (let i = 0; i < newPeriods.length; i++) {
                    await fetch(`/api/timeline/periods/${newPeriods[i].id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...newPeriods[i], order: i }),
                    });
                }
                toast.success(isRTL ? 'ترتیب ذخیره شد' : 'Order saved');
            } catch (error) {
                toast.error(isRTL ? 'خطا در ذخیره ترتیب' : 'Failed to save order');
            }
        }
    };

    const handleEventReorder = async (periodId: string, newEvents: TimelineEvent[]) => {
        setPeriods(periods.map(p =>
            p.id === periodId ? { ...p, events: newEvents } : p
        ));

        // Update order in database
        try {
            for (let i = 0; i < newEvents.length; i++) {
                await fetch(`/api/timeline/events/${newEvents[i].id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newEvents[i], order: i }),
                });
            }
            toast.success(isRTL ? 'ترتیب ذخیره شد' : 'Order saved');
        } catch (error) {
            toast.error(isRTL ? 'خطا در ذخیره ترتیب' : 'Failed to save order');
        }
    };

    return (
        <div className="space-y-8">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-3xl font-bold">{t('timelineManagement')}</h1>
                <Button asChild>
                    <Link href="/admin/timeline/periods/create" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('addPeriod')}
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
            ) : periods.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {t('noData')}
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handlePeriodDragEnd}
                >
                    <SortableContext
                        items={periods.map(p => p.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {periods.map((period) => (
                                <SortablePeriodCard
                                    key={period.id}
                                    period={period}
                                    isExpanded={expandedPeriods.has(period.id)}
                                    isRTL={isRTL}
                                    t={t}
                                    onToggle={() => togglePeriod(period.id)}
                                    onDeletePeriod={handleDeletePeriod}
                                    onDeleteEvent={handleDeleteEvent}
                                    onEventReorder={handleEventReorder}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
