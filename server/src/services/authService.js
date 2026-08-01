import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { HttpError } from "../utils/httpError.js";
import { isEmail } from "../utils/validators.js";
import { toPublicUser } from "../utils/publicUser.js";
import { getPlan } from "./planService.js";
import { createProfile, findProfileByIdentifier, profileEmailOrNameExists } from "./profileService.js";

const JWT_ISSUER = "qiwam-api";
const JWT_AUDIENCE = "qiwam-web";
const TOKEN_EXPIRES_IN = "15d";

function signProfileToken(profile) {
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

  return jwt.sign(
    {
      email: profile.email,
      name: profile.fullName || profile.full_name || profile.username,
    },
    process.env.JWT_SECRET,
    {
      subject: profile.id,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      expiresIn: TOKEN_EXPIRES_IN,
    },
  );
}

function toAuthUser(profile) {
  return {
    id: profile.id,
    email: profile.email,
    user_metadata: {
      full_name: profile.fullName || profile.full_name,
      username: profile.username,
    },
  };
}

export async function registerUser({ name, email, password }) {
  if (!name || !isEmail(email) || password.length < 8) {
    throw new HttpError(400, "Complete all fields. Password must be at least 8 characters.");
  }

  const exists = await profileEmailOrNameExists({ email, name });
  if (exists) throw new HttpError(409, "Email or name already registered.");

  const passwordHash = await bcrypt.hash(password, 12);
  const profile = await createProfile({
    id: randomUUID(),
    name,
    email,
    passwordHash,
  });

  const accessToken = signProfileToken(profile);

  return {
    accessToken,
    user: toPublicUser(toAuthUser(profile), {
      full_name: profile.fullName,
      username: profile.username,
      email: profile.email,
    }),
    plan: null,
  };
}

export async function loginUser({ identifier, password }) {
  const profile = await findProfileByIdentifier(identifier);
  if (!profile?.password_hash) {
    throw new HttpError(401, "Incorrect email/name or password.");
  }

  const passwordOk = await bcrypt.compare(password, profile.password_hash);
  if (!passwordOk) throw new HttpError(401, "Incorrect email/name or password.");

  const accessToken = signProfileToken({
    id: profile.id,
    email: profile.email,
    username: profile.username,
    fullName: profile.full_name,
  });
  const plan = await getPlan(profile.id);

  return {
    accessToken,
    user: toPublicUser(toAuthUser(profile), profile),
    plan,
  };
}
