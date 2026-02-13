import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request";
import { DoctorController } from "./doctor.controller";
import { updateDoctorZodSchema } from "./doctor.validate";

const router = Router();

// ! get all doctor
router.get("/", DoctorController.getAllDoctor);

// ! get doctor by id
router.get("/:id", DoctorController.getDoctorById);

// ! update doctor
router.patch(
  "/:id",
  validateRequest(updateDoctorZodSchema),
  DoctorController.updateDoctor,
);

// ! delete doctor
router.put("/:id", DoctorController.deleteDoctor);

export const DoctorRouter = router;
