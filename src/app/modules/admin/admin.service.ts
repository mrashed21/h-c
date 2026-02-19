import status from "http-status";
import AppError from "../../errorHelper/app-error";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

//! create admin
const createAdmin = async (payload: any) => {
  const adminExists = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (adminExists) {
    throw new AppError(status.BAD_REQUEST, "Admin already exists");
  }

  const { password, role, ...adminData } = payload;

  const userData = await auth.api.signUpEmail({
    body: {
      ...adminData,
      password,
      role,
      needPasswordChange: true,
    },
  });

  try {
    const admin = await prisma.admin.create({
      data: {
        userId: userData.user.id,
        ...adminData,
      },
    });

    return admin;
  } catch (error) {
    await prisma.user.delete({
      where: { id: userData.user.id },
    });
    throw error;
  }
};

// ! get all admin
const getAllAdmin = async () => {
  const result = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

// ! get admin by id
const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

// ! update admin
const updateAdmin = async (id: string, payload: any) => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// ! delete admin (soft delete)
const deleteAdmin = async (id: string, userId: string) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!admin) {
    throw new AppError(status.BAD_REQUEST, "Admin not found");
  }

  if (admin.userId === userId) {
    throw new AppError(status.BAD_REQUEST, "You can not delete yourself");
  }
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return result;
};

export const AdminService = {
  createAdmin,
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
