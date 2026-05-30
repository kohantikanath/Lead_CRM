"use client";

import { useState } from "react";
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
  isTerminalStatus,
  STATUS_LABELS,
} from "@/lib/leads/status";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/types/lead";

type LeadsKanbanBoardProps = {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
};

type StagedMove = {
  leadId: string;
  sourceStatus: LeadStatus;
  targetStatus: LeadStatus;
  error: string;
};

type KanbanCardProps = {
  lead: Lead;
  isDragDisabled?: boolean;
  isStaged?: boolean;
  stagedError?: string;
  isSaving?: boolean;
  onCancelStage?: () => void;
  onConfirmStage?: () => void;
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
  isStaged = false,
  stagedError,
  isSaving = false,
  onCancelStage,
  onConfirmStage,
  onEdit,
  onView,
}: KanbanCardProps) {
  const isLocked = isTerminalStatus(lead.status);
  const { ref, handleRef, isDragging } = useDraggable({
    id: lead.id,
    data: lead,
    disabled: isLocked || isStaged || isDragDisabled,
  });

  return (
    <article
      ref={ref}
      tabIndex={0}
      onClick={onView}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target === event.currentTarget) {
          onView();
        }
      }}
      className={`rounded-md border bg-white p-3 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-zinc-100 ${
        isStaged
          ? "border-zinc-400 shadow"
          : "cursor-pointer border-zinc-200 hover:border-zinc-300 hover:shadow focus:border-zinc-400"
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
          {!isLocked && !isStaged && !isDragDisabled ? (
            <button
              ref={handleRef}
              type="button"
              aria-label={`Drag ${lead.name} to update status`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-md border border-zinc-200 bg-white text-sm text-zinc-500 shadow-sm hover:border-zinc-300 hover:text-zinc-800 active:cursor-grabbing"
            >
              <span aria-hidden="true">&#8942;&#8942;</span>
            </button>
          ) : null}
          {!isStaged ? (
            <LeadActions
              lead={lead}
              onEdit={onEdit}
              onView={onView}
              variant="compact"
            />
          ) : null}
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

      {isStaged ? (
        <div
          className="mt-3 border-t border-zinc-100 pt-3"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-xs font-medium text-zinc-700">
            Move to {STATUS_LABELS[lead.status]}?
          </p>
          {stagedError ? (
            <p className="mt-2 rounded-md bg-rose-50 px-2 py-1.5 text-xs leading-5 text-rose-700">
              {stagedError}
            </p>
          ) : null}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={onCancelStage}
              className="h-8 flex-1 rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 shadow-sm hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onConfirmStage}
              className="h-8 flex-1 rounded-md bg-zinc-950 px-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {isSaving ? "Working..." : stagedError ? "Retry" : "Confirm"}
            </button>
          </div>
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
  isStagePending,
  leads,
  onCancelStage,
  onConfirmStage,
  onEditLead,
  onViewLead,
  stagedMove,
  status,
  isSaving,
}: {
  activeLead?: Lead;
  isStagePending: boolean;
  leads: Lead[];
  onCancelStage: () => void;
  onConfirmStage: () => void;
  onEditLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
  stagedMove?: StagedMove;
  status: LeadStatus;
  isSaving: boolean;
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
    disabled: isDisabledDuringDrag || isStagePending,
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
      className={`min-h-[28rem] rounded-lg border p-3 transition ${columnStyles[status]} ${dragStateClassName} ${
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

      <div className="mt-3 space-y-3">
        {leads.length ? (
          leads.map((lead) => {
            const isStaged = stagedMove?.leadId === lead.id;

            return (
              <LeadKanbanCard
                key={lead.id}
                lead={lead}
                isDragDisabled={isStagePending}
                isSaving={isSaving}
                isStaged={isStaged}
                stagedError={isStaged ? stagedMove.error : undefined}
                onCancelStage={isStaged ? onCancelStage : undefined}
                onConfirmStage={isStaged ? onConfirmStage : undefined}
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
  const [stagedMove, setStagedMove] = useState<StagedMove>();
  const activeLead = leads.find((lead) => lead.id === activeLeadId);
  const renderedLeads = leads.map((lead) =>
    stagedMove?.leadId === lead.id
      ? { ...lead, status: stagedMove.targetStatus }
      : lead,
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveLeadId(String(event.operation.source?.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLeadId(undefined);

    if (event.canceled) {
      return;
    }

    const leadId = event.operation.source?.id;
    const targetStatus = event.operation.target?.id as LeadStatus | undefined;
    const lead = leads.find((currentLead) => currentLead.id === leadId);

    if (
      !lead ||
      !targetStatus ||
      !canTransitionStatus(lead.status, targetStatus)
    ) {
      return;
    }

    setStagedMove({
      leadId: lead.id,
      sourceStatus: lead.status,
      targetStatus,
      error: "",
    });
  }

  async function confirmStagedMove() {
    if (!stagedMove) {
      return;
    }

    try {
      await updateLeadStatus.mutateAsync({
        id: stagedMove.leadId,
        status: stagedMove.targetStatus,
      });
      setStagedMove(undefined);
    } catch (error) {
      setStagedMove((currentMove) =>
        currentMove
          ? {
              ...currentMove,
              error:
                error instanceof ApiError
                  ? error.message
                  : "The lead status could not be updated. Please try again.",
            }
          : undefined,
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
              isSaving={updateLeadStatus.isPending}
              isStagePending={Boolean(stagedMove)}
              leads={renderedLeads.filter((lead) => lead.status === status)}
              stagedMove={stagedMove}
              status={status}
              onCancelStage={() => setStagedMove(undefined)}
              onConfirmStage={confirmStagedMove}
              onEditLead={onEditLead}
              onViewLead={onViewLead}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeLead ? <LeadKanbanOverlay lead={activeLead} /> : null}
      </DragOverlay>
    </DragDropProvider>
  );
}
