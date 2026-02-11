import { Request, Response } from "express";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { AuthService } from "./auth.service";

//! register patient
const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.registerPatient(payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient registered successfully",
    data: result,
  });
});

export const AuthController = {
  registerPatient,
};
