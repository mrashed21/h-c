import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { DoctorService } from "./doctor.service";

// !create doctor controller
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await DoctorService.createDoctor(payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

export const DoctorController = {
  createDoctor,
};
