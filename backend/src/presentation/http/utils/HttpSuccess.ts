import { IHttpSuccess } from "../interfaces/IHttpSuccess";

export class HttpSuccess implements IHttpSuccess {
  constructor(public data: any, public message: string = "Success") {}
}
