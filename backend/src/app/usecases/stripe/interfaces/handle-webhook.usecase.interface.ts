import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";

export interface IWebhookInput {
  event: Buffer;
  signature: string;
}

export interface IHandleWebhookUseCase {
  execute(input: IWebhookInput): Promise<ApiResponse>;
} 