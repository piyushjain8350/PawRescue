import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PawRescue - Animal Rescue & Adoption',
  description: 'Find your perfect companion and make a difference. Adopt rescue animals, find veterinary care, and volunteer with PawRescue.',
  keywords: 'animal rescue, pet adoption, veterinary care, volunteer, animal shelter, dogs, cats, animal welfare',
  authors: [{ name: 'PawRescue Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10B981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}