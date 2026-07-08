"use client";

import { Construction } from "lucide-react";

function LettersDetective({ childId }: { childId: string }) {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center gap-4">
      <div className="flex gap-3 items-center">
        <Construction size={64} className="text-blue-500" />
        <h1 className="text-black text-2xl font-semibold">Olá, aguarde as próximas atualizações!</h1>
      </div>
      <h2>O jogo Detetive das Letras está em desenvolvimento.</h2>
    </main>
  );
}

export default LettersDetective;