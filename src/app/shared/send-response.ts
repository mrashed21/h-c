import { Response } from "express";

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(res: Response, responseData: IResponse<T>) => {
  const { statusCode, success, message, data } = responseData;
  res.status(statusCode).json({
    success,
    message,
    data,
    meta: responseData.meta,
  });
};
