"use client";

export default function PrintButton() {
  const handlePrint = () => window.print();

  return (
    <button
      onClick={handlePrint}
      className="flex self-end items-center w-44 h-12 gap-2 mb-4 bg-[#4C8BF5] text-white rounded-2xl p-3 cursor-pointer hover:bg-[#3a73d9] transition"
    >
      <img src="/icons/printer.png" alt="Ícone de impressora" className="w-4 h-4" />
      Imprimir relatório
    </button>
  );
}