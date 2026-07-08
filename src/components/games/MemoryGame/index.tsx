"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { MemoryGameModal } from "../../ui/MemoryGameModal";
import { MemoryCard } from "./MemoryCard";
import { MemoryGameHeader } from "./MemoryGameHeader";
import { useMemoryGame } from "@/src/hooks/useMemoryGame";
import { MemoryGameProps } from "@/src/types/memory-game";

function MemoryGameContent({ childId }: MemoryGameProps) {
  const router = useRouter();
  const {
    level,
    cards,
    showModal,
    wrongPair,
    handleCardClick,
    handleNextLevel,
    getPairsCount,
    handleExit: saveGameResult,
    earnedStars,
  } = useMemoryGame(childId);

  const handleExit = async () => {
    await saveGameResult();
    router.push(`/${childId}`);
  };

  return (
    <main className="min-h-screen w-full bg-cover bg-center overflow-hidden flex flex-col bg-[url('/assets/bg-memory-game.png')]">
      <MemoryGameHeader childId={childId} onExit={handleExit} />

      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="grid gap-6 justify-items-center w-fit grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
          style={{ "--cols": getPairsCount(level) } as React.CSSProperties}
        >
          {cards.map((card, index) => (
            <MemoryCard
              key={card.id}
              card={card}
              index={index}
              onClick={handleCardClick}
              isWrong={wrongPair.includes(index)}
            />
          ))}
        </div>
      </div>

      <MemoryGameModal
        isOpen={showModal}
        childId={childId}
        onNextLevel={handleNextLevel}
        onExit={handleExit}
        isLastLevel={level === 3}
        earnedStars={earnedStars}
      />

      <style jsx global>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </main>
  );
}

const emptySubscribe = () => () => {};

export default function MemoryGame({ childId }: MemoryGameProps) {
  const isReady = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isReady) return null;

  return <MemoryGameContent childId={childId} />;
}
