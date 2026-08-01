import { Router } from "express";
import { requireUser } from "../middleware/requireUser.js";
import { getPlan } from "../services/planService.js";
import { getProfile } from "../services/profileService.js";
import { loginUser, registerUser } from "../services/authService.js";
import { toPublicUser } from "../utils/publicUser.js";
import { normalizeLoginPayload, normalizeRegisterPayload } from "../utils/validators.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const result = await registerUser(normalizeRegisterPayload(req.body));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const result = await loginUser(normalizeLoginPayload(req.body));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (_req, res) => {
  res.status(204).end();
});

router.get("/me", requireUser, async (req, res, next) => {
  try {
    const profile = await getProfile(req.authUser.id);
    const plan = await getPlan(req.authUser.id);

    res.json({
      user: toPublicUser(req.authUser, profile),
      plan,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
