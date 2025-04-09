export interface iServiceResponse {
  id: number;
  code: string;
  description: string;
  price: number;
}

export interface iServicePayload {
  code: string;
  description: string;
  price: number;
}

export interface iServiceGet {
  code?: string;
  description?: string;
  page: number;
  pageSize: number;
}

export interface iServiceApiResponse {
  response: iServiceResponse[];
  resultCount: number;
  rowsCount: number;
}
