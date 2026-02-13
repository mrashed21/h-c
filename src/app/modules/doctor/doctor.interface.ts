import { Gender } from "../../../generated/prisma/enums";
// ! create doctor interface
export interface ICreateDoctor {
  passsword: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber?: string;
    experience?: number;
    gender: Gender;
    appointmentFee?: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
  specialties: string[];
}

// ! update doctor interface
export interface IUpdateDoctor {
  passsword?: string;
  doctor: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber?: string;
    experience?: number;
    gender?: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentWorkingPlace?: string;
    designation?: string;
  };
  specialties?: string[];
}
