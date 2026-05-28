"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { updateLeadStatus } from "@/lib/api/leads";
import {
  getNextStatuses,
  isTerminalStatus,
  STATUS_LABELS,
} from "@/lib/leads/status";
import type { LeadStatus } from "@/types/lead";

type StatusTransitionControlProps = {
  leadId: string;
  status: LeadStatus;
  compact?: boolean;
};

export function StatusTransitionControl({
  leadId,
  status,
  compact = false,
}: StatusTransitionControlProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const nextStatuses = getNextStatuses(status);
  const isLocked = isTerminalStatus(status);

  async function handleUpdate() {
    if (!selectedStatus) {
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      await updateLeadStatus(leadId, selectedStatus as LeadStatus);
      setSelectedStatus("");
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof ApiError
          ? updateError.message
          : "The status could not be updated. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLocked) {
    return (
      <span className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-500">
        Locked
      </span>
    );
  }

  return (
    <div className={compact ? "flex flex-col gap-1" : "flex flex-col gap-2"}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <label className="sr-only" htmlFor={`status-${leadId}`}>
          Change lead status
        </label>
        <select
          id={`status-${leadId}`}
          value={selectedStatus}
          onChange={(event) => {
            setSelectedStatus(event.target.value);
            setError("");
          }}
          disabled={isUpdating}
          className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-50"
        >
          <option value="">Move to</option>
          {nextStatuses.map((nextStatus) => (
            <option key={nextStatus} value={nextStatus}>
              {STATUS_LABELS[nextStatus]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={!selectedStatus || isUpdating}
          className="h-8 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isUpdating ? "Saving..." : "Update"}
        </button>
      </div>
      {error ? (
        <p className="max-w-64 text-right text-xs leading-5 text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
