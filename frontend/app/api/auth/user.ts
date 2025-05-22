// src/pages/api/auth/user.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUserServer } from "@/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = req.headers.cookie || "";
    const user = await getCurrentUserServer(cookies);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
}
