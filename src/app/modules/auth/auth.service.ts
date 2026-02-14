import status from "http-status";
import AppError from "../../../errorHelper/app-error";
import { UserStatus } from "../../../generated/prisma/enums";
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

    return patient;
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
// const registerPatient = async (payload: IRegisterPatient) => {
//   const { name, email, password } = payload;

//   const result = await auth.api.signUpEmail({
//     body: {
//       name,
//       email,
//       password,
//     },
//   });

//   if (!result.user) {
//     throw new Error("Failed to create user");
//   }

//   const patient = await prisma.patient.create({
//     data: {
//       userId: result.user.id,
//       name,
//       email,
//     },
//   });

//   return {
//     ...result.user,
//     patient,
//   };
// };

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
  return result.user;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
