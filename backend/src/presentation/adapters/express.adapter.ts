import { Request, Response, NextFunction } from "express";
import { IHttpRequest } from "../http/interfaces/http-request.interface";
import { IHttpResponse } from "../http/interfaces/http-response.interface";
import { CookieService } from "../http/utils/cookie.service";
import { JwtProvider } from "../../infra/providers/auth/jwt.provider";

export async function expressAdapter(
  request: Request,
  response: Response,
  handler: (httpRequest: IHttpRequest) => Promise<IHttpResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const httpRequest: IHttpRequest = {
      headers: request.headers as Record<string, string>,
      body: request.body,
      params: request.params,
      query: request.query as Record<string, string>,
      user: request.user, // Pass req.user to httpRequest.user
      cookies: request.cookies,
      res: response,
    };
    const httpResponse = await handler(httpRequest);

    if (httpResponse.cookie) {
      if (httpResponse.cookie.action === "set" && httpResponse.cookie.user) {
        const jwtProvider = new JwtProvider();
        const { id, email, role } = httpResponse.cookie.user;
        CookieService.setAuthCookies(response, { id, email, role }, jwtProvider);
      } else if (httpResponse.cookie.action === "clear") {
        CookieService.clearAuthCookies(response);
      }
    }

    if (httpResponse.headers) {
      Object.entries(httpResponse.headers).forEach(([key, value]) => {
        response.setHeader(key, value);
      });
    }
    response.status(httpResponse.statusCode).json(httpResponse.body);
  } catch (err) {
    next(err);
  }
}
