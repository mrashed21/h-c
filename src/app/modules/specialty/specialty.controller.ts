import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { SpecialtyService } from "./specialty.service";

// ! create specialty

const createSpecialtyController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SpecialtyService.createSpecialty(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Specialty created successfully",
      data: result,
    });
  },
);

// ! get all specialties
const getAllSpecialtiesController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SpecialtyService.getAllSpecialties();

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Specialties fetched successfully",
      data: result,
    });
  },
);

// ! get specialty by id
const getSpecialtyByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtyService.getSpecialtyById(id as string);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Specialty fetched successfully",
      data: result,
    });
  },
);

// ! update specialty
const updateSpecialtyController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await SpecialtyService.updateSpecialty(
      id as string,
      payload,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Specialty updated successfully",
      data: result,
    });
  },
);

// ! delete specialty
const deleteSpecialtyController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtyService.deleteSpecialty(id as string);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Specialty deleted successfully",
      data: result,
    });
  },
);

export const SpecialtyController = {
  createSpecialtyController,
  getAllSpecialtiesController,
  getSpecialtyByIdController,
  updateSpecialtyController,
  deleteSpecialtyController,
};
