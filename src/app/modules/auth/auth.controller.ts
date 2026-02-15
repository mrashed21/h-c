import { Request, Response } from "express";
import status from "http-status";
import { tokenUtils } from "../../../utils/token";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { AuthService } from "./auth.service";

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

export const AuthController = {
  registerPatient,
  loginUser,
};
