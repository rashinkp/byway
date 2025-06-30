"use client";

import { Header } from "@/components/layout/Header";
import BywayFooter from "@/components/Footer";
import NotificationModal from '@/components/notifications/NotificationModal';
import { useState } from 'react';
import { usePathname } from "next/navigation";
import { TopNavbar } from "@/components/common/layout/TopNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const pathname = usePathname();
  
  // Define authentication pages where breadcrumb should be hidden
  const authPages = [
    '/login',
    '/signup', 
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/'
  ];
  
  // Check if current page is an authentication page
  const isAuthPage = authPages.includes(pathname);
  
  const shouldShowLayout = !isAuthPage || (isAuthPage && !!children && children !== null && children !== undefined);
  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowLayout && <Header onNotificationClick={() => setNotificationOpen(true)} />}
      {!isAuthPage && <TopNavbar pathname={pathname} navItems={[]} noMargin />}
      <NotificationModal open={notificationOpen} onOpenChange={setNotificationOpen} />
      <main className="flex-1">{children}</main>
      {shouldShowLayout && <BywayFooter />}
    </div>
  );
}
