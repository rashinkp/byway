export interface IHttpError {
  statusCode: number;
  body: { success: boolean; message: string; data?: any };
}

export interface IHttpErrors {
  error_400(message?: string): IHttpError;
  error_401(message?: string): IHttpError;
  error_403(message?: string): IHttpError;
  error_404(message?: string): IHttpError;
  error_422(message?: string): IHttpError;
  error_500(message?: string): IHttpError;
}
