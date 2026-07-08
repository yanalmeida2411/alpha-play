import { getInfosGames } from "@/src/actions/homeAction";
import { Play } from "lucide-react";
import Image from "next/image";
import ReadTextButton from "./ReadTextButton";
import Link from "next/link";

export default async function GamesHome({ id }: { id: string }) {
  const infoGames = await getInfosGames();
  return (
    <section className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-black font-dynapuff text-center mb-10 uppercase text-shadow-sm text-shadow-white/20">
        Mais que aprender: viver descobertas todos os dias
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoGames.map((infoGames) => (
          <div
            key={infoGames._id}
            className="bg-linear-to-b from-start-blue to-end-blue rounded-lg p-4 pr-13.75 flex gap-6 items-center relative"
          >
            <ReadTextButton text={infoGames.description} />

            <div className="rounded-xl shrink-0 w-46.25 h-37.5 overflow-hidden relative">
              <Image
                src={`/assets/${infoGames.slug}.png`}
                alt={infoGames.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex flex-col items-center text-center w-79 flex-1">
              <div>
                <h3 className="text-2xl font-bold text-secondary-500 mb-2 truncate">
                  {infoGames.name}
                </h3>

                <p className="text-base text-grey-800 wrap-break-words font-nunito">
                  {infoGames.description}
                </p>
              </div>

              <div className="mt-4">
                <Link href={`/${id}/${infoGames.slug}`}>
                  <button className="flex items-center gap-2 bg-[#11C011] hover:bg-[#11C011] text-white px-6 py-2 rounded-full font-bold transition-transform hover:scale-105 shadow-md w-fit">
                    <Play size={18} className="fill-white" />
                    Jogar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}