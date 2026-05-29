"use client";

import { Modal } from "@/components/ui/modal";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
  error?: string;
  tone?: "default" | "danger";
};

export function ConfirmationDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  isConfirming = false,
  error,
  tone = "default",
}: ConfirmationDialogProps) {
  const confirmClassName =
    tone === "danger"
      ? "bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300"
      : "bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300";

  return (
    <Modal
      title={title}
      description={description}
      onClose={onCancel}
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className={`h-10 rounded-md px-4 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed ${confirmClassName}`}
          >
            {isConfirming ? "Working..." : confirmLabel}
          </button>
        </div>
      }
    >
      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
