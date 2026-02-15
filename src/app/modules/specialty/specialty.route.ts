import { NextFunction, Request, Response, Router } from "express";
import status from "http-status";
import { config } from "../../../config/config";
import AppError from "../../../errorHelper/app-error";
import { UserRole } from "../../../generated/prisma/enums";
import { cookieUtils } from "../../../utils/cookie";
import { IJwtPayload, jwtUtils } from "../../../utils/jwt";
import { SpecialtyController } from "./specialty.controller";

const router = Router();
// ! create specialty
router.post("/", SpecialtyController.createSpecialtyController);

// ! get all specialties
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
      }
      const verifiedToken = jwtUtils.verifyToken<IJwtPayload>(
        accessToken,
        config.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success || !verifiedToken.data) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
      }

      if (verifiedToken.data.role !== UserRole.ADMIN) {
        throw new AppError(status.FORBIDDEN, "Forbidden access");
      }
      next();
    } catch (error: any) {
      next(error);
    }
  },
  SpecialtyController.getAllSpecialtiesController,
);

// ! get specialty by id
router.get("/:id", SpecialtyController.getSpecialtyByIdController);

// ! update specialty
router.patch("/:id", SpecialtyController.updateSpecialtyController);

// ! delete specialty
router.delete("/:id", SpecialtyController.deleteSpecialtyController);

export const SpecialtyRouter = router;
