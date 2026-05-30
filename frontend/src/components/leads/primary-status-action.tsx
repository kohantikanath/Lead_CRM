"use client";

import { useState } from "react";
import { LeadConfirmationSummary } from "@/components/leads/lead-confirmation-summary";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ApiError } from "@/lib/api/client";
import { useUpdateLeadStatus } from "@/lib/api/lead-hooks";
import { getNextStatuses, STATUS_LABELS } from "@/lib/leads/status";
import type { Lead, LeadStatus } from "@/types/lead";

function getPrimaryStatus(status: LeadStatus) {
  return getNextStatuses(status).find((nextStatus) => nextStatus !== "LOST");
}

export function PrimaryStatusAction({ lead }: { lead: Lead }) {
  const updateLeadStatus = useUpdateLeadStatus();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  const primaryStatus = getPrimaryStatus(lead.status);

  function closeConfirmation() {
    setIsConfirming(false);
    setError("");
  }

  async function confirmStatusUpdate() {
    if (!primaryStatus) {
      return;
    }

    setError("");

    try {
      await updateLeadStatus.mutateAsync({ id: lead.id, status: primaryStatus });
      closeConfirmation();
    } catch (updateError) {
      setError(
        updateError instanceof ApiError
          ? updateError.message
          : "The lead status could not be updated. Please try again.",
      );
    }
  }

  if (!primaryStatus) {
    return (
      <span className="inline-flex h-8 w-32 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-500">
        Locked
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="inline-flex h-8 w-32 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 shadow-sm hover:border-zinc-950 hover:text-zinc-950"
      >
        Mark as {STATUS_LABELS[primaryStatus]}
      </button>

      {isConfirming ? (
        <ConfirmationDialog
          title={`Mark ${lead.name} as ${STATUS_LABELS[primaryStatus]}?`}
          description="This updates the lead's pipeline status."
          confirmLabel={`Mark as ${STATUS_LABELS[primaryStatus]}`}
          error={error}
          isConfirming={updateLeadStatus.isPending}
          onCancel={closeConfirmation}
          onConfirm={confirmStatusUpdate}
        >
          <LeadConfirmationSummary lead={lead} />
        </ConfirmationDialog>
      ) : null}
    </>
  );
}
