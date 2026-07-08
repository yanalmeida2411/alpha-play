"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import Modal from "@/src/components/ui/modalPin";
import { deleteAccount } from "@/src/actions/settingsAction";
import { useRouter } from "next/navigation";

interface DeleteAccountSectionProps {
  onError: (error: string) => void;
}

export default function DeleteAccountSection({
  onError,
}: DeleteAccountSectionProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePin, setDeletePin] = useState("");
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const toggleVisibility = (field: string) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleDeleteAccount = async () => {
    if (!deletePin) return;

    setLoading(true);
    const result = await deleteAccount(deletePin);

    if (result.success) {
      router.push("/login");
    } else {
      onError(result.error || "PIN incorreto");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end w-full mt-6">
        <button
          onClick={() => {
            onError("");
            setShowDeleteModal(true);
          }}
          className="bg-[#F80303E5] text-white font-semibold px-6 py-3 rounded-2xl hover:bg-red-600 transition-colors"
        >
          Excluir Minha Conta
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletePin("");
        }}
        title={
          <span className="text-red-600 font-bold text-2xl">Excluir Conta</span>
        }
      >
        <div className="flex flex-col gap-6 py-2">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertTriangle size={48} className="text-red-500" />
            <p className="text-gray-700 font-medium italic">
              Atenção! Esta ação é permanente. Para confirmar a exclusão, insira
              seu PIN abaixo:
            </p>
          </div>

          <div className="relative">
            <input
              type={showPass.delPin ? "text" : "password"}
              placeholder="Digite seu PIN"
              value={deletePin}
              onChange={(e) => setDeletePin(e.target.value)}
              className="w-full h-12 rounded-xl border-2 border-red-200 bg-red-50 px-3.5 outline-none focus:border-red-500 text-center text-xl tracking-widest font-bold"
            />
            <button
              type="button"
              onClick={() => toggleVisibility("delPin")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass.delPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={loading || !deletePin}
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Excluindo..." : "Confirmar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
