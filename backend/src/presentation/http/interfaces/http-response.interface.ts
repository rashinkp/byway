export interface IHttpResponse<T = unknown> {
  statusCode: number;
  body: T;
  headers?: Record<string, string>;
  cookie?: {
    action: "set" | "clear";
    user?: { id: string; email: string; role: string };
  };
}
