import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کانون هموفیلی خراسان جنوبی',
  description: 'حامی بیماران هموفیلی و خانواده‌هایشان',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
