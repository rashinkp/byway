"use client";

import { Header } from "@/components/layout/Header";
import NotificationModal from "@/components/notifications/NotificationModal";
import { useState } from "react";
import { PublicRouteWrapper } from "@/components/auth/PublicRouteWrapper";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [notificationOpen, setNotificationOpen] = useState(false);

	return (
		<div className="flex flex-col min-h-screen">
			<Header onNotificationClick={() => setNotificationOpen(true)} transparent />
			<NotificationModal
				open={notificationOpen}
				onOpenChange={setNotificationOpen}
			/>
			<main className="flex-1 flex flex-col overflow-hidden">
				<PublicRouteWrapper>
					{children}
				</PublicRouteWrapper>
			</main>
		</div>
	);
}
