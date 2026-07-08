"use client";

import { createPortal } from "react-dom";
import { ConfirmModalProps } from "@/src/types";

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isPending = false,
  icon,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonClassName = "",
  cancelButtonClassName = "",
}: ConfirmModalProps) {
  if (!isOpen || typeof document === "undefined") return null;

  const baseButtonClass =
    "py-2 px-4 rounded-lg font-nunito font-bold transition-colors disabled:opacity-50 cursor-pointer w-32 text-center shadow-sm";

  const defaultCancelClass = `text-secondary-500 bg-secondary-100 border-2 border-secondary-200 hover:bg-secondary-200`;
  const finalCancelClass = cancelButtonClassName
    ? `${baseButtonClass} ${cancelButtonClassName}`
    : `${baseButtonClass} ${defaultCancelClass}`;

  const defaultConfirmClass = `text-white bg-red-500 hover:bg-red-600`;
  const finalConfirmClass = confirmButtonClassName
    ? `${baseButtonClass} ${confirmButtonClassName}`
    : `${baseButtonClass} ${defaultConfirmClass}`;

  const modalContent = (
    <div
      className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity animate-in fade-in"
      onClick={!isPending ? onCancel : undefined}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-md w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && <div className="mb-4">{icon}</div>}

        <h2 className="text-xl text-black font-nunito font-bold mb-6">
          {title}
        </h2>

        {message && (
          <p className="text-lg text-black font-nunito mb-6">{message}</p>
        )}

        <div className="flex gap-4 justify-center w-full">
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={finalConfirmClass}
          >
            {confirmButtonText}
          </button>

          <button
            onClick={onCancel}
            disabled={isPending}
            className={finalCancelClass}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
