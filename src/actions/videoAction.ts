"use server";

import { cookies } from "next/headers";

export async function getVideosAction() {
  const token = (await cookies()).get("auth_token")?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return [];

  return response.json();
}