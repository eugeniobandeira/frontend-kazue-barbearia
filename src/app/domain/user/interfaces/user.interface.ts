import { iStatusResponse } from '@/domain/status/interfaces/status.interface';
import { eRoles } from '@/shared/enums/roles.enum';

export interface iUser {
  id: string;
  fullname: string;
  nickname: string;
  nicknamePreference?: boolean | number;
  username: string;
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
  username: string;
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
  role: string;
  status: string;
}

export interface iUserUpdate {
  fullname: string;
  nickname?: string;
  nicknamePreference?: boolean | number;
  username: string;
  phone: string;
}

export interface iUserGet {
  idStatus?: number;
  fullname?: string;
  nickname?: string;
  username?: string;
  phone?: string;
  page: number;
  pageSize: number;
}

export interface iUserCreateRequest {
  fullname: string;
  nicknamePreference: boolean;
  nickname: string | null;
  username: string;
  phone: string;
  password: string;
  role: eRoles;
  dateOfBirth: string | null;
}
