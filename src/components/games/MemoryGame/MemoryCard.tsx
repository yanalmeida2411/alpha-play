"use client";

import { Card } from "@/src/types/memory-game";

interface MemoryCardProps {
  card: Card;
  index: number;
  onClick: (index: number) => void;
  isWrong: boolean;
}

export function MemoryCard({ card, index, onClick, isWrong }: MemoryCardProps) {
  return (
    <div
      onClick={() => onClick(index)}
      className={`relative w-40 h-48 cursor-pointer transition-all duration-500 preserve-3d ${
        card.isFlipped || card.isMatched ? "rotate-y-180" : ""
      }`}
    >
      <div className="absolute inset-0 backface-hidden bg-secondary-400 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center p-4"></div>

      <div
        className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-4 shadow-lg flex items-center justify-center ${
          card.isMatched
            ? "border-success-400"
            : isWrong
              ? "border-error"
              : "border-white"
        }`}
        style={{ backgroundColor: card.color }}
      >
        {(card.isFlipped || card.isMatched) && (
          <span className="text-8xl font-black font-nunito text-white">
            {card.letter}
          </span>
        )}
      </div>
    </div>
  );
}
