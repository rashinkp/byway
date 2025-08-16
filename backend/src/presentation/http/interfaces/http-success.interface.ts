export interface IHttpSuccess {
  success_200<T = unknown>(data: T): { statusCode: number; body: T };
  success_201<T = unknown>(data: T): { statusCode: number; body: T };
}
