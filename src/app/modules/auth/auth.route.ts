import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request";
import { DoctorController } from "../doctor/doctor.controller";
import { createDoctorZodSchema } from "../doctor/doctor.validate";
import { AuthController } from "./auth.controller";

const router = Router();

//! register patient
router.post("/register", AuthController.registerPatient);

//! login user
router.post("/login", AuthController.loginUser);

// ! create doctor
router.post(
  "/create-doctor",
  validateRequest(createDoctorZodSchema),
  DoctorController.createDoctor,
);

export const AuthRouter = router;
