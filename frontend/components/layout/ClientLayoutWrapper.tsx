'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { useEffect, useState } from 'react';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem('floodtwin_user');

    if (!user && !isLoginPage) {
      router.push('/login');
    } else if (user && pathname === '/') {
      router.push('/dashboard');
    }
  }, [pathname, isLoginPage, router]);

  // To prevent hydration mismatch UI flashing, we could return null before mount, 
  // but it's better to just render the children if it's the login page, 
  // or render the layout if it's not.
  if (!isMounted) return null;

  if (isLoginPage) {
    return <main className="flex-1 w-full h-full min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <div className="flex flex-1 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
