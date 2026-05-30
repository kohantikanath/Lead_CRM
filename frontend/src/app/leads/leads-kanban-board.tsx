"use client";

import { useEffect, useState } from "react";
import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { LeadActions } from "@/components/leads/lead-actions";
import { ApiError } from "@/lib/api/client";
import { useUpdateLeadStatus } from "@/lib/api/lead-hooks";
import {
  canTransitionStatus,
  getNextStatuses,
  isTerminalStatus,
  STATUS_LABELS,
} from "@/lib/leads/status";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/types/lead";

type LeadsKanbanBoardProps = {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
};

type PendingMove = {
  leadId: string;
  targetStatus: LeadStatus;
};

type KanbanCardProps = {
  lead: Lead;
  isDragDisabled?: boolean;
  isUpdating?: boolean;
  onEdit: () => void;
  onView: () => void;
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
  isDragDisabled = false,
  isUpdating = false,
  onEdit,
  onView,
}: KanbanCardProps) {
  const isLocked = isTerminalStatus(lead.status);
  const { ref, isDragging } = useDraggable({
    id: lead.id,
    data: lead,
    disabled: isLocked || isDragDisabled,
  });

  function handleDoubleClick(event: React.MouseEvent<HTMLElement>) {
    const target = event.target;

    if (
      (target instanceof Element &&
        target.closest("button, a, input, select, textarea"))
    ) {
      return;
    }

    onView();
  }

  return (
    <article
      ref={ref}
      tabIndex={0}
      title="Double-click to view lead"
      onDoubleClick={handleDoubleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target === event.currentTarget) {
          onView();
        }
      }}
      className={`rounded-md border bg-white p-3 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-zinc-100 ${
        isUpdating
          ? "border-zinc-400 shadow"
          : "border-zinc-200 hover:border-zinc-300 hover:shadow focus:border-zinc-400"
      } ${
        !isLocked && !isDragDisabled
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-pointer"
      } ${isDragging ? "opacity-30" : ""}`}
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
        <div className="flex items-center gap-1">
          <LeadActions
            lead={lead}
            onEdit={onEdit}
            onView={onView}
            variant="compact"
          />
        </div>
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

      {isUpdating ? (
        <div className="mt-3 border-t border-zinc-100 pt-3">
          <p className="text-xs font-medium text-zinc-500">Updating status...</p>
        </div>
      ) : null}
    </article>
  );
}

function LeadKanbanOverlay({ lead }: { lead: Lead }) {
  return (
    <div className="w-64 rounded-md border border-zinc-300 bg-white p-3 shadow-xl">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white">
          {getLeadInitials(lead.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-950">
            {lead.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-zinc-500">{lead.email}</p>
        </div>
      </div>
    </div>
  );
}

function LeadKanbanColumn({
  activeLead,
  isMovePending,
  leads,
  onEditLead,
  onViewLead,
  pendingMove,
  status,
}: {
  activeLead?: Lead;
  isMovePending: boolean;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
  pendingMove?: PendingMove;
  status: LeadStatus;
}) {
  const isSource = activeLead?.status === status;
  const isValidTarget = activeLead
    ? canTransitionStatus(activeLead.status, status)
    : false;
  const isDisabledDuringDrag = Boolean(
    activeLead && !isSource && !isValidTarget,
  );
  const { ref, isDropTarget } = useDroppable({
    id: status,
    disabled: isMovePending,
  });

  const dragStateClassName = isValidTarget
    ? status === "LOST"
      ? "border-rose-500 bg-rose-100 shadow-sm"
      : "border-zinc-500 bg-white shadow-sm"
    : isDisabledDuringDrag
      ? "cursor-not-allowed opacity-35 grayscale"
      : "";

  return (
    <section
      ref={ref}
      aria-disabled={isDisabledDuringDrag || undefined}
      aria-labelledby={`kanban-${status.toLowerCase()}`}
      role="group"
      className={`flex h-[42rem] flex-col rounded-lg border p-3 transition ${columnStyles[status]} ${dragStateClassName} ${
        isDropTarget ? "ring-4 ring-zinc-300" : ""
      }`}
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
          {leads.length}
        </span>
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {leads.length ? (
          leads.map((lead) => {
            const isUpdating = pendingMove?.leadId === lead.id;

            return (
              <LeadKanbanCard
                key={lead.id}
                lead={lead}
                isDragDisabled={isMovePending}
                isUpdating={isUpdating}
                onEdit={() => onEditLead(lead)}
                onView={() => onViewLead(lead)}
              />
            );
          })
        ) : (
          <div className="rounded-md border border-dashed border-zinc-300 bg-white/50 px-3 py-6 text-center">
            <p className="text-xs text-zinc-500">No leads here</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function LeadsKanbanBoard({
  leads,
  onEditLead,
  onViewLead,
}: LeadsKanbanBoardProps) {
  const updateLeadStatus = useUpdateLeadStatus();
  const [activeLeadId, setActiveLeadId] = useState<string>();
  const [pendingMove, setPendingMove] = useState<PendingMove>();
  const [feedback, setFeedback] = useState("");
  const activeLead = leads.find((lead) => lead.id === activeLeadId);
  const renderedLeads = leads.map((lead) =>
    pendingMove?.leadId === lead.id
      ? { ...lead, status: pendingMove.targetStatus }
      : lead,
  );

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => setFeedback(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  function handleDragStart(event: DragStartEvent) {
    setActiveLeadId(String(event.operation.source?.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveLeadId(undefined);

    if (event.canceled) {
      return;
    }

    const leadId = event.operation.source?.id;
    const targetStatus = event.operation.target?.id as LeadStatus | undefined;
    const lead = leads.find((currentLead) => currentLead.id === leadId);

    if (!lead || !targetStatus || targetStatus === lead.status) {
      return;
    }

    if (!canTransitionStatus(lead.status, targetStatus)) {
      const validStatuses = getNextStatuses(lead.status)
        .map((status) => STATUS_LABELS[status])
        .join(" or ");
      setFeedback(
        `${STATUS_LABELS[lead.status]} leads can move only to ${validStatuses}.`,
      );
      return;
    }

    const nextMove = {
      leadId: lead.id,
      targetStatus,
    };
    setPendingMove(nextMove);

    try {
      await updateLeadStatus.mutateAsync({
        id: nextMove.leadId,
        status: nextMove.targetStatus,
      });
      setPendingMove(undefined);
    } catch (error) {
      setPendingMove(undefined);
      setFeedback(
        error instanceof ApiError
          ? `${error.message} The card was moved back.`
          : "The lead status could not be updated. The card was moved back.",
      );
    }
  }

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto border-t border-zinc-200 bg-zinc-50/50 p-4">
        <div className="grid min-w-[1340px] grid-cols-5 gap-3">
          {LEAD_STATUSES.map((status) => (
            <LeadKanbanColumn
              key={status}
              activeLead={activeLead}
              isMovePending={Boolean(pendingMove)}
              leads={renderedLeads.filter((lead) => lead.status === status)}
              pendingMove={pendingMove}
              status={status}
              onEditLead={onEditLead}
              onViewLead={onViewLead}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeLead ? <LeadKanbanOverlay lead={activeLead} /> : null}
      </DragOverlay>
      {feedback ? (
        <div
          role="alert"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-md border border-rose-200 bg-white px-4 py-3 text-sm leading-6 text-rose-700 shadow-lg"
        >
          {feedback}
        </div>
      ) : null}
    </DragDropProvider>
  );
}
