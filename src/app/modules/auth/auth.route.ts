import { Router } from "express";
import { DoctorController } from "../doctor/doctor.controller";
import { AuthController } from "./auth.controller";

const router = Router();

//! register patient
router.post("/register", AuthController.registerPatient);

//! login user
router.post("/login", AuthController.loginUser);

// ! create doctor
router.post("/create-doctor", DoctorController.createDoctor);

export const AuthRouter = router;
