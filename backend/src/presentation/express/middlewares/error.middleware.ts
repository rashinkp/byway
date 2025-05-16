import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../http/utils/HttpErrors";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", details: err.errors });
  } else {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
