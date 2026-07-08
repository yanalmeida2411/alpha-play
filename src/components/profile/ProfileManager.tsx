"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileList from "./ProfileList";
import PinModal from "./PinModal";
import ChildFormModal from "./ChildFormModal";
import { ChildProfile, ProfileManagerProps } from "@/src/types";
import {
  createChild,
  updateChild,
  deleteChild,
} from "@/src/actions/profileAction";

const AVATAR_MAP: Record<string, string> = {
  "avatar-01": "/avatars/avatar-01.jpg",
  "avatar-02": "/avatars/avatar-02.jpg",
  "avatar-03": "/avatars/avatar-03.jpg",
  "avatar-04": "/avatars/avatar-04.jpg",
  "avatar-05": "/avatars/avatar-05.jpg",
  "avatar-06": "/avatars/avatar-06.jpg",
  "avatar-07": "/avatars/avatar-07.jpg",
  "avatar-08": "/avatars/avatar-08.jpg",
  "avatar-09": "/avatars/avatar-09.jpg",
  "avatar-10": "/avatars/avatar-10.jpg",
  "avatar-11": "/avatars/avatar-11.jpg",
  "avatar-12": "/avatars/avatar-12.jpg",
  "avatar-13": "/avatars/avatar-13.jpg",
  "avatar-14": "/avatars/avatar-14.jpg",
  "avatar-15": "/avatars/avatar-15.jpg",
  "avatar-16": "/avatars/avatar-16.jpg",
};

export default function ProfileManager({
  childrenData = [],
}: ProfileManagerProps) {
  const router = useRouter();

  const [step, setStep] = useState<"IDLE" | "PIN" | "FORM">("IDLE");
  const [mode, setMode] = useState<"CREATE" | "UPDATE">("CREATE");
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  const handleOpenCreate = () => {
    setMode("CREATE");
    setSelectedChild(null);
    setStep("PIN");
  };

  const handleOpenEdit = (child: ChildProfile) => {
    setMode("UPDATE");
    setSelectedChild(child);
    setStep("PIN");
  };

  const closeModal = () => {
    setStep("IDLE");
  };

  const handlePinSuccess = () => {
    setStep("FORM");
  };

  const handleFormSubmit = async (payload: FormData) => {
    let result;

    if (mode === "CREATE") {
      result = await createChild(payload);
    } else {
      if (selectedChild?._id) {
        result = await updateChild(selectedChild._id, payload);
      } else {
        throw new Error("ID do perfil não encontrado.");
      }
    }

    if (result?.success) {
      router.refresh();

      if (mode === "CREATE") {
        closeModal();
      }
    } else {
      throw new Error(result?.error || "Erro ao salvar.");
    }
  };

  const handleDeleteChild = async (id: string) => {
    const result = await deleteChild(id);

    if (result.success) {
      closeModal();
      router.refresh();
    } else {
      alert("Erro ao excluir: " + (result.error || "Erro desconhecido"));
    }
  };

  return (
    <>
      <ProfileList
        childrenData={childrenData}
        onAdd={handleOpenCreate}
        onEdit={handleOpenEdit}
        avatarMap={AVATAR_MAP}
      />

      {step === "PIN" && (
        <PinModal
          isOpen={true}
          onClose={closeModal}
          onSuccess={handlePinSuccess}
        />
      )}

      {step === "FORM" && (
        <ChildFormModal
          isOpen={true}
          onClose={closeModal}
          mode={mode}
          initialData={selectedChild}
          avatarMap={AVATAR_MAP}
          onSubmit={handleFormSubmit}
          onDelete={handleDeleteChild}
        />
      )}
    </>
  );
}
