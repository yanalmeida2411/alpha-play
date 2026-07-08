"use server";

import { parse, InferInput } from "valibot";
import { RegisterState } from "../types";
import { registerSchema } from "../lib/schemas/registerSchema";

type RegisterInput = InferInput<typeof registerSchema>;

export async function RegisterUser(
  prevStare: RegisterState<Partial<RegisterInput>>,
  FormData: FormData,
): Promise<RegisterState<Partial<RegisterInput>>> {
  const rawData = {
    name: FormData.get("name"),
    surname: FormData.get("surname"),
    email: FormData.get("email"),
    password: FormData.get("password"),
    confirmPassword: FormData.get("confirmPassword"),
    pinCode: FormData.get("pinCode"),
    termsAccepted: FormData.get("termsAccepted") !== null,
  } as Partial<RegisterInput>;

  try {
    const validData = parse(registerSchema, rawData);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/user/register",
      {
        method: "POST",
        body: JSON.stringify(validData),
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    let apiData;
    try {
      apiData = await response.json();
    } catch (err) {
      return {
        success: false,
        message: "Erro de comunicação com o servidor (Resposta inválida).",
        inputs: rawData,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: apiData.message,
        inputs: rawData,
        errors: apiData.errors,
      };
    }

    return {
      success: true,
      message: apiData.message,
      inputs: {},
    };
    //eslint-disable-next-line
  } catch (err: any) {
    console.error("ERRO CAPTURADO NO SERVER ACTION:", err);

    return {
      success: false,
      message: err.message,
      inputs: rawData,
    };
  }
}
