"use client";

import {
  ChangeEvent,
  FormEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { RegisterUser } from "../actions/registerActions";
import { RegisterState } from "../types";
import { flatten, safeParse, InferInput } from "valibot";
import { registerSchema } from "../lib/schemas/registerSchema";

export type RegisterInput = InferInput<typeof registerSchema>;

const initialState: RegisterState<Partial<RegisterInput>> = {
  success: false,
  errors: {},
  inputs: {},
};

export function useRegisterForm(setIsLogin?: (value: boolean) => void) {
  const [state, formAction, isPending] = useActionState(
    RegisterUser,
    initialState,
  );

  // --- CONTROLE DE ESTADO ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Rastreia se o sucesso é "novo" para não abrir modal ao voltar na página
  const prevSuccess = useRef(state.success);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const [formValues, setFormValues] = useState<Partial<RegisterInput>>({});

  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof RegisterInput, string[]>>
  >({});

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );

  // --- EFFECT DE SUCESSO ---
  useEffect(() => {
    // Só ativa se for sucesso E se antes não era
    if (state.success && !prevSuccess.current) {
      // 1. INÍCIO IMEDIATO (Async): Abre Modal e Limpa Campos
      // O setTimeout(0) joga a atualização para o próximo ciclo, evitando o erro de Cascading Render
      const startSequenceTimer = setTimeout(() => {
        setShowSuccessModal(true); // <--- AGORA ESTÁ SEGURO AQUI DENTRO
        setFormValues({});
        setTouchedFields({});
        setClientErrors({});
      }, 0);

      // 2. ENCERRAMENTO (4s): Fecha Modal e Redireciona
      const redirectTimer = setTimeout(() => {
        setShowSuccessModal(false);
        if (setIsLogin) {
          setIsLogin(true);
        }
      }, 4000);

      // Limpeza de timers caso o componente desmonte
      return () => {
        clearTimeout(startSequenceTimer);
        clearTimeout(redirectTimer);
      };
    }

    // Atualiza a referência
    prevSuccess.current = state.success;
  }, [state.success, setIsLogin]);

  // Função para fechar manualmente
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (setIsLogin) setIsLogin(true);
  };

  // --- HANDLERS ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof RegisterInput;
    const { value, type, checked } = e.target;
    const valorReal = type === "checkbox" ? checked : value;

    setFormValues((prev) => ({ ...prev, [name]: valorReal }));
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const novo = { ...prev };
        delete novo[name];
        return novo;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    const dataToValidate = {
      name: formData.get("name")?.toString() || "",
      surname: formData.get("surname")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      confirmPassword: formData.get("confirmPassword")?.toString() || "",
      pinCode: formData.get("pinCode")?.toString() || "",
      termsAccepted: formData.get("termsAccepted") !== null,
    };

    const resultado = safeParse(registerSchema, dataToValidate);

    if (!resultado.success) {
      e.preventDefault();
      const issues = flatten(resultado.issues).nested;
      setClientErrors(issues as Partial<Record<keyof RegisterInput, string[]>>);
    }
  };

  const getValue = (field: keyof RegisterInput): string => {
    const val = formValues[field] ?? state.inputs?.[field];
    return val !== null && val !== undefined && typeof val !== "boolean"
      ? String(val)
      : "";
  };

  const getChecked = (field: keyof RegisterInput): boolean => {
    const val = formValues[field] ?? state.inputs?.[field];
    return Boolean(val);
  };

  const getError = (field: keyof RegisterInput) => {
    const isDirty = touchedFields[field as string];
    if (clientErrors[field]) return clientErrors[field]![0];
    if (!isDirty && state.errors?.[field]) return state.errors[field]![0];
    return undefined;
  };

  const togglePassword = () => setShowPassword((p) => !p);
  const toggleConfirmPassword = () => setShowConfirmPassword((p) => !p);
  const togglePin = () => setShowPin((p) => !p);

  return {
    state,
    formAction,
    isPending,
    handleChange,
    handleSubmit,
    getValue,
    getChecked,
    getError,
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
    showPin,
    togglePin,
    showSuccessModal,
    handleCloseModal,
  };
}
