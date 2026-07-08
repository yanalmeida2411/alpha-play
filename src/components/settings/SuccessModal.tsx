"use client";

import { CheckCircle2 } from "lucide-react";
import Modal from "@/src/components/ui/modalPin";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="text-secondary-400 font-dynapuff font-black text-4xl">
          Sucesso!
        </span>
      }
    >
      <div className="flex flex-col items-center py-4 gap-4">
        <CheckCircle2 size={80} className="text-green-500" />
        <p className="text-xl font-bold text-center text-[#111827]">
          Suas alterações foram salvas com sucesso.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#0C78F4] text-white font-bold py-3 rounded-xl text-lg hover:bg-blue-600 transition-colors"
        >
          Entendido
        </button>
      </div>
    </Modal>
  );
}
