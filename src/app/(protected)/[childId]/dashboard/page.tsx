import { getInfosChild, getPlayedTime } from "@/src/actions/homeAction";
import { getChildren, getUser } from "@/src/actions/profileAction";
import PlayedTimeChart from "@/src/components/dashboard/PlayedTimeChart";
import PrintButton from "@/src/components/dashboard/PrintButton";
import ProfileTable from "@/src/components/dashboard/ProfileTable";
import { Star } from "lucide-react";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const cookieStore = await cookies();
  const hasPin = cookieStore.has("pin_code");

  if (!hasPin) {
    redirect(`/${childId}`);
  }

  const childInfos = await getInfosChild(childId);

  if (!childInfos) return null;

  const allChildren = await getChildren();

  const playedTime = await getPlayedTime();
  console.log("playedTime:", JSON.stringify(playedTime, null, 2));

  const userInfo = await getUser();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#D6EBFF" }}>
      <Sidebar childId={childId} />

      <main className="flex-1 p-6">
        <div>
          <h1 className="text-[32px]">Área do Responsável</h1>
          <h2 className="text-[15px] text-[#111827] mb-4">
            Bem-vindo(a), Sr(a). {userInfo?.name}
          </h2>
        </div>

        <ProfileTable
          initialChild={childInfos}
          allChildren={allChildren}
          playedTime={playedTime}
        />

        <div
          id="print-area"
          className="w-full bg-white border-[3px] border-[#C9DDF5] rounded-2xl p-4 mt-4"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-[20px] font-inter">
                Tempo por Jogo
              </h3>
              <p className="text-[12px] text-[#757575]">
                Tempo em minutos gasto por perfil em cada jogo
              </p>
            </div>
            <div className="flex items-center gap-4 p-4">
              {playedTime?.children.map((child, index) => {
                const cores = ["#4B9A94", "#F08401", "#F3BF22", "#4E9422"];
                return (
                  <div key={child.name} className="flex items-center gap-1">
                    <div
                      style={{
                        backgroundColor: cores[index],
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-[15px] font-inter">{child.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <PlayedTimeChart>{playedTime?.children ?? []}</PlayedTimeChart>
        </div>
      </main>

      <aside className="p-6 flex flex-col">
        <div className="flex gap-3 print:hidden">
          <Link
            href={`/${childId}`}
            className="flex items-center justify-center w-30 h-12 gap-2 mb-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-2xl p-3 transition-colors"
          >
            <img
              src="/icons/home.png"
              alt="Home"
              className="w-4 h-4 brightness-0 invert"
            />
            Home
          </Link>
          <PrintButton />
        </div>

        <div
          id="print-area"
          className="w-79.25 min-h-92.5 mb-4 border-[3px] border-[#C9DDF5] bg-[#F5F8FC] rounded-2xl p-4 flex flex-col gap-4"
        >
          <h2 className="font-bold text-[32px] text-[#343C6A] font-inter">
            Ranking Geral
          </h2>
          {allChildren
            .sort((a, b) => (b.totalStars ?? 0) - (a.totalStars ?? 0))
            .map((child) => (
              <div key={child._id} className="flex items-center gap-3">
                <img
                  src={`/avatars/${child.avatar}.jpg`}
                  alt={child.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-[22px] font-inter">
                    {child.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                      style={{ filter: "drop-shadow(0 0 3px #fbbf24)" }}
                    />
                    <p className="font-bold text-[22px] font-inter">
                      {child.totalStars ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div
          id="print-area"
          className="w-79.25 min-h-92.5 border-[3px] border-[#C9DDF5] bg-[#FFFDF8] rounded-2xl p-4 flex flex-col gap-4"
        >
          <h2 className="font-bold text-[32px] text-center text-[#343C6A] font-inter">
            Mais Jogados
          </h2>
          {playedTime?.rankingGlobalGames.map((jogo, index) => {
            const fotos: Record<string, string> = {
              "Aprender letras e sons": "/assets/letters-and-sounds.png",
              "Ordene as letras do alfabeto": "/assets/alphabet-order.png",
              "Jogo da Memória": "/assets/memory-game.png",
            };
            const trofeus = [
              "/icons/ouro.png",
              "/icons/prata.png",
              "/icons/bronze.png",
            ];
            return (
              <div key={jogo.name} className="flex items-center gap-3">
                <img
                  src={fotos[jogo.name] ?? "/assets/memory-game.png"}
                  alt={jogo.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-[20px] font-inter">
                    {jogo.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-[22px] font-inter">
                      {index + 1}°
                    </p>
                    <img
                      src={trofeus[index]}
                      alt="troféu"
                      className="w-6 h-6"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
