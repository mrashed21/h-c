import z from "zod";

export const createAdminZodSchema = z.object({
  name: z.string("Name must be a string"),
  email: z
    .string("Email must be a string")
    .email("Email must be a valid email"),
  password: z
    .string("Password must be a string")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
  profilePhoto: z.url("Profile photo must be a valid URL").optional(),
  contactNumber: z
    .string("Contact number must be a string")
    .min(11, "Contact number must be at least 11 characters")
    .max(14, "Contact number must be at most 15 characters")
    .optional(),
});

export const updateAdminZodSchema = z
  .object({
    name: z.string("Name must be a string").optional(),
    profilePhoto: z.url("Profile photo must be a valid URL").optional(),
    contactNumber: z
      .string("Contact number must be a string")
      .min(11, "Contact number must be at least 11 characters")
      .max(14, "Contact number must be at most 15 characters")
      .optional(),
  })
  .optional();
