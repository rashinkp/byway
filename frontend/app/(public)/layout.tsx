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
  return (
    <div className="flex flex-col min-h-screen">
      <Header onNotificationClick={() => setNotificationOpen(true)} />
      <TopNavbar pathname={pathname} navItems={[]} noMargin />
      <NotificationModal open={notificationOpen} onOpenChange={setNotificationOpen} />
      <main className="flex-1">{children}</main>
      <BywayFooter />
    </div>
  );
}
