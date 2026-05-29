"use client";

import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ApiError } from "@/lib/api/client";
import { useDeleteLead } from "@/lib/api/lead-hooks";

type DeleteLeadButtonProps = {
  leadId: string;
  leadName: string;
};

export function DeleteLeadButton({ leadId, leadName }: DeleteLeadButtonProps) {
  const deleteLead = useDeleteLead();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  const isDeleting = deleteLead.isPending;

  async function handleDelete() {
    setError("");

    try {
      await deleteLead.mutateAsync(leadId);
      setIsConfirming(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : "The lead could not be deleted. Please try again.",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
      >
        Delete
      </button>

      {isConfirming ? (
        <ConfirmationDialog
          title={`Delete ${leadName}?`}
          description="This removes the lead from the current API session. Restarting the backend restores the seed data."
          confirmLabel="Delete Lead"
          error={error}
          isConfirming={isDeleting}
          onCancel={() => {
            setIsConfirming(false);
            setError("");
          }}
          onConfirm={handleDelete}
          tone="danger"
        />
      ) : null}
    </>
  );
}
