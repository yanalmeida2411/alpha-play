"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Volume2, VolumeX } from "lucide-react";
import QuitGameButton from "../../ui/QuitGameModal";

interface MemoryGameHeaderProps {
  childId: string;
  onExit: () => Promise<void>;
}

export function MemoryGameHeader({ childId, onExit }: MemoryGameHeaderProps) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Audio("/musics/musica03-jogo-da-memoria.mp3");
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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="flex justify-between items-center p-4">
      <QuitGameButton childId={childId} onSave={onExit} />

      <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl text-game-title">
        Jogo Da Memoria
      </h1>

      <div className="flex gap-4">
        <button
          onClick={handleFullscreen}
          className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Maximize size={24} className="text-black" />
        </button>
        <button
          onClick={handleToggleMusic}
          className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          {isMusicPlaying
            ? <Volume2 size={24} className="text-black" />
            : <VolumeX size={24} className="text-black" />
          }
        </button>
      </div>
    </header>
  );
}