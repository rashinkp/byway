import {  NextResponse } from "next/server";

export async function POST() {
	try {
		const response = NextResponse.json({
			success: true,
			message: "Logged out successfully",
		});

		response.cookies.set("access_token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
		});

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 },
		);
	}
}
