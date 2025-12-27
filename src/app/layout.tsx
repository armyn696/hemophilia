import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کانون هموفیلی خراسان جنوبی',
  description: 'حامی بیماران هموفیلی و خانواده‌هایشان',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
