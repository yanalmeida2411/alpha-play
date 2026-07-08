"use client";

import { useState, useRef } from "react";
import { LuLock } from "react-icons/lu";
import Modal from "@/src/components/ui/modalPin";
import { verifyAndSavePin } from "@/src/actions/profileAction";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onConfirm?: (pin: string) => Promise<void>;
}

export default function PinModal({
  isOpen,
  onClose,
  onSuccess,
  onConfirm,
}: PinModalProps) {
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newPin = [...pinDigits];
    newPin[index] = value.slice(-1);
    setPinDigits(newPin);
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const submitPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pinDigits.join("");
    if (fullPin.length < 4) {
      setError("Digite os 4 dígitos.");
      return;
    }
    setLoading(true);
    setError("");

    if (onConfirm) {
      try {
        await onConfirm(fullPin);
        setPinDigits(["", "", "", ""]);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "PIN Inválido";
        setError(errorMessage);
        setPinDigits(["", "", "", ""]);
        pinRefs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = await verifyAndSavePin(fullPin);

    if (result.success) {
      onSuccess();
      setPinDigits(["", "", "", ""]);
    } else {
      setError(result.error || "PIN Inválido");
      setPinDigits(["", "", "", ""]);
      pinRefs.current[0]?.focus();
    }
    setLoading(false);
  };

  return (
    <Modal hideCloseButton={true} isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center px-11">
        <div className="mt-2.5 mb-5 text-black">
          <LuLock size={24} strokeWidth={2} />
        </div>

        <h2 className="font-dynapuff text-3xl font-black mb-2.5 text-black text-center tracking-tight">
          Verificação de PIN
        </h2>
        <p className="text-gray-500 font-medium mb-8.5 text-center">
          Digite seu PIN de 4 dígitos
        </p>

        <form
          onSubmit={submitPin}
          className="w-full flex flex-col items-center gap-8.5"
        >
          <div className="flex gap-7.5 justify-center">
            {pinDigits.map((digit, index) => (
              <input
                key={index}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                ref={(el) => {
                  pinRefs.current[index] = el;
                }}
                className="w-12 h-12 bg-gray-200 rounded-[10px] text-center text-3xl font-bold text-black"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || pinDigits.join("").length < 4}
            className=" bg-[#0066FF] hover:bg-blue-600 text-white text-lg font-bold py-2 px-17 rounded-lg"
          >
            Confirmar
          </button>
          {error && (
            <p className="text-tertiary-300 text-sm font-bold text-center -mt-1.75 w-full">
              {error}
            </p>
          )}
        </form>
      </div>
    </Modal>
  );
}
