export interface iStatusResponse {
  id: number;
  code: string;
  description: string;
  domain: string;
}

export interface iStatusPayload {
  code: string;
  description: string;
  domain: string;
}

export interface iStatusGet {
  code?: string;
  description?: string;
  page: number;
  pageSize: number;
}
