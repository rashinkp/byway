"use client";

import { Header } from "@/components/layout/Header";
import NotificationModal from "@/components/notifications/NotificationModal";
import { useState } from "react";
import BywayFooter from "@/components/layout/Footer";
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
			<main className="">
				<PublicRouteWrapper>
					{children}
				</PublicRouteWrapper>
			</main>
			<BywayFooter />
		</div>
	);
}
