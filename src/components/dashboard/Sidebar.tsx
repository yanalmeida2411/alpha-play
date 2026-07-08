"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVideosAction } from "@/src/actions/videoAction";
import { clearPinAction } from "@/src/actions/profileAction";
import { FiLogOut } from "react-icons/fi";

interface SidebarProps {
  childId: string;
}

interface Video {
  title: string;
  description: string;
  slug: string;
}

export default function Sidebar({ childId }: SidebarProps) {
  const [videosOpen, setVideosOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    getVideosAction()
      .then((data: Video[]) => setVideos(data))
      .catch(() => setVideos([]));
  }, []);

  const videoDescriptions = [
    "Aprenda as vogais de forma divertida",
    "Ouça e repita os sons das vogais",
    "O alfabeto com imagens coloridas",
  ];

  return (
    <>
      <aside className="w-55 m-3 p-4 flex flex-col gap-6 bg-[#D6EBFF]">
        <Link href={`/${childId}`}>
          <img
            src="/assets/logo.png"
            alt="AlphaPlay"
            className="w-40 mb-4 cursor-pointer"
          />
        </Link>
        <nav className="flex flex-col gap-3 text-sm">
          <h1 className="text-[10px] text-[#757575] font-inter cursor-pointer">
            MENU
          </h1>
          <Link
            href={`/${childId}/dashboard`}
            className="flex items-center whitespace-nowrap gap-2 text-[14px] text-[#757575] font-inter cursor-pointer p-2 rounded"
          >
            <img
              src="/icons/home.png"
              alt="Ícone de home"
              className="w-4 h-4"
            />
            Área do Responsável
          </Link>

          <div className="flex flex-col">
            <button
              onClick={() => setVideosOpen(!videosOpen)}
              className="flex items-center whitespace-nowrap gap-2 text-[14px] text-[#757575] font-inter cursor-pointer p-2 rounded"
            >
              <img
                src="/icons/video.png"
                alt="Ícone de vídeo"
                className="w-4 h-4"
              />
              Vídeos Educativos
              <img
                src="/icons/seta2.png"
                alt="Seta"
                className={`w-4 h-4 cursor-pointer transition-transform duration-200 ${videosOpen ? "rotate-90" : ""}`}
              />
            </button>

            {videosOpen && (
              <div className="flex flex-col ml-6 gap-1">
                {videos.map((video, index) => (
                  <button
                    key={video.slug}
                    onClick={() =>
                      router.push(`/${childId}/videos?slug=${video.slug}`)
                    }
                    className="flex flex-col text-left p-2 rounded hover:bg-[#C0DCFA] transition-colors"
                  >
                    <span className="text-[13px] font-semibold text-[#4A90D9]">
                      {video.title}
                    </span>
                    <span className="text-[11px] text-[#757575]">
                      {videoDescriptions[index] ?? "Assista e aprenda!"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href={`/${childId}/settings`} className="flex items-center gap-2 text-[14px] text-[#757575] font-inter cursor-pointer p-2 rounded">
            <img src="/icons/settings.png" alt="Ícone de configurações" className="w-4 h-4" />
            Configurações
          </Link>
        </nav>
      </aside>
      <div className="w-px h-222 bg-[#d3d3d3] rounded-full"></div>
    </>
  );
}
