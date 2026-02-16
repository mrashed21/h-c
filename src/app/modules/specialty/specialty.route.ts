import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import checkAuth from "../../middleware/check-auth";
import { SpecialtyController } from "./specialty.controller";

const router = Router();
// ! create specialty
router.post(
  "/",
  checkAuth(UserRole.PATIENT),
  SpecialtyController.createSpecialtyController,
);

// ! get all specialties
router.get(
  "/",
  checkAuth(UserRole.PATIENT),
  SpecialtyController.getAllSpecialtiesController,
);

// ! get specialty by id
router.get(
  "/:id",
  checkAuth(UserRole.ADMIN),
  SpecialtyController.getSpecialtyByIdController,
);

// ! update specialty
router.patch("/:id", SpecialtyController.updateSpecialtyController);

// ! delete specialty
router.delete("/:id", SpecialtyController.deleteSpecialtyController);

export const SpecialtyRouter = router;
