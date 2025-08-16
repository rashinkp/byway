import { IHttpSuccess } from "./interfaces/http-success.interface";

export class HttpSuccess implements IHttpSuccess {
  success_200<T = unknown>(data: T) {
    return {
      statusCode: 200,
      body: { success: true, message: "Success", ...data },
    };
  }
  success_201<T = unknown>(data: T) {
    return {
      statusCode: 201,
      body: { success: true, message: "Created", ...data },
    };
  }
}
