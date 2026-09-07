import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '@/context/DemoContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';

export const metadata: Metadata = {
  title: 'FloodTwin - Urban Flood Intelligence Platform',
  description:
    'Urban Flood Nowcasting & Decision Support System for Hindmata, Brihanmumbai Municipal Corporation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-slate-900 selection:text-white">
        <DemoProvider>
          {/* Core App Shell: Sidebar + TopHeader + Page Content */}
          <div className="flex flex-1 min-h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
              <TopHeader />
              <main className="flex-1 p-6 overflow-y-auto bg-slate-50">{children}</main>
            </div>
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
