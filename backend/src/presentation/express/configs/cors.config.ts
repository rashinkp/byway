import { envConfig } from "./env.config";

export const corsConfig = {
  origin: [envConfig.CORS_ORIGIN, envConfig.FRONTEND_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
