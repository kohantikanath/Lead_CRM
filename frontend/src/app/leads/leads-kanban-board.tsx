"use client";

import { LeadActions } from "@/components/leads/lead-actions";
import { STATUS_LABELS } from "@/lib/leads/status";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/types/lead";

type LeadsKanbanBoardProps = {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
};

const columnStyles: Record<LeadStatus, string> = {
  NEW: "border-sky-200 bg-sky-50/60",
  CONTACTED: "border-amber-200 bg-amber-50/60",
  QUALIFIED: "border-emerald-200 bg-emerald-50/60",
  CONVERTED: "border-violet-200 bg-violet-50/60",
  LOST: "border-rose-200 bg-rose-50/60",
};

const columnDotStyles: Record<LeadStatus, string> = {
  NEW: "bg-sky-500",
  CONTACTED: "bg-amber-500",
  QUALIFIED: "bg-emerald-500",
  CONVERTED: "bg-violet-500",
  LOST: "bg-rose-500",
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getLeadInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function LeadKanbanCard({
  lead,
  onEdit,
  onView,
}: {
  lead: Lead;
  onEdit: () => void;
  onView: () => void;
}) {
  return (
    <article
      tabIndex={0}
      onClick={onView}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target === event.currentTarget) {
          onView();
        }
      }}
      className="cursor-pointer rounded-md border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white">
            {getLeadInitials(lead.name)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-zinc-950">
              {lead.name}
            </h3>
            <p className="mt-0.5 truncate text-xs text-zinc-500">
              {lead.email}
            </p>
          </div>
        </div>
        <LeadActions
          lead={lead}
          onEdit={onEdit}
          onView={onView}
          variant="compact"
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-3 text-xs">
        <div>
          <dt className="text-zinc-400">Source</dt>
          <dd className="mt-1 truncate capitalize text-zinc-600">
            {lead.source?.replace("-", " ") ?? "Unassigned"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-400">Updated</dt>
          <dd className="mt-1 truncate text-zinc-600">
            {formatUpdatedAt(lead.updated_at)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function LeadsKanbanBoard({
  leads,
  onEditLead,
  onViewLead,
}: LeadsKanbanBoardProps) {
  return (
    <div className="overflow-x-auto border-t border-zinc-200 bg-zinc-50/50 p-4">
      <div className="grid min-w-[1340px] grid-cols-5 gap-3">
        {LEAD_STATUSES.map((status) => {
          const columnLeads = leads.filter((lead) => lead.status === status);

          return (
            <section
              key={status}
              aria-labelledby={`kanban-${status.toLowerCase()}`}
              className={`min-h-[28rem] rounded-lg border p-3 ${columnStyles[status]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${columnDotStyles[status]}`}
                  />
                  <h2
                    id={`kanban-${status.toLowerCase()}`}
                    className="text-xs font-semibold uppercase tracking-normal text-zinc-700"
                  >
                    {STATUS_LABELS[status]}
                  </h2>
                </div>
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 py-1 text-xs font-medium text-zinc-600 shadow-sm">
                  {columnLeads.length}
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {columnLeads.length ? (
                  columnLeads.map((lead) => (
                    <LeadKanbanCard
                      key={lead.id}
                      lead={lead}
                      onEdit={() => onEditLead(lead)}
                      onView={() => onViewLead(lead)}
                    />
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-zinc-300 bg-white/50 px-3 py-6 text-center">
                    <p className="text-xs text-zinc-500">No leads here</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
