import { envConfig } from "./env.config";

const allowedOrigins = [
  envConfig.CORS_ORIGIN,
  envConfig.FRONTEND_URL,
].filter((origin) => origin && typeof origin === "string");

export const corsConfig = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
};
