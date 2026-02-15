import status from "http-status";
import AppError from "../../../errorHelper/app-error";
import { UserStatus } from "../../../generated/prisma/enums";
import { tokenUtils } from "../../../utils/token";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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

export const AuthService = {
  registerPatient,
  loginUser,
};
