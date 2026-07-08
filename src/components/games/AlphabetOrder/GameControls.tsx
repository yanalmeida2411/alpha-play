"use client";
import { Maximize, Clock3, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import QuitGameButton from "../../ui/QuitGameModal";

export function GameControls({
  childId,
  correctAnswers = 0,
  wrongAnswers = 0,
  timeToStart = new Date().toISOString(),
}: {
  childId: string;
  correctAnswers?: number;
  wrongAnswers?: number;
  timeToStart?: string;
}) {
  const [_isFull, setIsFull] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Audio("/musics/musica02-ordenar-alfabeto.mp3");
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFull(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erro: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <div className="absolute top-4 left-4 flex gap-2">
        <QuitGameButton
          childId={childId}
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
          timeToStart={timeToStart}
        />
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="py-2.5 px-5.5 bg-white rounded-2xl text-black hover:bg-secondary-100 transition-colors cursor-pointer"
        >
          <Maximize size={24} />
        </button>
        <button className="py-2.5 px-5.5 bg-white rounded-2xl text-black hover:bg-secondary-100 transition-colors cursor-pointer">
          <Clock3 size={24} />
        </button>
        <button
          onClick={handleToggleMusic}
          className="py-2.5 px-5.5 bg-white rounded-2xl text-black hover:bg-secondary-100 transition-colors cursor-pointer"
        >
          {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    </>
  );
}