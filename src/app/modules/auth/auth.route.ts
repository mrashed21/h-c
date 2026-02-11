import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

//! register patient
router.post("/register", AuthController.registerPatient);

export const AuthRouter = router;
