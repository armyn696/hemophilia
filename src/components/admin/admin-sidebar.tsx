'use client';

import Link from 'next/link';
import { LayoutDashboard, Image as ImageIcon, Newspaper, Home, Languages } from 'lucide-react';
import { useAdminLanguage } from './admin-language-context';
import LogoutButton from './logout-button';

export default function AdminSidebar() {
    const { t, isRTL, language, setLanguage } = useAdminLanguage();

    const navItems = [
        { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/admin/news', label: t('news'), icon: Newspaper },
        { href: '/admin/gallery', label: t('gallery'), icon: ImageIcon },
    ];

    return (
        <aside className={`w-64 bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 fixed h-full z-10 hidden md:block ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}`}>
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
                <h1 className="text-xl font-bold text-red-600">{t('adminPanel')}</h1>
                <button
                    onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
                >
                    <Languages className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>
            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-neutral-700">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span>{t('viewSite')}</span>
                    </Link>
                    <LogoutButton />
                </div>
            </nav>
        </aside>
    );
}
