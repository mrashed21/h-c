import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { AdminService } from "./admin.service";

// ! create admin controller
const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AdminService.createAdmin(payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});

// ! get all admin controller
const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllAdmin();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admins fetched successfully",
        data: result,
    });
});

// ! get admin by id controller
const getAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.getAdminById(id as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin fetched successfully",
        data: result,
    });
});

// ! update admin controller
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await AdminService.updateAdmin(id as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: result,
    });
});

// ! delete admin controller
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.deleteAdmin(id as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
});

export const AdminController = {
    createAdmin,
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
