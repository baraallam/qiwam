import { Router } from "express";
import { requireUser } from "../middleware/requireUser.js";
import { savePlan } from "../services/planService.js";

const router = Router();

router.put("/plan", requireUser, async (req, res, next) => {
  try {
    await savePlan(req.authUser.id, req.body.data);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
