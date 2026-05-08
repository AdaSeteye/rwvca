import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'RWVCA Digital Platform',
  description: 'Rwanda Wood Value Chain Association — Unified Digital Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-60 min-h-screen bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
