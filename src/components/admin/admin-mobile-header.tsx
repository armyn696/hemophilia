'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { useAdminLanguage } from './admin-language-context';
import { AdminSidebarContent } from './admin-sidebar';

export default function AdminMobileHeader() {
    const { t, isRTL } = useAdminLanguage();
    const [open, setOpen] = useState(false);

    // Sheet side depends on RTL
    const side = isRTL ? 'right' : 'left';

    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                        </button>
                    </SheetTrigger>

                    {/* Accessibilty: Titles are required for Dialog content */}
                    <div className="hidden">
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>Main navigation menu for admin panel</SheetDescription>
                    </div>

                    <SheetContent side={side} className="p-0 w-64 border-r-0">
                        {/* We need to ensure the close button in SheetContent doesn't conflict, 
                            but cleaner to use our own content. 
                            However, shadcn SheetContent usually has a close button. 
                            We simply render our sidebar content inside. */}
                        <AdminSidebarContent onClose={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t('adminPanel')}</h1>
            </div>
        </div>
    );
}
