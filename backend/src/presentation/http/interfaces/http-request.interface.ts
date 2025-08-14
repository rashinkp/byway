import { UserDTO } from "../../../app/dtos/general.dto";
import { Response } from "express";

export interface IHttpRequest {
  headers?: Record<string, string>;
  body?: any;
  params: Record<string, string>;
  query?: Record<string, string>;
  user?: UserDTO;
  cookies?: Record<string, any>;
  res?: Response;
}
                                                                                                         