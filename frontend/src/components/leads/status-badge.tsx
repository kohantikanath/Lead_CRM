import { STATUS_LABELS } from "@/lib/leads/status";
import type { LeadStatus } from "@/types/lead";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-sky-200 bg-sky-50 text-sky-700",
  CONTACTED: "border-amber-200 bg-amber-50 text-amber-700",
  QUALIFIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CONVERTED: "border-violet-200 bg-violet-50 text-violet-700",
  LOST: "border-rose-200 bg-rose-50 text-rose-700",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
