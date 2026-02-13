import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { config } from "../../config/config";

export const globarErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (config.NODE_ENV === "development") {
    console.log("error form glober error handler", err);
  }

  let message: string = "Internal server error";

  let statusCode: number = status.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
};
