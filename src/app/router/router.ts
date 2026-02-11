import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { SpecialtyRouter } from "../modules/specialty/specialty.route";

const router = Router();
//! auth router
router.use("/auth", AuthRouter);

//! specialty router
router.use("/specialties", SpecialtyRouter);

export default router;
