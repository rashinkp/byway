import { JwtPayload } from "../../express/middlewares/auth.middleware";
import { Response } from "express";

export interface IHttpRequest {
  headers?: Record<string, string>;
  body?: any;
  params: Record<string, string>;
  query?: Record<string, string>;
  user?: JwtPayload; 
  cookies?: Record<string, any>;
  res?: Response;
}
