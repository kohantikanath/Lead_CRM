"use client";

import { useState } from "react";
import { LeadConfirmationSummary } from "@/components/leads/lead-confirmation-summary";
import { PrimaryStatusAction } from "@/components/leads/primary-status-action";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ApiError } from "@/lib/api/client";
import { useDeleteLead, useUpdateLeadStatus } from "@/lib/api/lead-hooks";
import { isTerminalStatus } from "@/lib/leads/status";
import type { Lead, LeadStatus } from "@/types/lead";

type LeadAction = "lost" | "delete";

type LeadActionsProps = {
  lead: Lead;
  onEdit: () => void;
  onView: () => void;
  variant?: "default" | "compact";
};

export function LeadActions({
  lead,
  onEdit,
  onView,
  variant = "default",
}: LeadActionsProps) {
  const updateLeadStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();
  const [pendingAction, setPendingAction] = useState<LeadAction | null>(null);
  const [error, setError] = useState("");
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
      {variant === "default" ? <PrimaryStatusAction lead={lead} /> : null}

      <DropdownMenu
        buttonLabel="Open lead actions"
        buttonContent={<span aria-hidden="true">&#8942;</span>}
      >
        <DropdownMenuItem onClick={onView}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
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
        >
          <LeadConfirmationSummary lead={lead} />
        </ConfirmationDialog>
      ) : null}

      {pendingAction === "delete" ? (
        <ConfirmationDialog
          title={`Delete ${lead.name}?`}
          description="This action permanently deletes the lead and cannot be undone."
          confirmLabel="Delete Lead"
          error={error}
          isConfirming={isWorking}
          onCancel={closeConfirmation}
          onConfirm={confirmDelete}
          tone="danger"
        >
          <LeadConfirmationSummary lead={lead} />
        </ConfirmationDialog>
      ) : null}
    </div>
  );
}
