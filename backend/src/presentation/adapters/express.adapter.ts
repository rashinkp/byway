import { Request, Response } from "express";
import { IController } from "../http/interfaces/controller.interface";
import { IHttpRequest } from "../http/interfaces/http-request.interface";

export async function expressAdapter(
  request: Request,
  response: Response,
  controller: IController
): Promise<void> {
  const httpRequest: IHttpRequest = {
    headers: request.headers as Record<string, string>,
    body: request.body,
    params: request.params,
    query: request.query as Record<string, string>,
  };
  const httpResponse = await controller.handle(httpRequest);
  response.status(httpResponse.statusCode).json(httpResponse.body);
}
