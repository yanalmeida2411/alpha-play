"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, use } from "react";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { getVideosAction } from "@/src/actions/videoAction";

interface Video {
  title: string;
  description: string;
  url: string;
  slug: string;
}

function VideoPlayer({ childId }: { childId: string }) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getVideosAction()
      .then((videos: Video[]) => {
        const found = videos.find((v) => v.slug === slug);
        setVideo(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const videoId = video?.url.split("/").pop() ?? "";

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        Carregando...
      </div>
    );
  if (!video)
    return (
      <div className="flex-1 flex items-center justify-center">
        Vídeo não encontrado.
      </div>
    );

  return (
    <div className="flex-1 flex flex-col items-center p-8 gap-6 w-full">
      <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-6xl px-4 lg:px-8 xl:px-16">
        <div className="flex justify-end mb-4">
          <Link
            href={`/${childId}/dashboard`}
            className="flex gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full font-nunito font-semibold transition-colors shadow-sm cursor-pointer w-fit"
          >
            <CircleArrowLeft size={18} />
            <span className="leading-none">Voltar</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-[#181818] mb-4">{video.title}</h1>
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-lg"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        </div>

        {video.description && (
          <div className="mt-4 rounded-2xl p-4 bg-[#4F8EF780]">
            <h2 className="font-nunito font-normal text-2xl leading-5 text-center mb-3">
              Descrição do Vídeo
            </h2>
            <p className="font-nunito font-normal text-[15px] leading-5">
              {video.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideosPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);

  return (
    <div className="min-h-screen flex bg-[#D6EBFF]">
      <Sidebar childId={childId} />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            Carregando...
          </div>
        }
      >
        <VideoPlayer childId={childId} />
      </Suspense>
    </div>
  );
}