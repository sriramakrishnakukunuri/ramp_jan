export interface Ticket {
  id?: number | string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'CREATED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ADDITIONAL_INFO_NEEDED';
  type: 'BUG' | 'FEATURE' | 'ENHANCEMENT' | 'SUPPORT' | 'ISSUE';
  assigneeId: string;
  assigneeName: string;
  reporterId?: string;
  reporterName?: string;
  closedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  attachments?: TicketAttachment[];
  comments?: TicketComment[];
  history?: TicketHistory[];
}

export interface TicketAttachment {
  id: number;
  fileName: string;
  filePath: string;
  contentType: string;
}

export interface TicketComment {
  id: number;
  message: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface TicketHistory {
  id: number;
  fromStatus: string | null;
  toStatus: string;
  action: string;
  remarks: string;
  userId: string | null;
  userName: string | null;
  createdAt: string;
}

export interface TicketResponse {
  status: number;
  message: string;
  data?: Ticket[];
  totalPages?: number;
  totalElements?: number;
}