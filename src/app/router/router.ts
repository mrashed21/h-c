import { Router } from "express";
import { AdminRouter } from "../modules/admin/admin.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { DoctorRouter } from "../modules/doctor/doctor.route";
import { ScheduleRoutes } from "../modules/shedule/shedule.route";
import { SpecialtyRouter } from "../modules/specialty/specialty.route";

const router = Router();
//! auth router
router.use("/auth", AuthRouter);

//! specialty router
router.use("/specialties", SpecialtyRouter);

//! doctor router
router.use("/doctor", DoctorRouter);

// ! admin router
router.use("/admin", AdminRouter);

// ! schedule router
router.use("/schedule", ScheduleRoutes);

export default router;
