import { iStatus } from '@/domain/status/interfaces/status.interface';
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
  status: iStatus;
}
