export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  source: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadCreateInput = {
  name: string;
  email: string;
  phone?: string | null;
  source?: string | null;
};

export type LeadUpdateInput = Partial<LeadCreateInput>;

export type ApiErrorBody = {
  error?: string;
};
