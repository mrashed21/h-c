import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

// ! get all doctor
router.get("/", DoctorController.getAllDoctor);

// ! get doctor by id
router.get("/:id", DoctorController.getDoctorById);

// ! update doctor
router.patch("/:id", DoctorController.updateDoctor);

// ! delete doctor
router.put("/:id", DoctorController.deleteDoctor);

export const DoctorRouter = router;
