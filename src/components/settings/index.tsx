"use client";

import { useState } from "react";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { UserProfile } from "@/src/types";
import { useParams, useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import PersonalDataForm from "./PersonalDataForm";
import SecurityForm from "./SecurityForm";
import DeleteAccountSection from "./DeleteAccountSection";
import SuccessModal from "./SuccessModal";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

export default function SettingsClient({
  initialUser,
}: {
  initialUser: UserProfile | null;
}) {
  const params = useParams();
  const router = useRouter();
  const childId = (params?.childId as string) || "";

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Controle de alterações pendentes
  const [isPersonalDirty, setIsPersonalDirty] = useState(false);
  const [isSecurityDirty, setIsSecurityDirty] = useState(false);

  const isAnyDirty = isPersonalDirty || isSecurityDirty;

  const handleSuccess = () => {
    setShowSuccessModal(true);
    setErrorMessage("");
    // Após salvar com sucesso, redireciona para o dashboard
    setTimeout(() => {
        router.push(`/${childId}/dashboard`);
    }, 2000);
  };

  const handleBack = () => {
    if (isAnyDirty) {
      setShowBackConfirm(true);
    } else {
      router.push(`/${childId}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#D6EBFF" }}>
      <Sidebar childId={childId} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-[32px] font-nunito">Configurações</h1>
            <h2 className="text-[15px] text-[#111827] font-nunito">
              Atualize as informações da sua conta.
            </h2>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full font-nunito font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <CircleArrowLeft size={18} />
            <span>Voltar</span>
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 flex justify-between items-center">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage("")} className="font-bold">
              ×
            </button>
          </div>
        )}

        <div className="bg-[#FFFFFFD9] rounded-2xl p-8 w-full shadow-sm">
          <PersonalDataForm
            initialUser={initialUser}
            onSuccess={handleSuccess}
            onError={setErrorMessage}
            setIsDirty={setIsPersonalDirty}
          />

          <SecurityForm 
            onSuccess={handleSuccess} 
            onError={setErrorMessage}
            setIsDirty={setIsSecurityDirty}
          />
        </div>

        <DeleteAccountSection onError={setErrorMessage} />
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <ConfirmModal
        isOpen={showBackConfirm}
        title="Alterações pendentes"
        message="Você fez alterações que não foram salvas. Deseja realmente voltar e cancelar as alterações?"
        onConfirm={() => router.push(`/${childId}/dashboard`)}
        onCancel={() => setShowBackConfirm(false)}
        confirmButtonText="Sim"
        cancelButtonText="Não"
        confirmButtonClassName="bg-blue-500 hover:bg-blue-600 text-white"
        cancelButtonClassName="bg-gray-200 text-gray-700"
      />
    </div>
  );
}
