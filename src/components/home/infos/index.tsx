import { ChildProfile } from "@/src/types";
import { Star } from "lucide-react";
import Image from "next/image";

export default async function InfosHome({
  childInfos,
  streakData,
}: {
  childInfos: ChildProfile;
  streakData: ChildProfile | null;
}) {
  const currentStreak =
    streakData?.streakDays || streakData?.consecutiveDays || 0;
  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  if (!childInfos) return null;

  const level = childInfos.level ?? 1;
  const progress = childInfos.progress ?? 0;
  const starsNeededForNextLevel = 100 + (level - 1) * 10;

  const currentLevelStars = Math.round(
    (progress / 100) * starsNeededForNextLevel,
  );

  return (
    <section className=" flex flex-row justify-center items-center gap-8 mb-9.25">
      <div className=" flex flex-col gap-2 text-center">
        <Image
          src={`/avatars/${childInfos.avatar}.jpg`}
          width={206}
          height={172}
          alt={`Avatar do ${childInfos.name}`}
          className="rounded-full"
          unoptimized
        />

        <h2 className="text-2xl font-bold text-black">{childInfos.name}</h2>
        <div className="relative w-full mt-4">
          <div className="w-full h-8 bg-white/30 rounded-full relative overflow-hidden border-2 border-white/40">
            <div
              className="h-full bg-linear-to-r from-yellow-200/50 to-yellow-500/50 transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            ></div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-yellow-900/80 tracking-tight">
                {currentLevelStars} / {starsNeededForNextLevel}
              </span>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-8 pointer-events-none">
            <div
              className="h-full rounded-full bg-linear-to-r from-start-yellow to-end-yellow transition-all duration-500 ease-out shadow-[0_0_10px_rgba(253,199,0,0.3)]"
              style={{
                width: `${Math.min((level / 999) * 100, 100)}%`,
              }}
            ></div>

            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
              style={{
                left: `${Math.min((level / 999) * 100, 100)}%`,
              }}
            >
              <div className="relative flex items-center justify-center pointer-events-auto">
                <Star
                  size={52}
                  className="fill-end-yellow text-yellow-600"
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(0,0,0,0.2))",
                  }}
                />
                <span className="absolute text-base font-bold text-black">
                  {level}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-1 pr-2">
            <div className="flex items-center gap-1 opacity-80">
              <Star
                size={18}
                className="fill-yellow-500 text-yellow-500"
                style={{
                  filter: "drop-shadow(0 0 1px white)",
                }}
              />
              <span className="text-sm font-bold text-black/70">
                {childInfos.totalStars ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/50 rounded-lg font-nunito px-6 py-11 flex flex-col justify-center">
        <h3 className="text-center font-bold text-[25px] text-black mb-4">
          Sequência Diária
        </h3>
        <p className="text-black text-2xl font-bold mb-5.5">
          Dias consecutivos: {currentStreak}
        </p>

        <div className="flex gap-10">
          {days.map((day) => {
            const isCompleted = day <= currentStreak;
            return (
              <div
                key={day}
                className={`w-25 h-25 flex flex-col items-center rounded-lg justify-center shadow-lg ${
                  isCompleted
                    ? "bg-linear-to-b from-start-yellow to-end-yellow"
                    : "bg-linear-to-b from-yellow-100 to-yellow-200 opacity-60"
                }`}
              >
                <span className="text-2xl text-yellow-900 mb-1">Dia {day}</span>
                <Star
                  size={50}
                  className={
                    isCompleted
                      ? "fill-yellow-100 text-yellow-100"
                      : "fill-transparent text-yellow-600"
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
