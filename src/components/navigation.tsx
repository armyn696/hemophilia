'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, Globe, Heart, X, Home, Info, Briefcase, GraduationCap, Newspaper, Images, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
    { key: 'home', href: `/${locale}`, icon: Home },
    { key: 'about', href: `/${locale}/about`, icon: Info },
    { key: 'services', href: `/${locale}/services`, icon: Briefcase },
    { key: 'education', href: `/${locale}/education`, icon: GraduationCap },
    { key: 'news', href: `/${locale}/news`, icon: Newspaper },
    { key: 'gallery', href: `/${locale}/gallery`, icon: Images },
    { key: 'contact', href: `/${locale}/contact`, icon: Phone },
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
              "font-semibold text-base md:text-lg xl:text-xl hidden sm:inline-block transition-colors whitespace-nowrap",
              showSolidNav ? "text-foreground" : "text-white"
            )}>
              {locale === 'fa' ? 'کانون هموفیلی خراسان جنوبی' : 'South Khorasan Hemophilia Society'}
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
          <div className="flex items-center gap-1.5 md:gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  suppressHydrationWarning
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 px-2.5 rounded-md transition-all hover:scale-105 active:scale-95",
                    showSolidNav
                      ? "bg-gray-100 hover:bg-gray-200 text-foreground"
                      : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                  )}
                >
                  <span className={cn("text-xs font-bold", locale === 'fa' ? "font-vazir" : "font-sans")}>
                    {locale === 'fa' ? 'فارسی' : 'English'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 p-1 rounded-xl shadow-lg border-none bg-white/95 backdrop-blur-sm dark:bg-neutral-900/95">
                <DropdownMenuItem
                  onClick={() => switchLocale('fa')}
                  className={cn(
                    "rounded-lg cursor-pointer flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors",
                    locale === 'fa' ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <span>فارسی</span>
                  {locale === 'fa' && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLocale('en')}
                  className={cn(
                    "rounded-lg cursor-pointer flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors",
                    locale === 'en' ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <span>English</span>
                  {locale === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
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
              <SheetTrigger asChild>
                <Button
                  suppressHydrationWarning
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "lg:hidden h-9 w-9",
                    showSolidNav ? "text-foreground" : "text-white"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={locale === 'fa' ? 'right' : 'left'}
                className="w-[300px] sm:w-[350px] p-0 bg-white dark:bg-neutral-900"
              >
                {/* Header */}
                <SheetHeader className="p-6 border-b bg-gray-50 dark:bg-neutral-800">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-bold text-lg text-foreground">
                      {locale === 'fa' ? 'کانون هموفیلی خراسان جنوبی' : 'South Khorasan Hemophilia Society'}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Navigation Links */}
                <div className="flex flex-col h-[calc(100%-180px)] overflow-y-auto bg-white dark:bg-neutral-900">
                  <nav className="p-4">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3.5 rounded-xl mb-1 transition-all",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground/80 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-foreground"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-base">{t(item.key)}</span>
                          {isActive && (
                            <div className={cn(
                              "w-2 h-2 rounded-full bg-primary",
                              locale === 'fa' ? 'mr-auto' : 'ml-auto'
                            )} />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Bottom Donate Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white dark:bg-neutral-900">
                  <Link href={`/${locale}/donate`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 text-base font-semibold rounded-xl gap-2">
                      <Heart className="w-5 h-5" />
                      {t('donate')}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
