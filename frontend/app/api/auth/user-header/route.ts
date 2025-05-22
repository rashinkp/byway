import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = req.headers.get("x-user");
  return NextResponse.json({ user: user ? JSON.parse(user) : null });
}
