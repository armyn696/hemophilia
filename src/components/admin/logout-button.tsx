'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useAdminLanguage } from './admin-language-context';

export default function LogoutButton() {
    const { t, isRTL } = useAdminLanguage();
    
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/admin-login' })}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
            <LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
        </button>
    );
}
