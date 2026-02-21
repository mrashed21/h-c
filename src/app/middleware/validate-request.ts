import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (schema: z.ZodObject) => {
  // return (req: Request, res: Response, next: NextFunction) => {
  //   const parseData = schema.safeParse(req.body);
  //   if (!parseData.success) {
  //     next(parseData.error);
  //   }
  //   req.body = parseData.data;
  //   next();
  // };
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    const parsedResult = schema.safeParse(req.body);

    if (!parsedResult.success) {
      next(parsedResult.error);
    }

    //sanitizing the data
    req.body = parsedResult.data;

    next();
  };
};
