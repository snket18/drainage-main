import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '@/context/DemoContext';
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
import { Toaster } from 'sonner';

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
          {/* Core App Shell: Handled by ClientLayoutWrapper */}
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          {/* Toast Notifications */}
          <Toaster position="top-right" richColors theme="light" closeButton />
        </DemoProvider>
      </body>
    </html>
  );
}
