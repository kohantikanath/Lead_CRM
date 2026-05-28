import type { LeadStatus } from "@/types/lead";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export const STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ["CONTACTED", "LOST"],
  CONTACTED: ["QUALIFIED", "LOST"],
  QUALIFIED: ["CONVERTED", "LOST"],
  CONVERTED: [],
  LOST: [],
};

export function getNextStatuses(status: LeadStatus) {
  return STATUS_TRANSITIONS[status];
}

export function canTransitionStatus(from: LeadStatus, to: LeadStatus) {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function isTerminalStatus(status: LeadStatus) {
  return STATUS_TRANSITIONS[status].length === 0;
}
