import z from "zod";
// ! create doctor zod schema
export const createDoctorZodSchema = z.object({
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(30, "Name must be at most 30 characters long"),
    email: z.email("Email is required"),
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 digits long"),
    address: z
      .string("Address is required")
      .max(100, "Address must be at most 100 characters long"),
    experience: z.int(),
    qualification: z.string("Qualification is required"),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
    profilePhoto: z.string(),
  }),
  passsword: z.string(),
  specialties: z.array(z.string()),
});

// ! update doctor zod schema
export const updateDoctorZodSchema = z
  .object({
    doctor: z.object({
      name: z
        .string("Name is required")
        .min(3, "Name must be at least 3 characters long")
        .max(30, "Name must be at most 30 characters long"),
      email: z.email("Email is required"),
      contactNumber: z
        .string("Contact number is required")
        .min(11, "Contact number must be at least 11 digits long"),
      address: z
        .string("Address is required")
        .max(100, "Address must be at most 100 characters long"),
      experience: z.number("Experience is required"),
      qualification: z.string("Qualification is required"),
      gender: z.enum(["MALE", "FEMALE"]),
      appointmentFee: z.number(),
      currentWorkingPlace: z.string(),
      designation: z.string(),
      profilePhoto: z.string(),
    }),
    passsword: z.string(),
    specialties: z.array(z.string()),
  })
  .partial();
