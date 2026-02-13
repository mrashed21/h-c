import { NextFunction, Request, Response } from "express";
import status from "http-status";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: `Method :"${req.method}" || URL :"${req.originalUrl}" Not Found`,
    path: req.path,
    error: "Route Not Found",
    timestamp: new Date().toLocaleString(),
  });
};
