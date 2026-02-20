import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import checkAuth from "../../middleware/check-auth";
import { validateRequest } from "../../middleware/validate-request";
import { AdminController } from "../admin/admin.controller";
import { createAdminZodSchema } from "../admin/admin.validate";
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

// ! create admin
router.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  // checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.createAdmin,
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

// ! get new token
router.post(
  "/new-token",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ),
  AuthController.getNewToken,
);

// ! change password
router.post(
  "/change-password",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ),
  AuthController.changePassword,
);

// ! logout user
router.post(
  "/logout",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ),
  AuthController.logoutUser,
);

export const AuthRouter = router;
