"use client";

import { FiX } from "react-icons/fi";
import { ModalProps } from "@/src/types";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  hideCloseButton = false,
}: ModalProps) {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 cursor-pointer"
    >
      <div className="bg-white rounded-2xl overflow-hidden relative cursor-default py-8 px-8  flex flex-col items-center">
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-black z-10"
          >
            <FiX size={32} strokeWidth={3} spacing={0} />
          </button>
        )}

        {title && <div className="w-full text-center mb-8 ">{title}</div>}

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
