import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RaeburnAI Workflow Auditor',
  description: 'Open-source Lighthouse-style AI workflow auditor for SMEs and consultancies.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'RaeburnAI Workflow Auditor',
    description: 'Upload SOPs and process docs. Find AI automation opportunities, savings and roadmap.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}