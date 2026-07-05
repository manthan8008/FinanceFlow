import { User } from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/http.js";
import { verifyToken } from "../utils/tokens.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new ApiError(401, "Authentication required");

  const payload = verifyToken(token);
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, "Invalid authentication token");

  req.user = user;
  next();
});
