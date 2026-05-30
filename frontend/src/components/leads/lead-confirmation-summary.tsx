import { STATUS_LABELS } from "@/lib/leads/status";
import type { Lead } from "@/types/lead";

export function LeadConfirmationSummary({ lead }: { lead: Lead }) {
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-xs font-medium uppercase text-zinc-500">Name</dt>
        <dd className="mt-1 font-medium text-zinc-950">{lead.name}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium uppercase text-zinc-500">Email</dt>
        <dd className="mt-1 break-all text-zinc-700">{lead.email}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium uppercase text-zinc-500">Status</dt>
        <dd className="mt-1 text-zinc-700">{STATUS_LABELS[lead.status]}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium uppercase text-zinc-500">Source</dt>
        <dd className="mt-1 capitalize text-zinc-700">
          {lead.source?.replace("-", " ") ?? "Unassigned"}
        </dd>
      </div>
    </dl>
  );
}
