"use server";

import { getToken } from "./profileAction";
import { ActionResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface LetrasESonsPayload {
  childId: string;
  timeToStart: string;
  timeToFinish: string;
  totalClicks: number;
}

export interface LetrasESonsSession {
  earnedStars: number;
  totalClicks: number;
}

export async function saveLettersAndSoundsResult(
  payload: LetrasESonsPayload,
): Promise<ActionResponse<LetrasESonsSession>> {
  const token = await getToken();

  if (!token) return { success: false, error: "Não autenticado" };

  try {
    const res = await fetch(`${API_URL}/games/letters-and-sounds`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Erro API letras e sons:", data);
      return {
        success: false,
        error: data.message || "Erro ao salvar resultado do jogo",
      };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Erro letras e sons:", error);
    return { success: false, error: "Erro de conexão ao salvar resultado" };
  }
}