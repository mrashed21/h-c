import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();
// ! create doctor
router.post("/", DoctorController.createDoctor);

export const DoctorRouter = router;
