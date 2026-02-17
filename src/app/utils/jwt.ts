import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { UserRole, UserStatus } from "../../generated/prisma/enums";

export interface IJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isDeleted: boolean;
  status: UserStatus;
  emailVerified: boolean;
}

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = <T extends JwtPayload>(
  token: string,
  secret: string,
): {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
} => {
  try {
    const decoded = jwt.verify(token, secret) as T;

    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

const decodeToken = <T = JwtPayload>(token: string): T | null => {
  return jwt.decode(token) as T | null;
};

export const jwtUtils = {
  createToken,
  verifyToken,
  decodeToken,
};
