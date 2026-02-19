import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "../../../generated/prisma/enums";
import { config } from "../../config/config";
import AppError from "../../errorHelper/app-error";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
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

// ! get new token
const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.REFRESH_TOKEN_SECRET,
  );

  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};
export const AuthService = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
};
