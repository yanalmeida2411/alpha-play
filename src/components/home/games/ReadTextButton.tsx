"use client";

import { Volume2 } from "lucide-react";

export default function ReadTextButton({ text }: { text: string }) {
  const handleLerTexto = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(text);
      const vozes = window.speechSynthesis.getVoices();

      const vozPremium =
        vozes.find(
          (voz) =>
            voz.lang.includes("pt-BR") &&
            (voz.name.includes("Google") || voz.name.includes("Microsoft")),
        ) || vozes.find((voz) => voz.lang.includes("pt-BR"));

      if (vozPremium) {
        fala.voice = vozPremium;
      }
      fala.lang = "pt-BR";
      fala.rate = 0.95;
      fala.pitch = 1;

      window.speechSynthesis.speak(fala);
    } else {
      console.log("Seu navegador não suporta leitura de texto.");
    }
  };

  return (
    <button
      onClick={handleLerTexto}
      className="absolute top-4 right-4 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
      title="Ouvir instrução"
    >
      <Volume2 size={24} />
    </button>
  );
}
