import status from "http-status";
import AppError from "../../../errorHelper/app-error";
import {
  Specialty,
  UserRole,
  UserStatus,
} from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctor, IUpdateDoctor } from "./doctor.interface";

// !create doctor
const createDoctor = async (payload: ICreateDoctor) => {
  //   !specialty check
  const specialties: Specialty[] = [];
  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });

    if (!specialty) {
      throw new AppError(status.BAD_REQUEST, "Specialty not found");
    }

    specialties.push(specialty);
  }

  // ! doctor check in user

  const user = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (user) {
    throw new AppError(status.BAD_REQUEST, "Doctor already exists");
  }

  // ! create doctor
  const doctorData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.passsword,
      role: UserRole.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorDataTx = await tx.doctor.create({
        data: {
          userId: doctorData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorDataTx.id,
          specialtyId: specialty.id,
        };
      });

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorDataTx.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });

    return result;
  } catch (error) {
    console.log(error);
    await prisma.user.delete({
      where: {
        id: doctorData.user.id,
      },
    });
    throw new AppError(status.BAD_REQUEST, "Failed to create doctor");
  }
};

//! get all doctor
const getAllDoctor = async () => {
  const doctor = await prisma.doctor.findMany({
    where: {
      user: {
        isDeleted: false,
        status: UserStatus.ACTIVE,
      },
    },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      address: true,
      registrationNumber: true,
      experience: true,
      gender: true,
      appointmentFee: true,
      qualification: true,
      currentWorkingPlace: true,
      designation: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          emailVerified: true,
          image: true,
          isDeleted: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      specialties: {
        select: {
          specialty: true,
        },
      },
    },
  });

  return doctor;
};

//! get doctor by id
const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
      user: {
        isDeleted: false,
        status: UserStatus.ACTIVE,
      },
    },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      address: true,
      registrationNumber: true,
      experience: true,
      gender: true,
      appointmentFee: true,
      qualification: true,
      currentWorkingPlace: true,
      designation: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          emailVerified: true,
          image: true,
          isDeleted: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      specialties: {
        select: {
          specialty: true,
        },
      },
    },
  });

  return doctor;
};

//! update doctor also update specialties feilds
const updateDoctor = async (id: string, payload: IUpdateDoctor) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctor) {
    throw new AppError(status.BAD_REQUEST, "Doctor not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedDoctor = await tx.doctor.update({
      where: { id },
      data: payload.doctor,
    });

    if (payload.specialties && payload.specialties.length > 0) {
      await tx.doctorSpecialty.deleteMany({
        where: { doctorId: id },
      });

      const validSpecialties = await tx.specialty.findMany({
        where: {
          id: { in: payload.specialties },
        },
        select: { id: true },
      });

      if (validSpecialties.length !== payload.specialties.length) {
        throw new AppError(
          status.BAD_REQUEST,
          "One or more specialties not found",
        );
      }

      await tx.doctorSpecialty.createMany({
        data: payload.specialties.map((specialtyId) => ({
          doctorId: id,
          specialtyId,
        })),
      });
    }

    return updatedDoctor;
  });

  return result;
};

// !delete doctor
const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!doctor) {
    throw new AppError(status.BAD_REQUEST, "Doctor not found");
  }

  const result = await prisma.user.update({
    where: {
      id: doctor.userId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return result;
};
export const DoctorService = {
  createDoctor,
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
