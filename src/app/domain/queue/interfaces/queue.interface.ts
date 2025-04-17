import { iServiceResponse } from '@/domain/service/interface/service.interface';
import { iStatusResponse } from '@/domain/status/interfaces/status.interface';
import { iUserShortResponse } from '@/domain/user/interfaces/user.interface';

export interface iQueueResponse {
  id: number;
  checkinAt: Date;
  checkoutAt?: Date;
  amount: number;
  customer: iUserShortResponse;
  barber: iUserShortResponse;
  status: iStatusResponse;
  services: iServiceResponse[];
}

export interface iQueueRequest {
  idCustomer: string;
  idBarber: string;
  idServices: string[];
  amount: number;
}

export interface iQueueGet {
  idCustomer?: string;
  idBarber?: string;
  date?: Date;
  page: number;
  pageSize: number;
}
