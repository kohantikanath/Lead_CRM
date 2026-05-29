"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLead,
  deleteLead,
  getLead,
  getLeads,
  updateLead,
  updateLeadStatus,
  type LeadListParams,
} from "@/lib/api/leads";
import type { LeadCreateInput, LeadStatus, LeadUpdateInput } from "@/types/lead";
import type { Lead } from "@/types/lead";

export const leadKeys = {
  all: ["leads"] as const,
  lists: () => [...leadKeys.all, "list"] as const,
  list: (params: LeadListParams) => [...leadKeys.lists(), params] as const,
  details: () => [...leadKeys.all, "detail"] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
};

function useInvalidateLeads() {
  const queryClient = useQueryClient();

  return async (id?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() }),
      id
        ? queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) })
        : Promise.resolve(),
    ]);
  };
}

export function useLeads(params: LeadListParams = {}, initialData?: Lead[]) {
  return useQuery({
    queryKey: leadKeys.list(params),
    queryFn: () => getLeads(params),
    initialData,
  });
}

export function useLead(id: string, initialData?: Lead) {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: () => getLead(id),
    enabled: Boolean(id),
    initialData,
  });
}

export function useCreateLead() {
  const invalidateLeads = useInvalidateLeads();

  return useMutation({
    mutationFn: (input: LeadCreateInput) => createLead(input),
    onSuccess: (lead) => invalidateLeads(lead.id),
  });
}

export function useUpdateLead() {
  const invalidateLeads = useInvalidateLeads();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: LeadUpdateInput }) =>
      updateLead(id, input),
    onSuccess: (lead) => invalidateLeads(lead.id),
  });
}

export function useDeleteLead() {
  const invalidateLeads = useInvalidateLeads();

  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: (_data, id) => invalidateLeads(id),
  });
}

export function useUpdateLeadStatus() {
  const invalidateLeads = useInvalidateLeads();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLeadStatus(id, status),
    onSuccess: (lead) => invalidateLeads(lead.id),
  });
}
