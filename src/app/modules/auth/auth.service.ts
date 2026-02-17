import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/app-error";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";

interface IRegisterPatient {
  name: string;
  email: string;
  password: string;
}

//! register patient
const registerPatient = async (payload: IRegisterPatient) => {
  const { name, email, password } = payload;
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!result.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to create user");
  }

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: result.user.id,
          name: name,
          email: email,
        },
      });

      return {
        ...result.user,
        patient: patientTx,
      };
    });

    const accessToken = tokenUtils.getAccessToken({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      isDeleted: result.user.isDeleted,
      status: result.user.status,
      emailVerified: result.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      isDeleted: result.user.isDeleted,
      status: result.user.status,
      emailVerified: result.user.emailVerified,
    });

    return {
      ...result.user,
      patient,
      accessToken,
      refreshToken,
      token: result.token,
    };
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: result.user.id,
      },
    });
    throw error;
  }
};

// ! login user
const loginUser = async (payload: IRegisterPatient) => {
  const { email, password } = payload;
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!result.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to create user");
  }

  if (result.user.status === UserStatus.INACTIVE) {
    throw new AppError(status.BAD_REQUEST, "User is inactive");
  }
  if (result.user.isDeleted || result.user.status === UserStatus.DELETED) {
    throw new AppError(status.BAD_REQUEST, "User is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
    role: result.user.role,
    isDeleted: result.user.isDeleted,
    status: result.user.status,
    emailVerified: result.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
    role: result.user.role,
    isDeleted: result.user.isDeleted,
    status: result.user.status,
    emailVerified: result.user.emailVerified,
  });

  return {
    ...result.user,
    token: result.token,
    accessToken,
    refreshToken,
  };
};

// !get me
const getMe = async (userId: string) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      patients: {
        include: {
          appointments: true,
          reviews: true,
          prescriptions: true,
          medicalReports: true,
          patientHealthData: true,
        },
      },
      doctors: {
        include: {
          specialties: true,
          appointments: true,
          reviews: true,
          prescriptions: true,
        },
      },
      admins: true,
    },
  });

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isUserExists;
};
export const AuthService = {
  registerPatient,
  loginUser,
  getMe,
};
