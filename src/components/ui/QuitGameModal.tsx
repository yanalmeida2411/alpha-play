"use client";

import { useState } from "react";
import { CircleArrowLeft } from "lucide-react";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";

import { saveGameResult } from "@/src/actions/gameAction";

export default function QuitGameButton({
  customClass = "z-10",
  childId,
  correctAnswers = 0,
  wrongAnswers = 0,
  timeToStart = new Date().toISOString(),
  onSave,
}: {
  customClass?: string;
  childId: string;
  correctAnswers?: number;
  wrongAnswers?: number;
  timeToStart?: string;
  onSave?: () => Promise<void>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleConfirmQuit = async (childId: string) => {
    setIsPending(true);
    try {
      if (onSave) {
        await onSave();
      } else if (correctAnswers > 0) {
        await saveGameResult({
          childId,
          timeToStart,
          timeToFinish: new Date().toISOString(),
          correctAnswers,
          wrongAnswers,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar resultado parcial:", error);
    } finally {
      setIsPending(false);
      router.push(`/${childId}`);
    }
  };

  const blueButtonStyle =
    "text-white bg-secondary-400 hover:bg-secondary-500 border-2 border-secondary-400 hover:border-secondary-500 shadow-md";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-nunito font-semibold transition-colors shadow-sm cursor-pointer`}
      >
        <CircleArrowLeft size={24} />
        <span className="leading-none">Voltar</span>
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Deseja sair?"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => handleConfirmQuit(childId)}
        isPending={isPending}
        confirmButtonText="Sim"
        cancelButtonText="Não"
        confirmButtonClassName={blueButtonStyle}
        cancelButtonClassName={blueButtonStyle}
      />
    </>
  );
}
