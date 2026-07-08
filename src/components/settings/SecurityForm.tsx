"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/src/actions/settingsAction";
import { PasswordSchema } from "@/src/lib/schemas/settingsSchema";
import * as v from "valibot";
import PinModal from "@/src/components/profile/PinModal";

interface SecurityFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  setIsDirty: (dirty: boolean) => void;
}

interface SecurityFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecurityForm({ onSuccess, onError, setIsDirty }: SecurityFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  
  const initialData: SecurityFormData = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [passwordData, setPasswordData] = useState<SecurityFormData>(initialData);

  const toggleVisibility = (field: string) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof SecurityFormData, value: string) => {
    const newData = { ...passwordData, [field]: value };
    setPasswordData(newData);

    const isDirty = Object.values(newData).some(val => val !== "");
    setIsDirty(isDirty);

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    setPasswordData(initialData);
    setErrors({});
    setIsDirty(false);
  };

  // 1. Valida campos e abre o modal de PIN
  const handlePreSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      v.parse(PasswordSchema, passwordData);
      setShowConfirmPin(true);
    } catch (err: unknown) {
      if (err instanceof v.ValiError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const path = issue.path?.[0].key as string;
          if (path && !newErrors[path]) newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  // 2. Executa a alteração de senha com o PIN
  const handleConfirmUpdate = async (pinCode: string) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("pinCode", pinCode);
    formData.append("oldPassword", passwordData.oldPassword);
    formData.append("newPassword", passwordData.newPassword);
    formData.append("confirmPassword", passwordData.confirmPassword);

    const result = await updatePassword(formData);

    if (result.success) {
      setShowConfirmPin(false);
      onSuccess();
      setIsDirty(false);
      setPasswordData(initialData);
    } else {
      setShowConfirmPin(false);
      onError(result.error || "Erro ao alterar senha");
    }
    setLoading(false);
  };

  const getFieldClass = (fieldName: string) => {
    const baseClass = "w-full h-12 rounded-xl border-2 px-3.5 outline-none transition-all font-nunito font-semibold text-[16px]";
    if (errors[fieldName]) {
      return `${baseClass} border-[#f80303] bg-[#f8030310] text-[#f80303]`;
    }
    return `${baseClass} border-[#759FFE] bg-[#ECF0FF] focus:border-[#0C78F4] text-secondary-700`;
  };

  return (
    <>
      <form onSubmit={handlePreSave} className="col-span-2">
        <h1 className="mb-6 font-nunito font-bold text-[20px] text-black border-b border-secondary-200 pb-2">
          Segurança da Conta
        </h1>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 max-w-[calc(50%-1rem)]">
            <label className="font-nunito font-bold text-[18px] text-secondary-700">
              Senha Atual:
            </label>
            <div className="relative">
              <input
                type={showPass.oldP ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={(e) => handleChange("oldPassword", e.target.value)}
                placeholder="********"
                className={getFieldClass("oldPassword")}
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("oldP")}
                className="absolute right-3 top-3 text-gray-400 hover:text-secondary-400 transition-colors"
              >
                {showPass.oldP ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.oldPassword}</span>}
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">
                Nova Senha:
              </label>
              <div className="relative">
                <input
                  type={showPass.newP ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                  placeholder="********"
                  className={getFieldClass("newPassword")}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("newP")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-secondary-400 transition-colors"
                >
                  {showPass.newP ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.newPassword}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">
                Confirmar Nova Senha:
              </label>
              <div className="relative">
                <input
                  type={showPass.confP ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="********"
                  className={getFieldClass("confirmPassword")}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("confP")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-secondary-400 transition-colors"
                >
                  {showPass.confP ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.confirmPassword}</span>}
            </div>
          </div>

        <div className="flex items-end justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 font-nunito font-bold px-8 py-3 rounded-xl hover:bg-gray-300 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !Object.values(passwordData).some(val => val !== "")}
            className="bg-secondary-400 text-white font-nunito font-bold px-8 py-3 rounded-xl hover:bg-[#1f6fe3] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Atualizando..." : "Atualizar Senha"}
          </button>
        </div>
        </div>
      </form>

      <PinModal 
        isOpen={showConfirmPin}
        onClose={() => setShowConfirmPin(false)}
        onSuccess={() => {}} // Não usado aqui
        onConfirm={handleConfirmUpdate}
      />
    </>
  );
}
