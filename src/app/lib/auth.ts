import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { config } from "../config/config";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24, // 1 day (seconds)
    updateAge: 60 * 60 * 24, // 1 day (seconds)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day (seconds)
    },
  },

  trustedOrigins: [config.BETTER_AUTH_URL! || "http://localhost:5000"],
  advanced: {
    disableCSRFCheck: true,
  },
});
