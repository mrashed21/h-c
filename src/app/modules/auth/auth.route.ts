import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

//! register patient
router.post("/register", AuthController.registerPatient);

//! login user
router.post("/login", AuthController.loginUser);

export const AuthRouter = router;
