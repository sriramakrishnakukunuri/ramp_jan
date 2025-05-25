export interface Program {
  programId: number;
  activityId: number;
  subActivityId: number;
  activityName: string;
  subActivityName: string;
  agencyName: string;
  programType: string;
  programTitle: string;
  agencyId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  spocName: string;
  spocContactNo: number;
  programLocation: number;
  programLocationName: string;
  kpi: string;
  createdOn: string;
  updatedOn: string;
  status: string;
}
export interface ProgramResponse {
  status: number;
  message: string;
  data: Program[];
  totalPages: number;
  totalElements: number;
}