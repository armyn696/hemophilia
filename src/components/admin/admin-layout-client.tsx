'use client';

import { ReactNode } from 'react';
import { AdminLanguageProvider, useAdminLanguage } from './admin-language-context';
import AdminSidebar from './admin-sidebar';

import AdminMobileHeader from './admin-mobile-header';

function AdminLayoutInner({ children }: { children: ReactNode }) {
    const { isRTL } = useAdminLanguage();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Desktop Sidebar - Hidden on Mobile */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isRTL ? 'md:mr-64' : 'md:ml-64'}`}>
                {/* Mobile Header - Visible only on Mobile */}
                <AdminMobileHeader />

                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
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
