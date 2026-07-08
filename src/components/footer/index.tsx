import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full relative">
      <div
        className="bg-[#759FFE] relative w-full mx-auto px-6 py-4 pb-4 flex items-center justify-between"
        style={{
          boxShadow: 'inset 0 -8px 16px 0 rgba(90, 120, 118, 0.7)', 
        }}
      >
        <div className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="logo"
            width={152}
            height={60}
            className="w-38 h-auto"
            draggable="false"
          />
        </div>

        <nav className="flex gap-6">
          <a
            href="pdfs/politica-de-privacidade.pdf"
            target="_blank"
            className="font-nunito text-[16px] leading-5.5 tracking-[0.005em] text-[#1F1C1B] underline"
          >
            Políticas de Privacidade
          </a>
          <a
            href="pdfs/termos-de-uso.pdf"
            target="_blank"
            className="font-nunito text-[16px] leading-5.5 tracking-[0.005em] text-[#1F1C1B] underline"
          >
            Termos e Condições
          </a>
        </nav>
      </div>
    </footer>
  );
}