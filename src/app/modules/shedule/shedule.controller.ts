import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interface/query.interface";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { ScheduleService } from "./shedule.service";

// !
const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await ScheduleService.createSchedule(payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

// ! get all schedule
const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const queryParams = req.query as IQueryParams;
  const result = await ScheduleService.getAllSchedules(queryParams);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedules fetched successfully",
    // data: result?.data,
    // meta: result?.meta,
  });
});

// ! get schedule by id
const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleService.getScheduleById(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedule fetched successfully",
    data: result,
  });
});

// ! update schedule
const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await ScheduleService.updateSchedule(id as string, payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedule updated successfully",
    data: result,
  });
});

// ! delete schedule
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ScheduleService.deleteSchedule(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedule deleted successfully",
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
