"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import {
  ActionResponse,
  ApiResponse,
  ChildProfile,
  CustomJwtPayload,
  UserProfile,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function formatDateToBackend(isoDate: string): string {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function verifyPin(pinCode: string): Promise<ActionResponse> {
  const token = await getToken();

  if (!token) return { success: false, error: "Não autenticado" };

  try {
    const res = await fetch(`${API_URL}/auth/verify-pin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pinCode }),
    });

    if (res.ok) return { success: true };

    try {
      const errorJson = await res.json();
      return { success: false, error: errorJson.message || "PIN incorreto" };
    } catch {
      return { success: false, error: "PIN incorreto" };
    }
  } catch (error) {
    console.error("Erro verifyPin:", error);
    return { success: false, error: "Erro ao validar PIN" };
  }
}

export async function verifyAndSavePin(
  pinCode: string,
): Promise<ActionResponse> {
  const result = await verifyPin(pinCode);

  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.set("pin_code", pinCode, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return result;
}

export async function clearPinAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("pin_code");
}

export async function getUser(): Promise<UserProfile | null> {
  const token = await getToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const userId = decoded.sub || decoded.id || decoded._id;

    if (!userId) {
      console.error("ID do usuário não encontrado no token");
      return null;
    }

    const res = await fetch(`${API_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { tags: ["user"] },
    });

    if (!res.ok) return null;

    const json: ApiResponse<UserProfile> = await res.json();
    return json.data;
  } catch (error) {
    console.error("Erro getUser:", error);
    return null;
  }
}

export async function getChildren(): Promise<ChildProfile[]> {
  const token = await getToken();

  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/child`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { tags: ["children"] },
    });

    if (!res.ok) {
      console.error(`Erro getChildren: ${res.status}`);
      return [];
    }

    const json: ApiResponse<ChildProfile[]> = await res.json();
    return json.data;
  } catch (error) {
    console.error("Erro getChildren:", error);
    return [];
  }
}

export async function createChild(formData: FormData): Promise<ActionResponse> {
  const token = await getToken();

  if (!token) return { success: false, error: "Não autenticado" };

  const rawName = (formData.get("name") as string) || "";
  const rawDate = (formData.get("birthDate") as string) || "";
  const rawAvatar = (formData.get("avatar") as string) || "avatar-01";

  const payload = {
    name: rawName,
    birthDate: formatDateToBackend(rawDate),
    avatar: rawAvatar,
  };

  try {
    const res = await fetch(`${API_URL}/child/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Erro API createChild:", errorData);
      return {
        success: false,
        error: errorData.message || "Erro ao criar perfil",
      };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Erro createChild:", error);
    return { success: false, error: "Erro de conexão ao criar" };
  }
}

export async function updateChild(
  id: string,
  formData: FormData,
): Promise<ActionResponse> {
  const token = await getToken();

  if (!token) return { success: false, error: "Não autenticado" };

  const rawName = (formData.get("name") as string) || "";
  const rawDate = (formData.get("birthDate") as string) || "";
  const rawAvatar = (formData.get("avatar") as string) || "";

  const payload = {
    name: rawName,
    birthDate: formatDateToBackend(rawDate),
    avatar: rawAvatar,
  };

  try {
    const res = await fetch(`${API_URL}/child/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Erro ao atualizar",
      };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Erro updateChild:", error);
    return { success: false, error: "Erro de conexão ao atualizar" };
  }
}

export async function deleteChild(id: string): Promise<ActionResponse> {
  const token = await getToken();

  if (!token) return { success: false, error: "Não autenticado" };

  try {
    const res = await fetch(`${API_URL}/child/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { success: false, error: "Falha ao deletar" };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Erro deleteChild:", error);
    return { success: false, error: "Erro de conexão ao deletar" };
  }
}
