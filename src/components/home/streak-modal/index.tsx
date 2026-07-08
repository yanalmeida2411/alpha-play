"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { ChildProfile } from "@/src/types";
import { setStreakShown } from "@/src/actions/homeAction";

interface StreakModalProps {
  child: ChildProfile;
  lastStreakCount: number;
}

export default function StreakModal({
  child,
  lastStreakCount,
}: StreakModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const currentStreak = child.streakDays || child.consecutiveDays || 0;

  const isMaintained =
    currentStreak === lastStreakCount + 1 ||
    (lastStreakCount === 7 && currentStreak === 1);

  const isBroken = lastStreakCount > 0 && !isMaintained;

  const handleClose = async () => {
    setIsOpen(false);
    if (child?._id) {
      await setStreakShown(child._id, currentStreak);
    }
  };

  if (!isOpen) return null;

  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-300">
      <div className="bg-streak-bg rounded-3xl p-8 flex flex-col items-center text-center ">
        <div>
          <Image
            src={isBroken ? "/assets/sad-fox.png" : "/assets/happy-fox.png"}
            width={135}
            height={111}
            alt="Raposinha"
            className="object-contain"
          />
        </div>

        {isBroken ? (
          <>
            <h2 className="text-xl font-dynapuff text-streak-text-primary mb-4 leading-tight tracking-tight">
              Senti sua falta!
            </h2>
            <p className="text-base font-dynapuff text-streak-text-secondary mb-4 leading-snug">
              Vamos brincar mais um pouco?
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-dynapuff text-streak-text-primary mb-4 leading-tight tracking-tight">
              Oi, {child.name}! Que bom te ver!
            </h2>
            <p className="text-base font-dynapuff text-streak-text-secondary mb-4 leading-snug">
              Você conquistou sua{" "}
              {currentStreak > 1 ? `${currentStreak}ª` : "primeira"} estrela
            </p>
          </>
        )}

        <div className="flex gap-2 justify-between w-full rounded-full bg-streak-bar-bg p-2.5 mb-6 px-5">
          {days.map((day) => {
            const isCompleted = day <= currentStreak;
            return (
              <div
                key={day}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-all
                  ${
                    isCompleted
                      ? "bg-streak-star-active shadow-sm"
                      : "bg-streak-day-bg text-streak-text-muted"
                  }`}
              >
                {isCompleted ? (
                  <Star
                    size={25}
                    className="fill-streak-text-muted text-streak-text-muted"
                  />
                ) : (
                  day
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleClose}
          className="bg-button-primary hover:bg-button-primary-hover text-white text-xl font-bold py-3 px-10 rounded-xl transition-all "
        >
          Vamos lá
        </button>
      </div>
    </div>
  );
}
