import { notFound } from "next/navigation";
import LettersAndSounds from "@/src/components/games/LettersAndSounds";
import AlphabetOrder from "@/src/components/games/AlphabetOrder";
import MemoryGame from "@/src/components/games/MemoryGame";
import LettersDetective from "@/src/components/games/LetterDetective";

const MAP_GAMES: Record<string, React.ElementType> = {
  "letters-and-sounds": LettersAndSounds,
  "alphabet-order": AlphabetOrder,
  "memory-game": MemoryGame,
  "letter-detective": LettersDetective,
};

export default async function GamePage({
  params,
}: {
  params: Promise<{ childId: string; slug: string }>;
}) {
  const { childId, slug } = await params;

  const SelectedGame = MAP_GAMES[slug];

  if (!SelectedGame) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-sky-200">
      <div className="flex-1 flex items-center justify-center">
        <SelectedGame childId={childId} />
      </div>
    </main>
  );
}
