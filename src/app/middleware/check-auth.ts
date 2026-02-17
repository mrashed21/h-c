import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { config } from "../config/config";

import AppError from "../errorHelper/app-error";
import { prisma } from "../lib/prisma";
import { cookieUtils } from "../utils/cookie";
import { IJwtPayload, jwtUtils } from "../utils/jwt";

const checkAuth =
  (...roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ! check session token
      const sesitiontoken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sesitiontoken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
      }

      if (sesitiontoken) {
        const sesitionExsits = await prisma.session.findFirst({
          where: {
            token: sesitiontoken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sesitionExsits && sesitionExsits.user) {
          const user = sesitionExsits.user;
          const now = new Date();
          const expiresAt = new Date(sesitionExsits.expiresAt);
          const createdAt = new Date(sesitionExsits.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const persentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (persentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expire-At", expiresAt.toISOString());
            res.setHeader("X-Session-Remaining", timeRemaining.toString());
            console.log("Session is about to expire");
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.INACTIVE
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active",
            );
          }

          if (user.status === UserStatus.DELETED) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is deleted",
            );
          }

          if (roles.length > 0 && !roles.includes(user.role)) {
            throw new AppError(status.FORBIDDEN, "Forbidden access");
          }

          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }
        // return next();
      }

      // ! check access token
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

      if (roles.length > 0 && !roles.includes(verifiedToken.data.role)) {
        throw new AppError(status.FORBIDDEN, "Forbidden access");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
