'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';

export function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if we are on the homepage (kept in case it's needed later)
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always use solid navigation (visible from first render)
  const showSolidNav = true;

  const navItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'about', href: `/${locale}/about` },
    { key: 'services', href: `/${locale}/services` },
    { key: 'education', href: `/${locale}/education` },
    { key: 'news', href: `/${locale}/news` },
    { key: 'gallery', href: `/${locale}/gallery` },
    { key: 'contact', href: `/${locale}/contact` },
  ];

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}/${currentPath}`);
  };

  return (
    <nav
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300",
        showSolidNav
          ? "bg-background/95 backdrop-blur-md border-b py-4 shadow-sm"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Hemophilia Society Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={cn(
              "font-semibold text-xl hidden sm:inline-block transition-colors",
              showSolidNav ? "text-foreground" : "text-white"
            )}>
              {locale === 'fa' ? 'کانون هموفیلی' : 'Hemophilia Society'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "text-[15px] font-medium transition-colors hover:opacity-70",
                  showSolidNav ? "text-foreground/80 hover:text-foreground" : "text-white/90 hover:text-white"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-9 px-3 text-sm font-medium transition-colors",
                    showSolidNav ? "text-foreground/70 hover:text-foreground hover:bg-accent" : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {locale === 'fa' ? 'FA' : 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale('fa')} className="text-sm">
                  فارسی
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale('en')} className="text-sm">
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Donate Button */}
            <Link href={`/${locale}/donate`}>
              <Button 
                className={cn(
                  "hidden sm:inline-flex items-center gap-2 text-sm font-medium rounded-full px-6 py-2 h-10 transition-all",
                  showSolidNav 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-white text-black hover:bg-white/90"
                )}
              >
                <Heart className="w-4 h-4" />
                <span>{t('donate')}</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "h-9 w-9 transition-colors",
                    showSolidNav ? "text-foreground" : "text-white"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={locale === 'fa' ? 'right' : 'left'}>
                <div className="flex flex-col space-y-6 mt-12">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.key}>
                      <Link
                        href={item.href}
                        className="text-xl font-bold transition-colors hover:text-primary"
                      >
                        {t(item.key)}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link href={`/${locale}/donate`}>
                      <Button className="w-full mt-4 flex items-center justify-center gap-2" size="lg">
                        <Heart className="w-5 h-5" />
                        <span>{t('donate')}</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
