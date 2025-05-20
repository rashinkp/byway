export interface IHttpSuccess {
  success_200(data: any): { statusCode: number; body: any };
  success_201(data: any): { statusCode: number; body: any };
}
