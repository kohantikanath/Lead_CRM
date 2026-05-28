"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { deleteLead } from "@/lib/api/leads";

type DeleteLeadButtonProps = {
  leadId: string;
  leadName: string;
};

export function DeleteLeadButton({ leadId, leadName }: DeleteLeadButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    try {
      await deleteLead(leadId);
      setIsConfirming(false);
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : "The lead could not be deleted. Please try again.",
      );
    } finally {
      setIsDeleting(false);
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
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-${leadId}-title`}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/30 px-4 py-6"
        >
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-xl">
            <h2
              id={`delete-${leadId}-title`}
              className="text-base font-semibold text-zinc-950"
            >
              Delete {leadName}?
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              This removes the lead from the current API session. Restarting the
              backend restores the seed data.
            </p>

            {error ? (
              <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setIsConfirming(false);
                  setError("");
                }}
                className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="h-10 rounded-md bg-rose-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
              >
                {isDeleting ? "Deleting..." : "Delete Lead"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
