export type ServiceSectionKey = 'medical' | 'support' | 'education' | 'awareness';

export interface ServiceSectionContent {
    key: ServiceSectionKey;
    title: string;
    titleEn: string;
    summary: string;
    summaryEn: string;
    content: string;
    contentEn: string;
    order: number;
}

export const serviceSections: ServiceSectionContent[] = [
    {
        key: 'medical',
        title: 'درمانی',
        titleEn: 'Medical Care',
        summary: 'پیگیری درمان، تأمین دارو و هماهنگی خدمات تخصصی برای بیماران هموفیلی.',
        summaryEn: 'Treatment follow-up, medication support, and specialized care coordination for hemophilia patients.',
        content: 'در بخش درمانی، کانون برای تسهیل مسیر درمان بیماران هموفیلی و خانواده‌های آنان فعالیت می‌کند. این خدمات شامل راهنمایی برای دریافت دارو، معرفی به مراکز درمانی، پیگیری نیازهای پزشکی و همراهی در مسیر مراقبت تخصصی است.',
        contentEn: 'Our medical services help patients and families navigate treatment, medication access, referrals, and specialized care coordination.',
        order: 0,
    },
    {
        key: 'support',
        title: 'حمایتی',
        titleEn: 'Support Services',
        summary: 'کمک‌های حمایتی، پیگیری نیازهای ضروری و همراهی با خانواده‌ها در شرایط سخت.',
        summaryEn: 'Essential support, follow-up, and assistance for families in difficult situations.',
        content: 'بخش حمایتی برای پاسخ به نیازهای ضروری بیماران و خانواده‌ها طراحی شده است. این خدمات می‌تواند شامل حمایت معیشتی، پیگیری مشکلات اجتماعی، معرفی به نهادهای همکار و همراهی در شرایط بحرانی باشد.',
        contentEn: 'Support services address essential needs, social challenges, partner referrals, and crisis assistance for patients and families.',
        order: 1,
    },
    {
        key: 'education',
        title: 'آموزشی',
        titleEn: 'Education',
        summary: 'برگزاری آموزش‌های کاربردی برای بیماران، خانواده‌ها و مراقبان.',
        summaryEn: 'Practical training for patients, families, and caregivers.',
        content: 'در بخش آموزشی، کانون تلاش می‌کند دانش کاربردی خانواده‌ها درباره هموفیلی، مراقبت روزمره، پیشگیری از آسیب‌ها و شیوه صحیح پیگیری درمان را افزایش دهد.',
        contentEn: 'Education programs improve practical knowledge about hemophilia care, daily prevention, injury reduction, and treatment follow-up.',
        order: 2,
    },
    {
        key: 'awareness',
        title: 'آگاهی‌بخشی',
        titleEn: 'Awareness',
        summary: 'اطلاع‌رسانی عمومی برای شناخت بهتر هموفیلی و کاهش نگرانی‌های جامعه.',
        summaryEn: 'Public awareness to improve understanding of hemophilia and reduce social concerns.',
        content: 'فعالیت‌های آگاهی‌بخشی با هدف شناخت بهتر بیماری هموفیلی، اصلاح باورهای نادرست، جلب مشارکت اجتماعی و رساندن صدای بیماران به جامعه انجام می‌شود.',
        contentEn: 'Awareness efforts help improve public understanding, correct misconceptions, encourage community participation, and amplify patient voices.',
        order: 3,
    },
];

type StoredServiceSection = {
    key: string;
    title?: string | null;
    titleEn?: string | null;
    summary?: string | null;
    summaryEn?: string | null;
    content?: string | null;
    contentEn?: string | null;
    order?: number | null;
};

export function mergeServiceSections(storedSections: StoredServiceSection[]) {
    const storedByKey = new Map(storedSections.map((section) => [section.key, section]));

    return serviceSections.map((defaultSection) => {
        const stored = storedByKey.get(defaultSection.key);
        return {
            ...defaultSection,
            ...stored,
            key: defaultSection.key,
            title: stored?.title || defaultSection.title,
            titleEn: stored?.titleEn || defaultSection.titleEn,
            summary: stored?.summary || defaultSection.summary,
            summaryEn: stored?.summaryEn || defaultSection.summaryEn,
            content: stored?.content || defaultSection.content,
            contentEn: stored?.contentEn || defaultSection.contentEn,
            order: stored?.order ?? defaultSection.order,
        };
    }).sort((a, b) => a.order - b.order);
}
