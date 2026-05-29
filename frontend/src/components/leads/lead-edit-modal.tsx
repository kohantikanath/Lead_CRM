"use client";

import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/leads/lead-form";
import { Modal } from "@/components/ui/modal";
import { useLead } from "@/lib/api/lead-hooks";
import type { Lead } from "@/types/lead";

type LeadEditModalProps = {
  leadId: string;
  initialLead?: Lead;
};

export function LeadEditModal({ leadId, initialLead }: LeadEditModalProps) {
  const router = useRouter();
  const { data: lead, isError, isLoading } = useLead(leadId, initialLead);

  function closeModal() {
    router.push("/leads");
  }

  return (
    <Modal
      title="Edit lead"
      description="Update contact details and source."
      onClose={closeModal}
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
          onCancel={closeModal}
          onSuccess={(updatedLead) => router.push(`/leads/${updatedLead.id}`)}
        />
      ) : null}
    </Modal>
  );
}
