export interface Ticket {
  id?: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  type: 'BUG' | 'FEATURE' | 'ENHANCEMENT' | 'SUPPORT';
  assigneeId: string;
  assigneeName: string;
  createdAt?: Date;
  updatedDate?: Date;
  attachments?: File[];
}

export interface TicketResponse {
  success: boolean;
  message: string;
  data?: Ticket | Ticket[];
}