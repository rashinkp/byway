import { IHttpRequest } from "./http-request.interface";
import {  IHttpResponse } from "./http-response.interface";

export interface IController {
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
