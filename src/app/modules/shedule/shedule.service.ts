import { IQueryParams } from "../../interface/query.interface";

// ! create shedule service
const createSchedule = (payload: any) => {};

// ! get all schedule
const getAllSchedules = (queryParams: IQueryParams) => {};

// ! get schedule by id
const getScheduleById = (id: string) => {};

// ! update schedule
const updateSchedule = (id: string, payload: any) => {};
// ! delete schedule
const deleteSchedule = (id: string) => {};
export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
