import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import checkAuth from "../../middleware/check-auth";
import { validateRequest } from "../../middleware/validate-request";
import { SpecialtyController } from "./specialty.controller";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();
// ! create specialty
router.post(
  "/",
  // checkAuth(UserRole.PATIENT),
  multerUpload.single("file"),
  validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
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
