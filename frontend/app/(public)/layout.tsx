"use client";

import { Header } from "@/components/layout/Header";
import NotificationModal from "@/components/notifications/NotificationModal";
import { useState } from "react";
import BywayFooter from "@/components/layout/Footer";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [notificationOpen, setNotificationOpen] = useState(false);

	return (
		<div className="flex flex-col min-h-screen">
			<Header onNotificationClick={() => setNotificationOpen(true)} />
			<NotificationModal
				open={notificationOpen}
				onOpenChange={setNotificationOpen}
			/>
			<main className="flex-1">{children}</main>
			<BywayFooter />
		</div>
	);
}
