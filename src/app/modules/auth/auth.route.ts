import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import checkAuth from "../../middleware/check-auth";
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

// ! get me
router.get(
  "/me",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ),
  AuthController.getMe,
);

export const AuthRouter = router;
