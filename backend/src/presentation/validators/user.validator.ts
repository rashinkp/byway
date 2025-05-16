import { z } from "zod";
import { GetAllUsersDtoSchema, GetUserDtoSchema, ToggleDeleteUserDtoSchema, UpdateUserDtoSchema } from "../../domain/dtos/user/user.dto";

export function validateGetAllUsers(data: unknown) {
  return GetAllUsersDtoSchema.parse(data);
}

export function validateToggleDeleteUser(data: unknown) {
  return ToggleDeleteUserDtoSchema.parse(data);
}

export function validateUpdateUser(data: unknown) {
  return UpdateUserDtoSchema.parse(data);
}

export function validateGetUser(data: unknown) {
  return GetUserDtoSchema.parse(data);
}
