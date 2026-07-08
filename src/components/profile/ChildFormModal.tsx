"use client";

import { useState, useEffect } from "react";
import {
  BiSolidLeftArrowCircle,
  BiSolidRightArrowCircle,
} from "react-icons/bi";
import Modal from "@/src/components/ui/modalPin";
import Image from "next/image";
import { safeParse } from "valibot";
import { ChildSchema } from "@/src/lib/schemas/childSchema";
import { ChildFormModalProps } from "@/src/types";

const maskDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
};

const capitalizeName = (name: string) => {
  return name.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const formatDateToDisplay = (isoDate: string) => {
  if (!isoDate) return "";
  if (isoDate.includes("/")) return isoDate;
  const datePart = isoDate.split("T")[0] || "";
  const parts = datePart.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

export default function ChildFormModal({
  isOpen,
  onClose,
  mode,
  initialData,
  avatarMap,
  onSubmit,
  onDelete,
}: ChildFormModalProps) {
  const AVATAR_KEYS = Object.keys(avatarMap).filter((k) => k !== "default");

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    avatar: "avatar-01",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSuccessMsg("");
      setShowDeleteConfirm(false);

      if (mode === "UPDATE" && initialData) {
        setFormData({
          name: initialData.name || "",
          birthDate: initialData.birthDate
            ? formatDateToDisplay(String(initialData.birthDate))
            : "",
          avatar: initialData.avatar || "avatar-01",
        });
      } else {
        setFormData({ name: "", birthDate: "", avatar: "avatar-01" });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskDate(e.target.value);
    setFormData({ ...formData, birthDate: masked });
    if (errors.birthDate) setErrors({ ...errors, birthDate: "" });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    if (errors.name) setErrors({ ...errors, name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");

    const finalName = capitalizeName(formData.name);

    const dataToValidate = {
      name: finalName,
      birthDate: formData.birthDate,
      avatar: formData.avatar,
    };

    const result = safeParse(ChildSchema, dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0].key as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("name", finalName);
    payload.append("birthDate", formData.birthDate);
    payload.append("avatar", formData.avatar);

    try {
      await onSubmit(payload);
      if (mode === "UPDATE") {
        setSuccessMsg("Alterações salvas!");
        setTimeout(() => onClose(), 1500);
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: "Erro ao salvar." });
    } finally {
      if (mode !== "UPDATE") setLoading(false);
    }
  };

  const handlePrevAvatar = () => {
    const currentIndex = AVATAR_KEYS.indexOf(formData.avatar);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const newIndex = safeIndex <= 0 ? AVATAR_KEYS.length - 1 : safeIndex - 1;
    setFormData({ ...formData, avatar: AVATAR_KEYS[newIndex] || "avatar-01" });
  };

  const handleNextAvatar = () => {
    const currentIndex = AVATAR_KEYS.indexOf(formData.avatar);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const newIndex = safeIndex >= AVATAR_KEYS.length - 1 ? 0 : safeIndex + 1;
    setFormData({ ...formData, avatar: AVATAR_KEYS[newIndex] || "avatar-01" });
  };

  const currentAvatarUrl = avatarMap[formData.avatar] || "";

  const ModalTitle = (
    <h2 className="text-6xl font-dynapuff font-black text-secondary-400">
      {mode === "CREATE" ? "Adicionar Criança" : "Editar Criança"}
    </h2>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={ModalTitle}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 text-black"
        >
          <div className="flex justify-center items-center gap-4">
            <button type="button" onClick={handlePrevAvatar}>
              <BiSolidLeftArrowCircle size={72} />
            </button>

            <div className="relative rounded-full overflow-hidden outline-2 outline-black w-40 h-40">
              <Image
                src={currentAvatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
                draggable="false"
                unoptimized
              />
            </div>

            <button type="button" onClick={handleNextAvatar}>
              <BiSolidRightArrowCircle size={72} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-black font-bold mb-1 ml-1 text-lg font-nunito">
                Nome da Criança:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className={`w-full bg-secondary-100 border-2 rounded-xl px-4 py-3 text-gray-700 text-lg placeholder-[#1F1C1B] focus:outline-none focus:bg-white transition-all font-medium ${
                  errors.name
                    ? "border-tertiary-300 bg-tertiary-100"
                    : "border-secondary-300"
                }`}
                placeholder="Digite o nome"
              />
              {errors.name && (
                <span className="text-tertiary-300 text-xs font-bold ml-1 mt-1 block">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="text-left">
              <label className="block text-black font-bold mb-1 ml-1 text-lg font-nunito">
                Data de Nascimento:
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={formData.birthDate}
                onChange={handleDateChange}
                placeholder="DD/MM/AAAA"
                className={`w-full bg-secondary-100 border-2 rounded-xl px-4 py-3 text-gray-700 text-lg placeholder-[#1F1C1B] focus:outline-none focus:bg-white transition-all font-medium ${
                  errors.birthDate
                    ? "border-tertiary-300 bg-tertiary-100"
                    : "border-secondary-300"
                }`}
              />
              {errors.birthDate && (
                <span className="text-tertiary-300 text-xs font-bold ml-1 mt-1 block">
                  {errors.birthDate}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {mode === "UPDATE" && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 bg-secondary-400  text-white font-bold py-2 rounded-lg text-lg"
              >
                Excluir
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !!successMsg}
              className={`bg-secondary-400  text-white font-bold py-2 rounded-lg text-lg ${
                mode === "UPDATE" ? "flex-1" : "w-full mx-auto max-w-42.5"
              }`}
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title={
            <span className="text-xl font-bold text-black mb-4">
              Tem certeza que deseja excluir o perfil?
            </span>
          }
          hideCloseButton={true}
        >
          <div className="text-center px-2">
            <div className="flex gap-4 justify-center *:bg-secondary-400 *:text-xl *:text-white *:font-bold *:py-2 *:px-6.75 *:rounded-lg">
              <button
                onClick={async () => {
                  if (initialData?._id && onDelete) {
                    await onDelete(initialData._id);
                  }
                  setShowDeleteConfirm(false);
                }}
              >
                Sim
              </button>
              <button onClick={() => setShowDeleteConfirm(false)}>Não</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
