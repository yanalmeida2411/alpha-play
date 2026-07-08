import {
  getInfosChild,
  getStreakChild,
  isStreakShownToday,
  getLastStreakCount,
} from "@/src/actions/homeAction";
import { clearPinAction } from "@/src/actions/profileAction";
import GamesHome from "@/src/components/home/games";
import HeaderHome from "@/src/components/home/header";
import InfosHome from "@/src/components/home/infos";
import StreakModal from "@/src/components/home/streak-modal";
import { notFound } from "next/navigation";

export default async function EducativeGameDashboard({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const childInfos = await getInfosChild(childId);
  const streakData = await getStreakChild(childId);
  const wasShown = await isStreakShownToday(childId);
  const lastStreakCount = await getLastStreakCount(childId);

  if (!childInfos) {
    notFound();
  }
  return (
    <main className="min-h-screen w-full relative bg-sky-200 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-top bg-[url(/assets/fundo.png)]" />
      <div className="relative z-10 w-full h-full p-4  flex flex-col">
        <HeaderHome />
        <InfosHome childInfos={childInfos} streakData={streakData} />
        <GamesHome id={childId} />
      </div>
      {streakData && !wasShown && (
        <StreakModal child={streakData} lastStreakCount={lastStreakCount} />
      )}
    </main>
  );
}