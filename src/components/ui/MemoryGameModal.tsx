"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { IoMdRefresh, IoMdHome } from "react-icons/io";
import { FaStar } from "react-icons/fa";

interface MemoryGameModalProps {
  isOpen: boolean;
  childId: string;
  onNextLevel: () => void;
  onExit: () => void;
  isLastLevel: boolean;
  earnedStars?: number;
}

export function MemoryGameModal({
  isOpen,
  childId,
  onNextLevel,
  onExit,
  isLastLevel,
  earnedStars,
}: MemoryGameModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen && isLastLevel) {
      const timer = setTimeout(() => {
        onExit();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isLastLevel, onExit]);

  if (!isOpen) return null;

  const starsToShow = earnedStars !== undefined ? earnedStars : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 transition-all duration-300">
      <div className="rounded-lg px-12.25 py-8 flex flex-col items-center text-center bg-white">
        <div className="relative w-full h-44 mb-4">
          <Image
            src={isLastLevel ? "/assets/foxEndGame.png" : "/assets/next-fox.png"}
            alt="Parabéns"
            fill
            className="object-contain"
            priority
          />
        </div>

        {isLastLevel && (
          <>
            <div className="flex gap-2 mb-6 justify-center w-full">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={48} className="text-[#FFD700]" />
              ))}
            </div>

            <div className="flex flex-col gap-2 mb-10">
              <p className="text-2xl font-black text-gray-800 font-nunito leading-none">
                Você ganhou {starsToShow} estrelas!
              </p>
            </div>
          </>
        )}

        <div className="flex gap-6 justify-center">
          {!isLastLevel ? (
            <button
              onClick={onNextLevel}
              className="flex items-center justify-center gap-2 py-4 px-2 bg-[#27CD27] hover:bg-[#22B322] text-white text-[16px] font-black rounded-xl transition-all transform active:translate-y-1 font-nunito"
            >
              <IoMdRefresh size={22} className="text-white" />
              <span className="leading-none">Continuar</span>
            </button>
          ) : (
            <button
              onClick={onNextLevel}
              className="flex items-center justify-center gap-2 py-4 px-2 bg-[#27CD27] hover:bg-[#22B322] text-white text-[16px] font-black rounded-xl transition-all transform active:translate-y-1 font-nunito"
            >
              <IoMdRefresh size={22} className="text-white" />
              <span className="leading-none">Jogar Novamente</span>
            </button>
          )}

          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 py-3 px-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white text-[16px] font-black rounded-xl transition-all transform active:translate-y-1 font-nunito"
          >
            <IoMdHome size={22} className="text-white" />
            <span className="leading-none">{isLastLevel ? "Voltar Home" : "Encerrar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
