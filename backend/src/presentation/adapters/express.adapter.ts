import { Request, Response } from "express";
import { IHttpRequest } from "../http/interfaces/http-request.interface";
import { IHttpResponse } from "../http/interfaces/http-response.interface";
import { CookieService } from "../http/utils/cookie.service";

export async function expressAdapter(
  request: Request,
  response: Response,
  handler: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
): Promise<void> {
  const httpRequest: IHttpRequest = {
    headers: request.headers as Record<string, string>,
    body: request.body,
    params: request.params,
    query: request.query as Record<string, string>,
  };
  const httpResponse = await handler(httpRequest);

  // Handle cookies
  if (httpResponse.cookie) {
    if (httpResponse.cookie.action === "set" && httpResponse.cookie.user) {
      CookieService.setAuthCookie(response, httpResponse.cookie.user);
    } else if (httpResponse.cookie.action === "clear") {
      CookieService.clearAuthCookie(response);
    }
  }

  // Handle headers
  if (httpResponse.headers) {
    Object.entries(httpResponse.headers).forEach(([key, value]) => {
      response.setHeader(key, value);
    });
  }

  response.status(httpResponse.statusCode).json(httpResponse.body);
}
