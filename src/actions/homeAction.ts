"use server";

import { ApiResponse, ChildProfile, InfoGames, PlayedTimeResponse } from "../types";
import { getChildren, getToken } from "./profileAction";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function isStreakShownToday(childId: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(`streak_shown_${childId}`);
}

export async function getLastStreakCount(childId: string): Promise<number> {
  const cookieStore = await cookies();
  const val = cookieStore.get(`last_streak_count_${childId}`)?.value;
  return val ? parseInt(val, 10) : 0;
}

export async function setStreakShown(
  childId: string,
  currentStreak: number,
): Promise<void> {
  const cookieStore = await cookies();
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  cookieStore.set(`streak_shown_${childId}`, "true", {
    expires: midnight,
    path: "/",
    httpOnly: true,
  });

  cookieStore.set(`last_streak_count_${childId}`, currentStreak.toString(), {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getInfosChild(id: string): Promise<ChildProfile | null> {
  const token = await getToken();
  if (!token) return null;

  const childList = await getChildren();
  const isChildOwned = childList.some((child) => child._id === id);

  if (!isChildOwned) return null;

  try {
    const res = await fetch(`${API_URL}/child/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json: ApiResponse<ChildProfile> = await res.json();

    return json.data;
  } catch (error) {
    console.error("Erro getUser:", error);
    return null;
  }
}

export async function getStreakChild(id: string): Promise<ChildProfile | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/child/${id}/streak`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json: ApiResponse<ChildProfile> = await res.json();

    return json.data;
  } catch (error) {
    console.error("Erro getStreakChild:", error);
    return null;
  }
}

export async function getInfosGames(): Promise<InfoGames[]> {
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/games/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json: ApiResponse<InfoGames[]> = await res.json();
    return json.data;
  } catch (error) {
    console.error("Erro getInfosGames:", error);
    return [];
  }
}

export async function getPlayedTime(): Promise<PlayedTimeResponse | null> {
  const token = await getToken();
  if (!token) return null;

  const cookieStore = await cookies();
  const pinCode = cookieStore.get("pin_code")?.value;
  if (!pinCode) return null;

  try {
    const res = await fetch(`${API_URL}/dashboard/played-time`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pinCode }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json: ApiResponse<PlayedTimeResponse> = await res.json();
    return json.data;
  } catch (error) {
    console.error("Erro getPlayedTime:", error);
    return null;
  }
}