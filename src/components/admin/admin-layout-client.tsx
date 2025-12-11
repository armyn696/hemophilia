'use client';

import { ReactNode } from 'react';
import { AdminLanguageProvider, useAdminLanguage } from './admin-language-context';
import AdminSidebar from './admin-sidebar';

function AdminLayoutInner({ children }: { children: ReactNode }) {
    const { isRTL } = useAdminLanguage();

    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-neutral-900 flex ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <AdminSidebar />
            <main className={`flex-1 p-8 ${isRTL ? 'md:mr-64' : 'md:ml-64'}`}>
                {children}
            </main>
        </div>
    );
}

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
    return (
        <AdminLanguageProvider>
            <AdminLayoutInner>{children}</AdminLayoutInner>
        </AdminLanguageProvider>
    );
}
