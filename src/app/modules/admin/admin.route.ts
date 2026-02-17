import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request";
import { AdminController } from "./admin.controller";
import { updateAdminZodSchema } from "./admin.validate";

const router = Router();

// ! get all admin
router.get("/", AdminController.getAllAdmin);

// ! get admin by id
router.get("/:id", AdminController.getAdminById);

// ! update admin
router.patch(
  "/:id",
//   validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin,
);

// ! delete admin
router.put("/:id", AdminController.deleteAdmin);

export const AdminRouter = router;
