import {  NextResponse } from "next/server";

export async function POST() {
	try {
		const response = NextResponse.json({
			success: true,
			message: "Logged out successfully",
		});

		response.cookies.set("jwt", "", {
			path: "/",
			expires: new Date(0),
			httpOnly: true,
			sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
			secure: process.env.NODE_ENV === "production",
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
