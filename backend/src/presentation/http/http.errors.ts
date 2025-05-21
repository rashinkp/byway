import { IHttpError, IHttpErrors } from "./interfaces/http-errors.interface";


export class HttpErrors implements IHttpErrors {
  error_400(): IHttpError {
    return {
      statusCode: 400,
      body: { success: false, message: "Bad Request" },
    };
  }
  error_422(): IHttpError {
    return {
      statusCode: 422,
      body: { success: false, message: "Unprocessable Entity" },
    };
  }
  error_500(): IHttpError {
    return {
      statusCode: 500,
      body: { success: false, message: "Internal Server Error" },
    };
  }
  error_404(): IHttpError {
    return {
      statusCode: 404,
        body : {success:false , message:'Not Found Error'}
      }
  }
}
