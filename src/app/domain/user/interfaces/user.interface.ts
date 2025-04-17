import { iStatusResponse } from '@/domain/status/interfaces/status.interface';
import { eRoles } from '@/shared/enums/roles.enum';

export interface iUser {
  id: string;
  fullname: string;
  nickname: string;
  nicknamePreference?: boolean | number;
  email: string;
  phone: string;
  role: eRoles;
  dateOfBirth: Date;
  dateOfRegistry: Date;
  password: string;
  birthDate: Date;
  registryDate: Date;
  status: iStatusResponse;
}

export interface iUserProfileResponse {
  fullname: string;
  nickname?: string;
  nicknamePreference?: string;
  email: string;
  phone: string;
}

export interface iUserShortResponse {
  id: string;
  fullname: string;
  nickname?: string;
  nicknamePreference: boolean;
}

export interface iUserRegisteredResponse {
  id: string;
  fullname: string;
  token: string;
}

export interface iUserUpdate {
  fullname: string;
  nickname?: string;
  nicknamePreference?: boolean | number;
  email: string;
  phone: string;
}

export interface iUserGet {
  fullname?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  page: number;
  pageSize: number;
}

export interface iUserCreateRequest {
  fullname: string;
  nicknamePreference: boolean;
  nickname: string | null;
  email: string;
  phone: string;
  password: string;
  role: eRoles;
  dateOfBirth: Date | null;
}
