import { UserDTO } from "../../../app/dtos/general.dto";
import { Response } from "express";

export interface IHttpRequest<T = unknown> {
  headers?: Record<string, string>;
  body?: T;
  params: Record<string, string>;
  query?: Record<string, string>;
  user?: UserDTO;
  cookies?: Record<string, unknown>;
  res?: Response;
}
                                                                                                         