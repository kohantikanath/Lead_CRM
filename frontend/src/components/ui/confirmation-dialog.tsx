"use client";

import type { ReactNode } from "react";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
  error?: string;
  tone?: "default" | "danger";
  children?: ReactNode;
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
  children,
}: ConfirmationDialogProps) {
  const confirmClassName =
    tone === "danger"
      ? "bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300"
      : "bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/30 px-4 py-6"
    >
      <button
        type="button"
        aria-label="Cancel confirmation"
        className="absolute inset-0 cursor-default"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2
            id="confirmation-title"
            className="text-base font-semibold text-zinc-950"
          >
            {title}
          </h2>
          <p
            id="confirmation-description"
            className="mt-1 text-sm leading-6 text-zinc-500"
          >
            {description}
          </p>
        </div>
        {children ? (
          <div className="border-b border-zinc-200 px-5 py-4">{children}</div>
        ) : null}
        {error ? (
          <div className="border-b border-zinc-200 px-5 py-4">
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          </div>
        ) : null}
        <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-4">
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
        </div>
      </div>
    </div>
  );
}
