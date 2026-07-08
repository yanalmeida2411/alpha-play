"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { UserProfile } from "@/src/types";
import { updateUser } from "@/src/actions/settingsAction";
import { PersonalDataSchema } from "@/src/lib/schemas/settingsSchema";
import * as v from "valibot";
import PinModal from "@/src/components/profile/PinModal";

interface PersonalDataFormProps {
  initialUser: UserProfile | null;
  onSuccess: () => void;
  onError: (error: string) => void;
  setIsDirty: (dirty: boolean) => void;
}

interface PersonalFormData {
  newName: string;
  newSurname: string;
  newEmail: string;
  pinCode: string;
  newPin: string;
}

export default function PersonalDataForm({
  initialUser,
  onSuccess,
  onError,
  setIsDirty,
}: PersonalDataFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  
  // Todos os campos começam vazios, os dados atuais vão no placeholder
  const initialData: PersonalFormData = {
    newName: "",
    newSurname: "",
    newEmail: "",
    pinCode: "",
    newPin: "",
  };

  const [userData, setUserData] = useState<PersonalFormData>(initialData);

  const toggleVisibility = (field: string) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof PersonalFormData, value: string) => {
    let maskedValue = value;
    
    if (field === "newName" || field === "newSurname") {
        maskedValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]/g, "");
    }
    
    if (field === "pinCode" || field === "newPin") {
        maskedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    const newData = { ...userData, [field]: maskedValue };
    setUserData(newData);

    // Agora dirty é se qualquer campo não for string vazia
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
    setUserData(initialData);
    setErrors({});
    setIsDirty(false);
  };

  const handlePreSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      v.parse(PersonalDataSchema, userData);
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

  const handleConfirmUpdate = async (confirmationPin: string) => {
    setLoading(true);
    const formData = new FormData();
    
    // O pin de confirmação do modal é o que autoriza a requisição
    formData.append("pinCode", confirmationPin);

    // Envia apenas o que não estiver vazio
    if (userData.newName !== "") formData.append("newName", userData.newName);
    if (userData.newSurname !== "") formData.append("newSurname", userData.newSurname);
    if (userData.newEmail !== "") formData.append("newEmail", userData.newEmail);
    
    // Se o usuário preencheu os campos de alteração de PIN no formulário
    if (userData.newPin !== "") {
        // Nota: O backend pode precisar do pinCode do formulário ou apenas do novo
        // Seguindo a lógica anterior de envio seletivo:
        formData.append("newPin", userData.newPin);
    }

    const result = await updateUser(formData);

    if (result.success) {
      setShowConfirmPin(false);
      onSuccess();
      setIsDirty(false);
      setUserData(initialData);
    } else {
      setShowConfirmPin(false);
      onError(result.error || "Erro ao atualizar dados");
    }
    setLoading(false);
  };

  const getFieldClass = (fieldName: string) => {
    const baseClass = "h-12 rounded-xl border-2 px-3.5 outline-none transition-all font-nunito font-semibold text-[16px]";
    if (errors[fieldName]) {
      return `${baseClass} border-[#f80303] bg-[#f8030310] text-[#f80303]`;
    }
    return `${baseClass} border-[#759FFE] bg-[#ECF0FF] focus:border-[#0C78F4] text-secondary-700`;
  };

  return (
    <>
      <form onSubmit={handlePreSave} className="mb-5">
        <div className="flex flex-col gap-8">
          <div className="col-span-2">
            <h1 className="font-nunito font-bold text-[20px] text-black border-b border-secondary-200 pb-2">
              Perfil do Responsável
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">Nome do responsável:</label>
              <input
                type="text"
                value={userData.newName}
                onChange={(e) => handleChange("newName", e.target.value)}
                placeholder={initialUser?.name || "Nome do responsável"}
                className={getFieldClass("newName")}
              />
              {errors.newName && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.newName}</span>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">Sobrenome:</label>
              <input
                type="text"
                value={userData.newSurname}
                onChange={(e) => handleChange("newSurname", e.target.value)}
                placeholder={initialUser?.surname || "Sobrenome do responsável"}
                className={getFieldClass("newSurname")}
              />
              {errors.newSurname && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.newSurname}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2 opacity-70">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">E-mail atual:</label>
              <input
                type="email"
                value={initialUser?.email || ""}
                disabled
                className="h-12 rounded-xl border-2 border-gray-300 bg-gray-100 px-3.5 outline-none cursor-not-allowed font-nunito font-semibold text-[16px] text-gray-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">Alterar e-mail:</label>
              <input
                type="email"
                value={userData.newEmail}
                onChange={(e) => handleChange("newEmail", e.target.value)}
                className={getFieldClass("newEmail")}
                placeholder={initialUser?.email || "nome@dominio.com"}
              />
              {errors.newEmail && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.newEmail}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">Pin de Segurança Atual:</label>
              <div className="relative flex flex-col">
                <input
                  type={showPass.pin ? "text" : "password"}
                  value={userData.pinCode}
                  onChange={(e) => handleChange("pinCode", e.target.value)}
                  className={getFieldClass("pinCode")}
                  placeholder="0000"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("pin")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-secondary-400 transition-colors"
                >
                  {showPass.pin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.pinCode && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.pinCode}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-nunito font-bold text-[18px] text-secondary-700">Definir Novo Pin:</label>
              <div className="relative flex flex-col">
                <input
                  type={showPass.newPin ? "text" : "password"}
                  value={userData.newPin}
                  onChange={(e) => handleChange("newPin", e.target.value)}
                  className={getFieldClass("newPin")}
                  placeholder="0000"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("newPin")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-secondary-400 transition-colors"
                >
                  {showPass.newPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPin && <span className="text-[#f80303] font-bold text-xs mt-1">{errors.newPin}</span>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 font-nunito font-bold px-8 py-3 rounded-xl hover:bg-gray-300 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !Object.values(userData).some(val => val !== "")}
            className="bg-secondary-400 text-white font-nunito font-bold px-8 py-3 rounded-xl hover:bg-[#1f6fe3] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Salvar alterações de perfil"}
          </button>        </div>
      </form>

      <PinModal 
        isOpen={showConfirmPin}
        onClose={() => setShowConfirmPin(false)}
        onSuccess={() => {}} // Não usado aqui pois usamos onConfirm
        onConfirm={handleConfirmUpdate}
      />
    </>
  );
}
