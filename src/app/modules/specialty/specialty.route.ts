import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router = Router();

router.post("/", SpecialtyController.createSpecialtyController);

export const SpecialtyRouter = router;
