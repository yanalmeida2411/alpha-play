"use client";

import { useState } from "react";
import { logoutAction } from "@/src/actions/authAction";
import { FiLogOut } from "react-icons/fi";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

export default function LogoutButton({
  customClass = "-z-5",
}: {
  customClass?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirmLogout = async () => {
    setIsPending(true);
    await logoutAction();
  };

  const blueButtonStyle =
    "text-white bg-secondary-400 hover:bg-secondary-500 border-2 border-secondary-400 hover:border-secondary-500 shadow-md";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-5 py-2.5 bg-error hover:bg-error/90 border-2 border-white/30 text-white rounded-full font-bold font-nunito transition-colors cursor-pointer shadow-lg ${customClass}`}
      >
        <FiLogOut size={20} />
        <span className="leading-none">Sair</span>
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Deseja realmente sair da conta?"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isPending={isPending}
        confirmButtonText="Sim"
        cancelButtonText="Não"
        confirmButtonClassName={blueButtonStyle}
        cancelButtonClassName={blueButtonStyle}
      />
    </>
  );
}
