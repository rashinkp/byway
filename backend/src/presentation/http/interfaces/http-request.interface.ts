import { JwtPayload } from "../../express/middlewares/auth.middleware";


export interface IHttpRequest {
  headers?: Record<string, string>;
  body?: any;
  params: Record<string, string>;
  query?: Record<string, string>;
  user?: JwtPayload; 
}
