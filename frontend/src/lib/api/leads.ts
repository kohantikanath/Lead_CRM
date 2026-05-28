import { apiRequest } from "@/lib/api/client";
import type {
  Lead,
  LeadCreateInput,
  LeadStatus,
  LeadUpdateInput,
} from "@/types/lead";

export type LeadListParams = {
  q?: string;
  statuses?: LeadStatus[];
};

function buildLeadQuery(params: LeadListParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.q?.trim()) {
    searchParams.set("q", params.q.trim());
  }

  if (params.statuses?.length) {
    searchParams.set("status", params.statuses.join(","));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function getLeads(params?: LeadListParams) {
  return apiRequest<Lead[]>(`/leads${buildLeadQuery(params)}`);
}

export function getLead(id: string) {
  return apiRequest<Lead>(`/leads/${id}`);
}

export function createLead(input: LeadCreateInput) {
  return apiRequest<Lead>("/leads", {
    method: "POST",
    body: input,
  });
}

export function updateLead(id: string, input: LeadUpdateInput) {
  return apiRequest<Lead>(`/leads/${id}`, {
    method: "PUT",
    body: input,
  });
}

export function deleteLead(id: string) {
  return apiRequest<void>(`/leads/${id}`, {
    method: "DELETE",
  });
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  return apiRequest<Lead>(`/leads/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
