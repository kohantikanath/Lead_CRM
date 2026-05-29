"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ApiError } from "@/lib/api/client";
import { useDeleteLead, useUpdateLeadStatus } from "@/lib/api/lead-hooks";
import {
  getNextStatuses,
  isTerminalStatus,
  STATUS_LABELS,
} from "@/lib/leads/status";
import type { Lead, LeadStatus } from "@/types/lead";

type LeadAction = "move" | "lost" | "delete";

type LeadActionsProps = {
  lead: Lead;
};

function getPrimaryMoveStatus(status: LeadStatus) {
  return getNextStatuses(status).find((nextStatus) => nextStatus !== "LOST");
}

export function LeadActions({ lead }: LeadActionsProps) {
  const router = useRouter();
  const updateLeadStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();
  const [pendingAction, setPendingAction] = useState<LeadAction | null>(null);
  const [error, setError] = useState("");
  const primaryMoveStatus = getPrimaryMoveStatus(lead.status);
  const canMarkLost = !isTerminalStatus(lead.status);
  const isWorking = updateLeadStatus.isPending || deleteLead.isPending;

  function closeConfirmation() {
    setPendingAction(null);
    setError("");
  }

  async function confirmStatusUpdate(status: LeadStatus) {
    setError("");

    try {
      await updateLeadStatus.mutateAsync({ id: lead.id, status });
      closeConfirmation();
    } catch (updateError) {
      setError(
        updateError instanceof ApiError
          ? updateError.message
          : "The lead status could not be updated. Please try again.",
      );
    }
  }

  async function confirmDelete() {
    setError("");

    try {
      await deleteLead.mutateAsync(lead.id);
      closeConfirmation();
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : "The lead could not be deleted. Please try again.",
      );
    }
  }

  function stopRowClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={stopRowClick}
    >
      <button
        type="button"
        disabled={!primaryMoveStatus}
        onClick={() => setPendingAction("move")}
        className="inline-flex h-8 items-center justify-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {primaryMoveStatus
          ? `Move to ${STATUS_LABELS[primaryMoveStatus]}`
          : "No move"}
      </button>

      <DropdownMenu buttonLabel="Open lead actions" buttonContent="...">
        <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}`)}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}/edit`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!canMarkLost}
          onClick={() => setPendingAction("lost")}
          tone="danger"
        >
          Mark as lost
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setPendingAction("delete")}
          tone="danger"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenu>

      {pendingAction === "move" && primaryMoveStatus ? (
        <ConfirmationDialog
          title={`Move ${lead.name} to ${STATUS_LABELS[primaryMoveStatus]}?`}
          description="This updates the lead's pipeline status."
          confirmLabel={`Move to ${STATUS_LABELS[primaryMoveStatus]}`}
          error={error}
          isConfirming={isWorking}
          onCancel={closeConfirmation}
          onConfirm={() => confirmStatusUpdate(primaryMoveStatus)}
        />
      ) : null}

      {pendingAction === "lost" ? (
        <ConfirmationDialog
          title={`Mark ${lead.name} as lost?`}
          description="Lost leads are locked and cannot move further through the pipeline."
          confirmLabel="Mark as Lost"
          error={error}
          isConfirming={isWorking}
          onCancel={closeConfirmation}
          onConfirm={() => confirmStatusUpdate("LOST")}
          tone="danger"
        />
      ) : null}

      {pendingAction === "delete" ? (
        <ConfirmationDialog
          title={`Delete ${lead.name}?`}
          description="This removes the lead from the current API session. Restarting the backend restores the seed data."
          confirmLabel="Delete Lead"
          error={error}
          isConfirming={isWorking}
          onCancel={closeConfirmation}
          onConfirm={confirmDelete}
          tone="danger"
        />
      ) : null}
    </div>
  );
}
