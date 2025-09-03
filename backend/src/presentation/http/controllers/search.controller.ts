import { BaseController } from "./base.controller";
import { IGlobalSearchUseCase } from "../../../app/usecases/search/interfaces/global-search.usecase.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { BadRequestError } from "../errors/bad-request-error";
import { SearchParamsSchema } from "../../validators/search.validators";

export class SearchController extends BaseController {
  constructor(
    private _globalSearchUseCase: IGlobalSearchUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async globalSearch(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const query = request.query?.query as string;
      const page = request.query?.page as string;
      const limit = request.query?.limit as string;

      if (!query) {
        throw new BadRequestError("Search query is required");
      }

      const validatedParams = SearchParamsSchema.parse({
        query,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
      });

      const userId = request.user?.id;
      const result = await this._globalSearchUseCase.execute({
        ...validatedParams,
        userId,
      });
      return this.success_200(result, "Search results retrieved successfully");
    });
  }
}
