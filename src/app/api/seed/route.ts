import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        // Create/Update admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const existingUser = await prisma.user.findUnique({
            where: { username: 'admin' }
        });

        if (existingUser) {
            await prisma.user.update({
                where: { username: 'admin' },
                data: { password: hashedPassword }
            });
        } else {
            await prisma.user.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                    name: 'Administrator'
                }
            });
        }

        // Create timeline periods and events from original data
        const timelineData = [
            {
                title: 'فعالیت‌های مستمر',
                titleEn: 'Ongoing Activities',
                order: 0,
                image: '/images/کلاسهای ریاضی2.jpg',
                events: [
                    { title: 'کلاس‌های تقویتی ریاضی', titleEn: 'Math Tutoring Classes', date: 'هر پنجشنبه صبح', description: 'برگزاری کلاس‌های هفتگی ریاضی ویژه دانش‌آموزان هموفیلی در محیطی صمیمی.', descriptionEn: 'Weekly math classes for hemophilia students in a friendly environment.' },
                    { title: 'عیادت از بیماران بستری', titleEn: 'Hospital Visits', date: '', description: 'بازدید مداوم از بیماران بستری در بیمارستان و پیگیری روند درمان و نیازهای آنان.', descriptionEn: 'Regular visits to hospitalized patients and follow-up on their treatment and needs.' },
                    { title: 'طرح غذای گرم', titleEn: 'Warm Food Program', date: 'دوشنبه‌ها', description: 'توزیع وعده‌های غذایی گرم در دوشنبه‌های مهربانی توسط دارالایتام فاطمیه.', descriptionEn: 'Distribution of warm meals on Kindness Mondays by Fatemieh Orphanage.' }
                ]
            },
            {
                title: 'اردیبهشت ۱۴۰۴',
                titleEn: 'May 2025',
                order: 1,
                image: null,
                events: [
                    { title: 'تقدیر از معلمان داوطلب', titleEn: 'Appreciation of Volunteer Teachers', date: '۱۱ اردیبهشت', description: 'مراسم سپاسگزاری از معلمان همکار در طرح‌های آموزشی کانون.', descriptionEn: 'Appreciation ceremony for teachers collaborating in educational programs.' }
                ]
            },
            {
                title: 'مرداد ۱۴۰۴',
                titleEn: 'August 2025',
                order: 2,
                image: '/images/کارگاه سواد رسانه2.jpg',
                events: [
                    { title: 'پیاده‌روی خانوادگی «زندگی با امید جاری‌ست»', titleEn: 'Family Walk "Life Flows with Hope"', date: '۱۰ مرداد', description: 'همایش پیاده‌روی صبحگاهی در پارک توحید به مناسبت هفته حمایت از بیماران هموفیلی.', descriptionEn: 'Morning walk rally at Tohid Park for Hemophilia Support Week.' },
                    { title: 'کارگاه آموزشی «شناخت و مراقبت از هموفیلی»', titleEn: 'Hemophilia Care Workshop', date: '', description: 'کارگاه تخصصی فیزیوتراپی و آموزش حرکات اصلاحی برای بیماران و خانواده‌ها.', descriptionEn: 'Specialized physiotherapy workshop for patients and families.' }
                ]
            },
            {
                title: 'آبان ۱۴۰۴',
                titleEn: 'November 2025',
                order: 3,
                image: '/images/فیزیوتراپی1.jpg',
                events: [
                    { title: 'کارگاه آموزشی سواد رسانه‌ای', titleEn: 'Media Literacy Workshop', date: '۱۴ آبان', description: 'حضور پرسنل در کارگاه آموزشی با هدف ارتقای دانش رسانه‌ای و اطلاع‌رسانی.', descriptionEn: 'Staff participation in workshop to enhance media and communication knowledge.' },
                    { title: 'درخشش ورزشکاران هموفیلی', titleEn: 'Hemophilia Athletes Success', date: '', description: 'کسب مقام اول دارت و پتانک توسط آقایان مجتبی حق‌پذیر و سید کاظم حسین‌کیا.', descriptionEn: 'First place in darts and petanque by Mojtaba Haghpazir and Seyed Kazem Hosseinkia.' }
                ]
            },
            {
                title: 'سایر دستاوردها',
                titleEn: 'Other Achievements',
                order: 4,
                image: '/images/ورزشکاران.jpg',
                events: [
                    { title: 'افتخارآفرینی تحصیلی', titleEn: 'Academic Achievement', date: '', description: 'کسب رتبه ۲ کنکور کارشناسی ارشد در رشته سلامت سالمندی توسط یکی از اعضای کانون.', descriptionEn: 'Rank 2 in Master\'s entrance exam in Geriatric Health by a member.' },
                    { title: 'توزیع بسته‌های مهربانی', titleEn: 'Kindness Package Distribution', date: '', description: 'اهدای گوشت، بن کفش و سبدهای غذایی به خانواده‌های نیازمند.', descriptionEn: 'Donation of meat, shoe vouchers, and food baskets to needy families.' }
                ]
            }
        ];

        // Clear existing timeline data
        await prisma.timelineEvent.deleteMany({});
        await prisma.timelinePeriod.deleteMany({});

        // Create periods and events
        for (const periodData of timelineData) {
            const period = await prisma.timelinePeriod.create({
                data: {
                    title: periodData.title,
                    titleEn: periodData.titleEn,
                    order: periodData.order,
                    image: periodData.image
                }
            });

            for (let i = 0; i < periodData.events.length; i++) {
                const eventData = periodData.events[i];
                await prisma.timelineEvent.create({
                    data: {
                        title: eventData.title,
                        titleEn: eventData.titleEn,
                        description: eventData.description,
                        descriptionEn: eventData.descriptionEn,
                        date: eventData.date || null,
                        periodId: period.id,
                        order: i
                    }
                });
            }
        }

        // Seed News Categories
        const newsCategoriesData = [
            { name: 'events', nameFa: 'رویدادها' },
            { name: 'medical', nameFa: 'پزشکی' },
            { name: 'education', nameFa: 'آموزشی' },
            { name: 'research', nameFa: 'تحقیقات' },
            { name: 'community', nameFa: 'جامعه' }
        ];

        // Clear existing news categories and news
        await prisma.news.deleteMany({});
        await prisma.newsCategory.deleteMany({});

        // Create news categories
        const newsCategoryMap: Record<string, string> = {};
        for (const cat of newsCategoriesData) {
            const created = await prisma.newsCategory.create({
                data: { name: cat.name, nameFa: cat.nameFa }
            });
            newsCategoryMap[cat.name] = created.id;
        }

        // Seed News Data with categoryId
        const newsData = [
            {
                title: 'انتشار دستورالعمل‌های جدید درمان',
                titleEn: 'New Treatment Guidelines Released',
                excerpt: 'فدراسیون جهانی هموفیلی دستورالعمل‌های به‌روزرسانی شده درمان برای سال ۱۴۰۴ را منتشر کرد.',
                excerptEn: 'The World Federation of Hemophilia has released updated treatment guidelines for 2025.',
                content: '<p>فدراسیون جهانی هموفیلی (WFH) نسخه سوم دستورالعمل‌های مدیریت هموفیلی را منتشر کرده است. این دستورالعمل‌ها شامل توصیه‌های جدید در مورد ارزیابی ژنتیکی، درمان پیشگیرانه و مراقبت‌های اورژانسی است.</p>',
                contentEn: '<p>The World Federation of Hemophilia (WFH) has published its 3rd edition of the Guidelines for the Management of Hemophilia. These guidelines feature new recommendations on genetic assessment, prophylactic treatment, and emergency care.</p>',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
                categoryKey: 'medical',
                author: 'دکتر سارا اسمیت',
                dateFa: '۱ دی ۱۴۰۳'
            },
            {
                title: 'رویداد حمایت اجتماعی در بیرجند',
                titleEn: 'Community Support Event in Birjand',
                excerpt: 'جمعه این هفته در گردهمایی سالانه و نشست حمایتی ما شرکت کنید.',
                excerptEn: 'Join us for our annual community gathering and support session this Friday.',
                content: '<p>ما با خوشحالی گردهمایی آینده خود را در مرکز هموفیلی بیرجند اعلام می‌کنیم. این رویداد فضای امنی را برای بیماران و خانواده‌ها فراهم می‌کند تا تجربیات خود را به اشتراک بگذارند.</p>',
                contentEn: '<p>We are excited to announce our upcoming community gathering at the Birjand Hemophilia Center. This event will provide a safe space for patients and families to share experiences and receive support from mental health professionals.</p>',
                image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
                categoryKey: 'community',
                author: 'ادمین',
                dateFa: '۲۵ آذر ۱۴۰۳'
            },
            {
                title: 'پیشرفت در تحقیقات ژن درمانی',
                titleEn: 'Breakthrough in Gene Therapy Research',
                excerpt: 'مطالعات اخیر نتایج امیدوارکننده‌ای برای اثربخشی بلندمدت ژن درمانی نشان می‌دهد.',
                excerptEn: 'Recent studies show promising results for long-term gene therapy efficacy.',
                content: '<p>یک مطالعه جدید در مجله پزشکی نیو انگلند موفقیت ژن درمانی مبتنی بر AAV5 را در تولید پایدار فاکتور VIII برجسته می‌کند. این یک نقطه عطف مهم در مسیر درمان کامل است.</p>',
                contentEn: '<p>A new study published in the New England Journal of Medicine highlights the success of AAV5-based gene therapy in sustained factor VIII production. This marks a significant milestone in the journey towards a functional cure.</p>',
                image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
                categoryKey: 'research',
                author: 'هیئت پزشکی',
                dateFa: '۱۵ آذر ۱۴۰۳'
            },
            {
                title: 'فعالیت‌های ماه آگاهی هموفیلی',
                titleEn: 'Hemophilia Awareness Month Activities',
                excerpt: 'برنامه فعالیت‌های این ماه برای کمپین آگاهی‌رسانی و برنامه‌های مدارس را ببینید.',
                excerptEn: 'Check out the schedule for this month\'s awareness campaign and school programs.',
                content: '<p>فروردین ماه آگاهی هموفیلی است! ما مجموعه‌ای از کارگاه‌ها را در دبیرستان‌های محلی برای آموزش دانش‌آموزان درباره اختلالات خونریزی برگزار کرده‌ایم. داوطلبان برای کمک در توزیع بروشورها نیاز است.</p>',
                contentEn: '<p>April is Hemophilia Awareness Month! We have organized a series of workshops in local high schools to educate students about bleeding disorders. Volunteers are needed to help distribute brochures and facilitate sessions.</p>',
                image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
                categoryKey: 'events',
                author: 'تیم آگاهی‌رسانی',
                dateFa: '۱۰ آذر ۱۴۰۳'
            }
        ];

        for (const news of newsData) {
            await prisma.news.create({
                data: {
                    title: news.title,
                    titleEn: news.titleEn,
                    excerpt: news.excerpt,
                    excerptEn: news.excerptEn,
                    content: news.content,
                    contentEn: news.contentEn,
                    image: news.image,
                    categoryId: newsCategoryMap[news.categoryKey],
                    author: news.author,
                    date: new Date(),
                    dateFa: news.dateFa
                }
            });
        }

        // Seed Gallery Categories and Images
        const galleryCategories = [
            { name: 'events', nameFa: 'رویدادها' },
            { name: 'workshops', nameFa: 'کارگاه‌ها' },
            { name: 'activities', nameFa: 'فعالیت‌ها' }
        ];

        const galleryImages = [
            { src: '/images/کلاسهای ریاضی2.jpg', alt: 'کلاس‌های ریاضی', category: 'activities' },
            { src: '/images/کارگاه سواد رسانه2.jpg', alt: 'کارگاه سواد رسانه‌ای', category: 'workshops' },
            { src: '/images/فیزیوتراپی1.jpg', alt: 'فیزیوتراپی', category: 'activities' },
            { src: '/images/ورزشکاران.jpg', alt: 'ورزشکاران', category: 'events' }
        ];

        // Clear existing gallery data
        await prisma.galleryImage.deleteMany({});
        await prisma.galleryCategory.deleteMany({});

        // Create categories
        const galleryCategoryMap: Record<string, string> = {};
        for (const cat of galleryCategories) {
            const created = await prisma.galleryCategory.create({
                data: { name: cat.name, nameFa: cat.nameFa }
            });
            galleryCategoryMap[cat.name] = created.id;
        }

        // Create images
        for (const img of galleryImages) {
            await prisma.galleryImage.create({
                data: {
                    src: img.src,
                    alt: img.alt,
                    categoryId: galleryCategoryMap[img.category]
                }
            });
        }

        return NextResponse.json({
            message: 'Database seeded successfully!',
            admin: { username: 'admin', password: 'admin123' },
            periods: timelineData.length,
            events: timelineData.reduce((acc, p) => acc + p.events.length, 0),
            newsCategories: newsCategoriesData.length,
            news: newsData.length,
            galleryCategories: galleryCategories.length,
            galleryImages: galleryImages.length
        });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
