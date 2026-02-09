import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router = Router();
// ! create specialty
router.post("/", SpecialtyController.createSpecialtyController);

// ! get all specialties
router.get("/", SpecialtyController.getAllSpecialtiesController);

// ! get specialty by id
router.get("/:id", SpecialtyController.getSpecialtyByIdController);

// ! update specialty
router.patch("/:id", SpecialtyController.updateSpecialtyController);

// ! delete specialty
router.delete("/:id", SpecialtyController.deleteSpecialtyController);

export const SpecialtyRouter = router;
