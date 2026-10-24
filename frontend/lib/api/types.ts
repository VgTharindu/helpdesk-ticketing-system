export type TicketStatus = "open" | "in_progress" | "waiting_for_customer" | "resolved";
export type TicketPriority = "low" | "medium" | "high";
export type UserRole = "customer" | "agent" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  created_at: string;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  customer: { id: number; name: string } | null;
  agent: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface TicketReply {
  id: number;
  message: string;
  author: { id: number; name: string; role: UserRole };
  created_at: string;
}

export interface ActivityItem {
  id: number;
  event: string;
  ticket: { id: number; subject: string | null };
  actor: { id: number; name: string } | null;
  from_status: TicketStatus | null;
  to_status: TicketStatus | null;
  at: string;
}

export interface DashboardData {
  scope: "own" | "queue" | "all";
  counts: {
    total: number;
    unassigned: number;
    assigned_to_me: number | null;
    by_status: Record<TicketStatus, number>;
  };
  recent_activity: ActivityItem[];
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface Paginated<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ApiMessageResponse<T> {
  message: string;
  data: T;
}

export interface ApiDataResponse<T> {
  data: T;
}