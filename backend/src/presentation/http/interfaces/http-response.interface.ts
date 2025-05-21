export interface IHttpResponse {
  statusCode: number;
  body: any;
  headers?: Record<string, string>;
  cookie?: {
    action: "set" | "clear";
    user?: { id: string; email: string; role: string };
  };
}
