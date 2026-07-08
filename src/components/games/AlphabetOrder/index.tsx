"use client";

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { LetterItem, DropZoneItem } from "@/src/types/alphabet-game";
import { GameControls } from "./GameControls";
import { DropZoneBoard } from "./DropZoneBoard";
import { LettersPool } from "./LettersPool";
import { GameFinishedModal } from "../../ui/GameFinishedModal";
import { saveGameResult } from "@/src/actions/gameAction";

const LETTER_COLORS = ["#1E88E5", "#43A047", "#FBC02D", "#E53935", "#E91E63"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

const generateInitialLetters = (): LetterItem[] => {
  return ALPHABET.map((letter) => ({
    id: letter,
    color: "#1E88E5",
  }));
};

const generateInitialZones = (): DropZoneItem[] => {
  return ALPHABET.map((letter, index) => ({
    id: `zone-${index}`,
    correctLetter: letter,
    placedLetter: null,
    status: "idle",
  }));
};

const getInitialLettersPool = (): LetterItem[] => {
  const letters = generateInitialLetters();
  const withRandomColors = letters.map((letter) => ({
    ...letter,
    color:
      LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)] ||
      "#1E88E5",
  }));
  return shuffleArray(withRandomColors);
};

// Componente interno com a lógica do jogo
function AlphabetOrderGameContent({ childId }: { childId: string }) {
  const [lettersPool, setLettersPool] = useState<LetterItem[]>(getInitialLettersPool);
  const [dropZones, setDropZones] = useState<DropZoneItem[]>(generateInitialZones);

  // Game tracking state
  const [timeToStart, setTimeToStart] = useState<string>(() => new Date().toISOString());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [earnedStars, setEarnedStars] = useState<number | undefined>(undefined);

  const initializeGame = useCallback(() => {
    setLettersPool(getInitialLettersPool());
    setDropZones(generateInitialZones());
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setShowFinishedModal(false);
    setEarnedStars(undefined);
    setTimeToStart(new Date().toISOString());
  }, []);

  const handleGameFinished = async (finalDropZones: DropZoneItem[]) => {
    const allCorrect = finalDropZones.every((zone) => zone.status === "correct");
    if (allCorrect && !isSubmitting) {
      setIsSubmitting(true);
      const timeToFinish = new Date().toISOString();
      
      const response = await saveGameResult({
        childId,
        timeToStart,
        timeToFinish,
        correctAnswers: finalDropZones.length,
        wrongAnswers,
      });

      if (response.success && response.data) {
        setEarnedStars(response.data.earnedStars);
      }

      setShowFinishedModal(true);
      setIsSubmitting(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === "letters-pool") return;

    const zoneIndex = parseInt(
      destination.droppableId.replace("zone-", ""),
      10,
    );
    const draggedLetter = lettersPool.find((p) => p.id === draggableId);

    if (!draggedLetter) return;

    const updatedDropZones = [...dropZones];
    const targetZone = updatedDropZones[zoneIndex];

    if (!targetZone || targetZone.placedLetter !== null) return;

    targetZone.placedLetter = draggedLetter;

    if (draggedLetter.id === targetZone.correctLetter) {
      targetZone.status = "correct";
      setLettersPool((prev) => prev.filter((p) => p.id !== draggableId));
      setCorrectAnswers((prev) => prev + 1);
      
      const willBeFinished = updatedDropZones.every(z => z.status === "correct");
      if (willBeFinished) {
        handleGameFinished(updatedDropZones);
      }
    } else {
      targetZone.status = "incorrect";
      setLettersPool((prev) => prev.filter((p) => p.id !== draggableId));
      setWrongAnswers((prev) => prev + 1);

      setTimeout(() => {
        setDropZones((prevZones) => {
          const newZones = [...prevZones];
          const zoneToReset = newZones[zoneIndex];

          if (zoneToReset) {
            zoneToReset.placedLetter = null;
            zoneToReset.status = "idle";
          }
          return newZones;
        });

        setLettersPool((prevPool) => [...prevPool, draggedLetter]);
      }, 1000);
    }

    setDropZones(updatedDropZones);
  };

  return (
    <main className="min-h-screen w-full relative bg-cover bg-top overflow-hidden bg-[url(/assets/bg-alphabet-order.png)] select-none">
      <GameControls
        childId={childId}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        timeToStart={timeToStart}
      />

      <div className="w-full h-full flex flex-col items-center pt-16 pb-12 px-8">
        <h1 className="text-4xl font-semibold text-white font-dynapuff text-center mb-10 uppercase drop-shadow-md">
          Ordenar as letras do alfabeto
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <DropZoneBoard dropZones={dropZones} />
          <LettersPool lettersPool={lettersPool} />
        </DragDropContext>
      </div>

      <GameFinishedModal
        isOpen={showFinishedModal}
        childId={childId}
        onPlayAgain={initializeGame}
        earnedStars={earnedStars}
      />
    </main>
  );
}

const emptySubscribe = () => () => {};

export default function AlphabetOrderGame({ childId }: { childId: string }) {
  const isReady = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isReady) return null;

  return <AlphabetOrderGameContent childId={childId} />;
}
