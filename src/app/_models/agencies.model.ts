export interface Agency {
  agencyId: number;
  agencyName: string;
}

export interface AgencyResponse {
  status: number;
  message: string;
  data: Agency[];
  totalPages: number;
  totalElements: number;
}
