import { TErrorSource, TGenericErrorResponse } from "../app/interface/error.interface";
import { z } from "zod";
import status from "http-status";

export const handleZodError = (err: z.ZodError): TGenericErrorResponse => {

    const statusCode = status.BAD_REQUEST;
    const message = err.message;
    const errorSource: TErrorSource[] = [];
    
    err.issues.forEach((issue: z.ZodIssue) => {
        errorSource.push({
            path: issue.path.join(" -> "),
            message: issue.message,
        });
    });
    const errorResponse: TGenericErrorResponse = {
        success: false,
        message,
        errorSource,
        error: err,
        statusCode
    };
    return errorResponse;
}