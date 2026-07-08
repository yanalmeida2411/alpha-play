"use client";

import { useState } from "react";
import { ChildProfile, PlayedTimeResponse } from "@/src/types";

interface Props {
  initialChild: ChildProfile;
  allChildren: ChildProfile[];
  playedTime: PlayedTimeResponse | null;
}

export default function ProfileTable({ initialChild, allChildren, playedTime }: Props) {
  const [selectedChild, setSelectedChild] = useState<ChildProfile>(initialChild);
  const [showDropdown, setShowDropdown] = useState(false);

  const games = playedTime?.children
    .find((c) => c.name === selectedChild.name)
    ?.games ?? [];

  return (
    <div id="print-area" className="w-full bg-white border-[3px] border-[#C9DDF5] rounded-2xl p-4 mb-4">
      <h3 className="font-nunito font-bold text-[24px] text-center">Perfil e Dados dos jogos</h3>

      <div className="flex items-center gap-2 mb-2 relative">
        <img
          src={`/avatars/${selectedChild.avatar}.jpg`}
          alt={selectedChild.name}
          className="w-15 h-15 rounded-full"
        />

        <div
          className="flex items-center gap-1 font-semibold text-[24px] cursor-pointer"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          {selectedChild.name}
          <img src="/icons/seta.png" alt="Seta" className="w-4 h-4 mt-2 print:hidden" />
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#B9B9B9] rounded-lg shadow-md z-10 min-w-40 print:hidden">
            {allChildren.map((child) => (
              <button
                key={child._id}
                className="w-full text-left px-4 py-2 hover:bg-[#C9DDF5] text-[16px] flex items-center gap-2"
                onClick={() => {
                  setSelectedChild(child);
                  setShowDropdown(false);
                }}
              >
                <img
                  src={`/avatars/${child.avatar}.jpg`}
                  alt={child.name}
                  className="w-6 h-6 rounded-full"
                />
                {child.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full border border-[#B9B9B9] rounded-lg overflow-hidden">
        <table className="w-full text-[12px] font-inter border-collapse [&_td:nth-child(3)]:bg-[#0000000F]">
          <thead className="bg-[#0000000F]">
            <tr>
              <th className="w-42.25 px-3 py-2.5 text-left border-r border-[#B9B9B9]">Jogos</th>
              <th className="px-3 py-2.5 text-left border-r border-[#B9B9B9]">Acertos</th>
              <th className="px-3 py-2.5 text-left border-r border-[#B9B9B9]">Erros</th>
              <th className="px-3 py-2.5 text-left">Jogadas</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.name} className="border-t border-[#B9B9B9]">
                <td className="px-3 py-2.5 border-r border-[#B9B9B9] font-inter">{game.name}</td>
                <td className="px-3 border-r border-[#B9B9B9]">
                  {game.name === "Aprender letras e sons" ? "-" : game.successCount}
                </td>
                <td className="px-3 border-r border-[#B9B9B9]">
                  {game.name === "Aprender letras e sons" ? "-" : game.errorCount}
                </td>
                <td className="px-3">{game.plays}</td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}