"use server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../types";
import { getToken } from "./profileAction";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function updateUser(formData: FormData): Promise<ActionResponse> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autenticado" };

  const payload = {
    pinCode: formData.get("pinCode") as string,
    newName: (formData.get("newName") as string) || undefined,
    newSurname: (formData.get("newSurname") as string) || undefined,
    newEmail: (formData.get("newEmail") as string) || undefined,
    newPin: (formData.get("newPin") as string) || undefined,
  };

  try {
    const res = await fetch(`${API_URL}/auth/update-user`, {
      method: "PATCH",
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
        error: errorData.message || "Erro ao atualizar dados",
      };
    }

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro de conexão" };
  }
}

export async function updatePassword(
  formData: FormData,
): Promise<ActionResponse> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autenticado" };

  const payload = {
    oldPassword: formData.get("oldPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  try {
    const res = await fetch(`${API_URL}/auth/update-password`, {
      method: "PATCH",
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
        error: errorData.message || "Erro ao atualizar senha",
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro de conexão" };
  }
}

export async function deleteAccount(pinCode: string): Promise<ActionResponse> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autenticado" };

  try {
    const res = await fetch(`${API_URL}/auth/delete-account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pinCode }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "PIN inválido ou erro ao excluir",
      };
    }

    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("pin_code");

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro de conexão" };
  }
}
