export interface IRegisterPatient {
  name: string;
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}