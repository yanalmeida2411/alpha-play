"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const cores = ["#4B9A94", "#F08401", "#F3BF22", "#4E9422"];

interface GamePlayed {
  name: string;
  timePlayed: number;
}

interface ChildPlayedTime {
  name: string;
  games: GamePlayed[];
}

interface Props {
  children: ChildPlayedTime[];
}

export default function PlayedTimeChart({ children }: Props) {
  const chartData = children[0]?.games.map((game) => {
    const entry: Record<string, string | number> = { jogo: game.name };
    children.forEach((child) => {
      const g = child.games.find((g) => g.name === game.name);
      entry[child.name] = g?.timePlayed ?? 0;
    });
    return entry;
  }) ?? [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="jogo" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} width={15} />
        <Tooltip />
        {children.map((child, index) => (
          <Bar key={child.name} dataKey={child.name} fill={cores[index]} radius={[6, 6, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}