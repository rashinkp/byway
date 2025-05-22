import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers["x-user"];
  res.status(200).json({ user: user ? JSON.parse(user as string) : null });
}
