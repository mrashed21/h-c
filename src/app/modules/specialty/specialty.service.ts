import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// ! create specialty
const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const result = await prisma.specialty.create({
    data: payload,
  });
  return result;
};

// ! get all specialties
const getAllSpecialties = async (): Promise<Specialty[]> => {
  const result = await prisma.specialty.findMany();
  return result;
};

// ! get specialty by id
const getSpecialtyById = async (id: string): Promise<Specialty | null> => {
  const result = await prisma.specialty.findUnique({
    where: {
      id,
    },
  });
  return result;
};

// ! update specialty
const updateSpecialty = async (
  id: string,
  payload: Partial<Specialty>,
): Promise<Specialty | null> => {
  const result = await prisma.specialty.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// ! delete specialty
const deleteSpecialty = async (id: string): Promise<Specialty | null> => {
  const result = await prisma.specialty.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtyService = {
  createSpecialty,
  getAllSpecialties,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
};
