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

// ! get all doctor
const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAllDoctor();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctors fetched successfully",
    data: result,
  });
});

// ! get doctor by id
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getDoctorById(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor fetched successfully",
    data: result,
  });
});

// ! update doctor
const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await DoctorService.updateDoctor(id as string, payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

// ! delete doctor
const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctor(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});
export const DoctorController = {
  createDoctor,
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
