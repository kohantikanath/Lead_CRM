"use client";

import { LeadForm } from "@/components/leads/lead-form";
import { Modal } from "@/components/ui/modal";
import { useLead } from "@/lib/api/lead-hooks";
import type { Lead } from "@/types/lead";

type LeadEditModalProps = {
  leadId: string;
  initialLead?: Lead;
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
};

export function LeadEditModal({
  leadId,
  initialLead,
  onClose,
  onSuccess,
}: LeadEditModalProps) {
  const { data: lead, isError, isLoading } = useLead(leadId, initialLead);

  return (
    <Modal
      title="Edit lead"
      description="Update contact details and source."
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
    >
      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading lead...</p>
      ) : null}
      {isError ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          Lead details could not be loaded.
        </p>
      ) : null}
      {lead ? (
        <LeadForm
          mode="edit"
          lead={lead}
          embedded
          onSuccess={onSuccess}
        />
      ) : null}
    </Modal>
  );
}
