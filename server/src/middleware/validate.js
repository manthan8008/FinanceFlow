import { ApiError } from "../utils/http.js";

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.issues.map((issue) => issue.message).join(", "));
    }
    req.body = result.data;
    next();
  };
}
