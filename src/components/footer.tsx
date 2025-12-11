'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tContact = useTranslations('contact');
  const locale = useLocale();

  const quickLinks = [
    { key: 'home', href: `/${locale}` },
    { key: 'about', href: `/${locale}/about` },
    { key: 'services', href: `/${locale}/services` },
    { key: 'contact', href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-[#1a1a1a] border-t border-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <Image 
                src="/logo.png" 
                alt="Hemophilia Society Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain brightness-0 invert"
              />
              <span className="font-bold text-lg text-white">
                {locale === 'fa' ? 'کانون هموفیلی بیرجند' : 'Birjand Hemophilia Society'}
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {t('description')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse mt-6">
              <a
                href="https://www.instagram.com/skhhemophilia?igsh=d2Z6b293d3Jwc3Bh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#FF6B35] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">{t('quick_links')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">{t('contact_info')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-2 rtl:space-x-reverse text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#FF6B35]" />
                <span>{tContact('address_text')}</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#FF6B35]" />
                <span dir="ltr">056-32212999</span>
              </li>
                          </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {new Date().getFullYear()} © {locale === 'fa' ? 'کانون هموفیلی بیرجند' : 'Birjand Hemophilia Society'}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
