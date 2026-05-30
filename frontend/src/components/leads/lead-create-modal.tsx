"use client";

import { LeadForm } from "@/components/leads/lead-form";
import { Modal } from "@/components/ui/modal";
import type { Lead } from "@/types/lead";

export function LeadCreateModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
}) {
  return (
    <Modal
      title="New lead"
      description="Capture a new prospect with the minimum details needed to start the pipeline."
      onClose={onClose}
      contentClassName="p-0"
      maxWidthClassName="max-w-3xl"
    >
      <LeadForm
        mode="create"
        embedded
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
