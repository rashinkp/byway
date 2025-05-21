import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError, ZodSchema } from "zod";
import { HttpError } from "../../http/errors/http-error";

interface ValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

declare module "express" {
  interface Request {
    validatedBody?: any;
    validatedQuery?: any;
    validatedParams?: any;
  }
}

export const validateRequest =
  (schema: ValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body if schema is provided
      if (schema.body) {
        req.validatedBody = await schema.body.parseAsync(req.body);
      }

      // Validate query if schema is provided
      if (schema.query) {
        req.validatedQuery = await schema.query.parseAsync(req.query);
      }

      // Validate params if schema is provided
      if (schema.params) {
        req.validatedParams = await schema.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const errorMessages = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        throw new HttpError(
          `Validation failed: ${JSON.stringify(errorMessages)}`,
          StatusCodes.BAD_REQUEST
        );
      }

      // Pass unexpected errors to the error handler
      next(error);
    }
  };
