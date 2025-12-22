'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fa' | 'en';

interface AdminLanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
    fa: {
        adminPanel: 'پنل مدیریت',
        dashboard: 'داشبورد',
        news: 'اخبار',
        gallery: 'گالری',
        viewSite: 'مشاهده سایت',
        logout: 'خروج',
        uploadImage: 'آپلود تصویر',
        galleryManagement: 'مدیریت گالری',
        newsManagement: 'مدیریت اخبار',
        addNews: 'افزودن خبر',
        edit: 'ویرایش',
        delete: 'حذف',
        save: 'ذخیره',
        cancel: 'انصراف',
        title: 'عنوان',
        content: 'محتوا',
        image: 'تصویر',
        date: 'تاریخ',
        author: 'نویسنده',
        category: 'دسته‌بندی',
        actions: 'عملیات',
        noData: 'داده‌ای یافت نشد',
        loading: 'در حال بارگذاری...',
        welcome: 'خوش آمدید',
        totalNews: 'کل اخبار',
        totalImages: 'کل تصاویر',
        recentActivity: 'فعالیت‌های اخیر',
        categories: 'مدیریت دسته‌بندی‌ها',
        addCategory: 'افزودن دسته‌بندی جدید',
        categoryNameEn: 'نام (انگلیسی)',
        categoryNameFa: 'نام (فارسی)',
        selectCategory: 'انتخاب دسته‌بندی',
        all: 'همه',
        noCategory: 'بدون دسته‌بندی',
        timeline: 'تاریخچه رویدادها',
        timelineManagement: 'مدیریت تاریخچه رویدادها',
        addPeriod: 'افزودن دوره',
        addEvent: 'افزودن رویداد',
        period: 'دوره',
        events: 'رویدادها',
        description: 'توضیحات',
        order: 'ترتیب',
        titleFa: 'عنوان (فارسی)',
        titleEn: 'عنوان (انگلیسی)',
        descriptionFa: 'توضیحات (فارسی)',
        descriptionEn: 'توضیحات (انگلیسی)',
        selectPeriod: 'انتخاب دوره',
        backToTimeline: 'بازگشت به تاریخچه',
        createPeriod: 'ایجاد دوره',
        editPeriod: 'ویرایش دوره',
        createEvent: 'ایجاد رویداد',
        editEvent: 'ویرایش رویداد',
        newsCategories: 'دسته‌بندی اخبار',
    },
    en: {
        adminPanel: 'Admin Panel',
        dashboard: 'Dashboard',
        news: 'News',
        gallery: 'Gallery',
        viewSite: 'View Site',
        logout: 'Logout',
        uploadImage: 'Upload Image',
        galleryManagement: 'Gallery Management',
        newsManagement: 'News Management',
        addNews: 'Add News',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        title: 'Title',
        content: 'Content',
        image: 'Image',
        date: 'Date',
        author: 'Author',
        category: 'Category',
        actions: 'Actions',
        noData: 'No data found',
        loading: 'Loading...',
        welcome: 'Welcome',
        totalNews: 'Total News',
        totalImages: 'Total Images',
        recentActivity: 'Recent Activity',
        categories: 'Manage Categories',
        addCategory: 'Add New Category',
        categoryNameEn: 'Name (English)',
        categoryNameFa: 'Name (Persian)',
        selectCategory: 'Select Category',
        all: 'All',
        noCategory: 'No Category',
        timeline: 'Timeline',
        timelineManagement: 'Timeline Management',
        addPeriod: 'Add Period',
        addEvent: 'Add Event',
        period: 'Period',
        events: 'Events',
        description: 'Description',
        order: 'Order',
        titleFa: 'Title (Persian)',
        titleEn: 'Title (English)',
        descriptionFa: 'Description (Persian)',
        descriptionEn: 'Description (English)',
        selectPeriod: 'Select Period',
        backToTimeline: 'Back to Timeline',
        createPeriod: 'Create Period',
        editPeriod: 'Edit Period',
        createEvent: 'Create Event',
        editEvent: 'Edit Event',
        newsCategories: 'News Categories',
    },
};

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fa');

    useEffect(() => {
        const saved = localStorage.getItem('admin-language') as Language;
        if (saved && (saved === 'fa' || saved === 'en')) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('admin-language', lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    const isRTL = language === 'fa';

    return (
        <AdminLanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </AdminLanguageContext.Provider>
    );
}

export function useAdminLanguage() {
    const context = useContext(AdminLanguageContext);
    if (!context) {
        throw new Error('useAdminLanguage must be used within AdminLanguageProvider');
    }
    return context;
}
