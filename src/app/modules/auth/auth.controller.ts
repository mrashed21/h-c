import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelper/app-error";

//! register patient
const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.registerPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.createAccessTokenAndSetCookie(res, accessToken);
  tokenUtils.createRefreshTokenAndSetCookie(res, refreshToken);
  tokenUtils.setBetterAuthCookie(res, token as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient registered successfully",
    data: {
      ...rest,
      accessToken,
      refreshToken,
      token,
    },
  });
});

//! login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.createAccessTokenAndSetCookie(res, accessToken);
  tokenUtils.createRefreshTokenAndSetCookie(res, refreshToken);
  tokenUtils.setBetterAuthCookie(res, token);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      ...rest,
      accessToken,
      refreshToken,
      token,
    },
  });
});

//!get me
const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

// ! get new token
const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        if (!refreshToken) {
            throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
        }
        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.createAccessTokenAndSetCookie(res, accessToken);
        tokenUtils.createRefreshTokenAndSetCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthCookie(res, sessionToken);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "New tokens generated successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            },
        });
    }
)
export const AuthController = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
};
