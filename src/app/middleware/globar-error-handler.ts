import { NextFunction, Request, Response } from "express";
import status from "http-status";
import z from "zod";
import { config } from "../../config/config";
import AppError from "../../errorHelper/app-error";
import { handleZodError } from "../../errorHelper/error-helper";
import {
  TErrorSource,
  TGenericErrorResponse,
} from "../interface/error.interface";

export const globarErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (config.NODE_ENV === "development") {
    console.log("error form glober error handler", err);
  }

  let errorSource: TErrorSource[] = [];
  let message: string = "Internal server error";
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let stack = err.stack;

  if (err instanceof z.ZodError) {
    const errorResponse = handleZodError(err);
    statusCode = errorResponse.statusCode as number;
    message = errorResponse.message;
    errorSource = errorResponse.errorSource;

    errorSource = err.issues.map((issue) => {
      return {
        path:
          issue.path.length > 1
            ? issue.path.join(" -> ")
            : issue.path[0].toString() || "unknown",
        message: issue.message,
      };
    });
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        path: "",
        message: err.message,
      },
    ];
    stack = err.stack;
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSource = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse: TGenericErrorResponse = {
    success: false,
    statusCode,
    message: message,
    errorSource,
    error: config.NODE_ENV === "development" ? err : null,
    stack: config.NODE_ENV === "development" ? stack : null,
  };
  res.status(statusCode).json(errorResponse);
};
