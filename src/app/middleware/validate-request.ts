import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseData = schema.safeParse(req.body);
    if (!parseData.success) {
      next(parseData.error);
    }
    req.body = parseData.data;
    next();
  };
};
