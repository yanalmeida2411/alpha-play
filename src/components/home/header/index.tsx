"use client";

import { useState } from "react";
import { CircleArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import LogoutButton from "@/src/components/ui/LogoutButton";
import PinModal from "@/src/components/profile/PinModal";

export default function HeaderHome() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const [showPinModal, setShowPinModal] = useState(false);

  const handlePinSuccess = async () => {
    setShowPinModal(false);
    if (childId) {
      router.push(`/${childId}/dashboard`);
    } else {
      router.push("/profile");
    }
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <Link
          href="/profile"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full font-nunito font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <CircleArrowLeft size={18} />
          <span className="leading-none">Voltar</span>
        </Link>

        <div className="flex gap-4">
          <button
            onClick={() => setShowPinModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-nunito font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Users size={18} />
            <span className="leading-none">Área do Responsável</span>
          </button>

          <LogoutButton customClass="z-10" />
        </div>
      </header>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
      />
    </>
  );
}
