"use client";

import { useRegisterForm } from "@/src/hooks/useRegisterForm";
import { LoginPops } from "@/src/types";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { SuccessModal } from "@/src/components/ui/SuccessModal";

const EyeIcon = ({ visible }: { visible: boolean }) => {
  const Icon = visible ? FiEye : FiEyeOff;
  return (
    <Icon
      size={22}
      style={{ color: "#759FFE" }}
      className={`transition-opacity ${visible ? "opacity-100" : "opacity-60"}`}
    />
  );
};

export default function Register({ isLogin, setIsLogin }: LoginPops) {
  const {
    formAction,
    isPending,
    getError,
    getValue,
    getChecked,
    handleChange,
    handleSubmit,
    state,
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
    showPin,
    togglePin,
    showSuccessModal,
    handleCloseModal,
  } = useRegisterForm(setIsLogin);

  if (isLogin) return null;

  return (
    <>
      <form
        action={formAction}
        onSubmit={handleSubmit}
        className="w-full relative"
      >
        {/* --- NOME --- */}
        <div className="flex flex-col mb-2">
          <label
            htmlFor="name"
            className="text-secondary-700 text-[20px] font-bold font-nunito"
          >
            Nome:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={50}
            autoComplete="given-name"
            placeholder="Nome do responsável"
            value={getValue("name")}
            onChange={handleChange}
            className={`mt-2 p-3 border-2 rounded-xl bg-secondary-100 focus:outline-none transition-colors ${
              getError("name")
                ? "border-[#f80303] bg-[#f80303]"
                : "border-secondary-400"
            }`}
          />
          {getError("name") && (
            <span className="text-[#f80303] border-[#f80303] c font-bold text-xs mt-1">
              {getError("name")}
            </span>
          )}
        </div>

        {/* --- SOBRENOME --- */}
        <div className="flex flex-col mb-2">
          <label
            htmlFor="surname"
            className="text-secondary-700 text-[20px] font-bold font-nunito"
          >
            Sobrenome:
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            maxLength={50}
            autoComplete="family-name"
            placeholder="Sobrenome do responsável"
            value={getValue("surname")}
            onChange={handleChange}
            className={`mt-2 p-3 border-2 rounded-xl bg-secondary-100 text-black focus:outline-none transition-colors ${
              getError("surname")
                ? "border-[#f80303] bg-[#f80303]"
                : "border-secondary-400"
            }`}
          />
          {getError("surname") && (
            <span className="text-[#f80303] border-[#f80303] c font-bold text-xs mt-1">
              {getError("surname")}
            </span>
          )}
        </div>

        {/* --- EMAIL --- */}
        <div className="flex flex-col mb-2">
          <label
            htmlFor="email"
            className="text-secondary-700 text-[20px] font-bold font-nunito"
          >
            Insira seu melhor e-mail:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={50}
            autoComplete="email"
            placeholder="responsavel@gmail.com"
            value={getValue("email")}
            onChange={handleChange}
            className={`mt-2 p-3 border-2 rounded-xl bg-secondary-100 text-black focus:outline-none transition-colors ${
              getError("email")
                ? "border-[#f80303] bg-[#f80303]"
                : "border-secondary-400"
            }`}
          />
          {getError("email") && (
            <span className="text-[#f80303] border-[#f80303] c font-bold text-xs mt-1">
              {getError("email")}
            </span>
          )}
        </div>

        {/* --- SENHA --- */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="password"
            className="text-secondary-700 text-[20px] font-bold font-nunito"
          >
            Crie uma senha:
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              maxLength={20}
              autoComplete="new-password"
              placeholder="********"
              value={getValue("password")}
              onChange={handleChange}
              className={`p-3 w-full border-2 rounded-xl bg-secondary-100 text-black focus:outline-none transition-colors ${
                getError("password")
                  ? "border-[#f80303] bg-[#f80303]"
                  : "border-secondary-400"
              }`}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-3 cursor-pointer hover:opacity-80"
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>

          {getError("password") && (
            <span className="text-[#f80303] border-[#f80303] c font-bold text-xs mt-1">
              {getError("password")}
            </span>
          )}
          <p className="font-bold text-[14px] mt-2 text-[#01193C]">
            A senha deve ter no mínimo 6 caracteres, maiúscula, minúscula,
            número e especial.
          </p>
        </div>

        {/* --- CONFIRMAR SENHA --- */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="confirmPassword"
            className="text-secondary-700 text-[20px] font-bold font-nunito"
          >
            Confirme sua senha:
          </label>
          <div className="relative mt-2">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              maxLength={20}
              autoComplete="new-password"
              placeholder="********"
              value={getValue("confirmPassword")}
              onChange={handleChange}
              className={`p-3 w-full border-2 rounded-xl bg-secondary-100 text-black focus:outline-none transition-colors ${
                getError("confirmPassword")
                  ? "border-[#f80303] bg-[#f80303]"
                  : "border-secondary-400"
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute right-3 top-3 cursor-pointer hover:opacity-80"
            >
              <EyeIcon visible={showConfirmPassword} />
            </button>
          </div>

          {getError("confirmPassword") && (
            <span className="text-[#f80303] border-[#f80303] c font-bold text-xs mt-1">
              {getError("confirmPassword")}
            </span>
          )}
        </div>

        {/* --- PIN CODE --- */}
        <div className="flex flex-col mb-2">
          <label
            htmlFor="pinCode"
            className="text-secondary-700 text-[20px] font-bold font-nunito"
          >
            Cadastre um PIN de 4 dígitos:
          </label>
          <div className="relative mt-2">
            <input
              id="pinCode"
              name="pinCode"
              type={showPin ? "text" : "password"}
              maxLength={4}
              autoComplete="new-password"
              placeholder="0000"
              value={getValue("pinCode")}
              onChange={handleChange}
              className={`p-3 w-full border-2 rounded-xl bg-secondary-100 text-black focus:outline-none transition-colors ${
                getError("pinCode")
                  ? "border-[#f80303] bg-[#f80303]"
                  : "border-secondary-400"
              }`}
            />
            <button
              type="button"
              onClick={togglePin}
              className="absolute right-3 top-3 cursor-pointer hover:opacity-80 "
            >
              <EyeIcon visible={showPin} />
            </button>
            <p className="font-bold text-[14px] mt-2 text-[#01193C] mb-1">
              Este PIN de segurança servirá para controle parental na
              plataforma.
            </p>
          </div>

          {getError("pinCode") && (
            <span className="text-[#f80303] border-[#f80303] font-bold text-xs mb-3">
              {getError("pinCode")}
            </span>
          )}
        </div>

        {/* --- TERMOS --- */}
        <div className="flex items-start mt-2">
          <input
            id="termsAccepted"
            name="termsAccepted"
            key={`terms-${getChecked("termsAccepted")}`}
            type="checkbox"
            checked={getChecked("termsAccepted")}
            onChange={handleChange}
            value="on"
            className="w-5 h-5 text-secondary-400 border-secondary-400 rounded-xl bg-secondary-100 focus:ring-2 focus:ring-[#4C6E91] mt-1"
          />

          <div className="ml-2 flex flex-col">
            <label
              htmlFor="termsAccepted"
              className="text-[14px] text-secondary-700 leading-snug"
            >
              Li e aceito os{" "}
              <a
                href="/pdfs/termos-de-uso.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-secondary-500 font-black"
                onClick={(e) => e.stopPropagation()}
              >
                termos e condições
              </a>{" "}
              e também as{" "}
              <a
                href="/pdfs/politica-de-privacidade.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-secondary-500 font-black"
                onClick={(e) => e.stopPropagation()}
              >
                políticas de privacidade
              </a>{" "}
              do serviço.
            </label>

            {getError("termsAccepted") && (
              <span className="text-[#f80303] c font-bold text-xs mt-1">
                {getError("termsAccepted")}
              </span>
            )}
          </div>
        </div>

        {/* --- BOTÃO --- */}
        <div className="flex justify-center mt-3">
          <button
            type="submit"
            disabled={isPending}
            className={`w-28 h-10 text-white text-[20px] rounded-lg font-nunito transition-all ${
              isPending
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-secondary-400 hover:bg-[#1f6fe3] cursor-pointer"
            }`}
          >
            {isPending ? "Cadastrar" : "Cadastrar"}
          </button>
        </div>

        {/* MENSAGEM DO SERVIDOR */}
        {state.message && !state.success && (
          <div className="my-4 p-3 rounded text-center text-sm font-bold text-tertiary-300">
            {state.message}
          </div>
        )}

        <div className="mt-3 text-center text-sm">
          <p className="text-secondary-700 text-[16px]">
            Já possui uma conta?
            <span
              onClick={() => setIsLogin(true)}
              className="text-secondary-700 hover:underline font-bold cursor-pointer ml-1"
            >
              Fazer login
            </span>
          </p>
        </div>
      </form>

      {/* --- MODAL DE SUCESSO --- */}
      <SuccessModal
        isOpen={showSuccessModal}
        message={state.message || "Cadastro realizado com sucesso!"}
        onClose={handleCloseModal}
      />
    </>
  );
}
