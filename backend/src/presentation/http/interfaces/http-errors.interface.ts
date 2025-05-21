export interface IHttpError {
  statusCode: number;
  body: { success: boolean; message: string; data?: any };
}

export interface IHttpErrors {
  error_400(): IHttpError;
  error_422(): IHttpError;
  error_500(): IHttpError;
  error_404(): IHttpError;
}
