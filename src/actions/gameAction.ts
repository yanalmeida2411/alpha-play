"use server";

import { getToken } from "./profileAction";
import { ActionResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface GameResultPayload {
  childId: string;
  timeToStart: string;
  timeToFinish: string;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface GameSession {
  childId: string;
  gameId: string;
  timePlayed: number;
  correctAnswers: number;
  wrongAnswers: number;
  earnedStars: number;
  playedAt: string;
  _id: string;
  __v: number;
}

export async function saveGameResult(
  payload: GameResultPayload,
): Promise<ActionResponse<GameSession>> {
  const token = await getToken();

  if (!token) return { success: false, error: "Não autenticado" };

  try {
    const res = await fetch(`${API_URL}/games/alphabet-order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Erro API saveGameResult:", data);
      return {
        success: false,
        error: data.message || "Erro ao salvar resultado do jogo",
      };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Erro saveGameResult:", error);
    return { success: false, error: "Erro de conexão ao salvar resultado" };
  }
}
