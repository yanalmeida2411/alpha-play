"use client";

import { useState, useSyncExternalStore, useEffect, useRef } from "react";
import { CircleArrowLeft } from "lucide-react";
import { Maximize, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { GameFinishedModal } from "../../ui/GameFinishedModal";
import { saveLettersAndSoundsResult } from "@/src/actions/letrasESonsAction";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const playSound = (letter: string) => {
  const audio = new Audio(`/sounds/${letter.toLowerCase()}.mp3`);
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      if (error.name === "AbortError") {
        return;
      }
      console.error("Erro ao reproduzir áudio:", error);
    });
  }
};

function LetrasESonsContent({ childId }: { childId: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [_clickedLetters, setClickedLetters] = useState<Set<string>>(new Set());
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [timeToStart, setTimeToStart] = useState(() =>
    new Date().toISOString(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [earnedStars, setEarnedStars] = useState<number | undefined>(undefined);

  const handleGameFinished = async (finalClicks: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const timeToFinish = new Date().toISOString();

    const response = await saveLettersAndSoundsResult({
      childId,
      timeToStart,
      timeToFinish,
      totalClicks: finalClicks,
    });

    if (response.success && response.data) {
      setEarnedStars(response.data.earnedStars);
    }

    setShowFinishedModal(true);
    setIsSubmitting(false);
  };

  const handleClick = (letter: string) => {
    setSelected(letter);
    playSound(letter);

    setTimeout(() => setSelected(null), 600);

    setClickedLetters((prev) => {
      const updated = new Set(prev);
      const isNewLetter = !updated.has(letter);
      updated.add(letter);

      if (isNewLetter && updated.size === ALPHABET.length) {
        setTimeout(() => handleGameFinished(updated.size), 0);
      }

      return updated;
    });
  };

  const handlePlayAgain = () => {
    setClickedLetters(new Set());
    setShowFinishedModal(false);
    setEarnedStars(undefined);
    setTimeToStart(new Date().toISOString());
  };

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Audio("/musics/musica01-letras-e-sons.mp3");
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.05;

    return () => {
      bgMusicRef.current?.pause();
    };
  }, []);

  const handleToggleMusic = () => {
    if (!bgMusicRef.current) return;

    if (isMusicPlaying) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play();
    }
    setIsMusicPlaying((prev) => !prev);
  };

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/assets/fundo.png')" }}
    >
      <header className="flex justify-between items-center p-4">
        <Link
          href={`/${childId}`}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-nunito font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Link>

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="py-2.5 px-5.5 bg-white rounded-2xl text-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Maximize size={24} />
          </button>
          <button
            onClick={handleToggleMusic}
            className="py-2.5 px-5.5 bg-white rounded-2xl text-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </header>

      <h1 className="text-center font-dynapuff text-[40px] font-bold text-[#0C78F4] [text-shadow:-2px_-2px_0_#ECF0FF,2px_-2px_0_#ECF0FF,-2px_2px_0_#ECF0FF,2px_2px_0_#ECF0FF] tracking-[-0.5%] mb-8">
        Aprender Letras e Sons
      </h1>

      <div className="flex justify-center">
        <div className="grid grid-cols-6 gap-8 mb-20">
          {ALPHABET.map((letter) => (
            <div
              key={letter}
              onClick={() => handleClick(letter)}
              className={`flex justify-center items-center cursor-pointer ${
                letter === "Y" ? "col-start-3" : ""
              }`}
            >
              <img
                src={
                  selected === letter
                    ? "/assets/retangulo-azul.png"
                    : "/assets/retangulo.png"
                }
                alt="Caixa de retângulo"
                className="cursor-pointer w-30 h-30"
              />
              <span className="absolute text-center text-[60px] font-[Nunito] font-bold text-[#000000]">
                {letter}
              </span>
            </div>
          ))}
        </div>
      </div>

      <GameFinishedModal
        isOpen={showFinishedModal}
        childId={childId}
        onPlayAgain={handlePlayAgain}
        earnedStars={earnedStars}
      />
    </main>
  );
}

const emptySubscribe = () => () => {};

export default function LetrasESons({ childId }: { childId: string }) {
  const isReady = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isReady) return null;

  return <LetrasESonsContent childId={childId} />;
}
