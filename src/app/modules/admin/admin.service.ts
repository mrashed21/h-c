import { prisma } from "../../lib/prisma";

// ! get all admin
const getAllAdmin = async () => {
  const result = await prisma.admin.findMany();
  return result;
};

// ! get admin by id
const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
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

// ! delete admin
const deleteAdmin = async (id: string) => {
  const result = await prisma.admin.delete({
    where: {
      id,
    },
  });
  return result;
};

export const AdminService = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
