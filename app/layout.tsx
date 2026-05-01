import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AJIKS — Akademi Jasmani Tracker',
  description: 'Sistem Penilaian Kebugaran Jasmani SAMAPTA Berbasis POLRI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-dark-bg text-dark-text antialiased">{children}</body>
    </html>
  );
}
