import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";
import { getProfile } from "../services/profileService.js";

export async function requireUser(req, _res, next) {
  try {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) throw new HttpError(401, "Missing session token.");

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "qiwam-api",
      audience: "qiwam-web",
    });
    const profile = await getProfile(decoded.sub);
    if (!profile) throw new HttpError(401, "Invalid session token.");

    req.authToken = token;
    req.authUser = {
      id: profile.id,
      email: profile.email,
      user_metadata: {
        full_name: profile.full_name,
        username: profile.username,
      },
    };
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" ? new HttpError(401, "Invalid session token.") : error);
  }
}
