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
    throw new Error("Failed to create user");
  }

  const patient = await prisma.$transaction(async (tx) => {
    const patientTx = await tx.patient.create({
      data: {
        userId: result.user.id,
        name: name,
        email: email,
      },
    });

    return patientTx;
  });

  return {
    ...result.user,
    patient,
  };
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
    throw new Error("Failed to create user");
  }

  if (result.user.status === UserStatus.INACTIVE) {
    throw new Error("User is inactive");
  }
  if (result.user.isDeleted || result.user.status === UserStatus.DELETED) {
    throw new Error("User is deleted");
  }
  return result.user;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
