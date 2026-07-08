"use client";
import Link from "next/link";
import Footer from "../components/footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
  const sections = document.querySelectorAll(".fade-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible"); 
        }
      });
    },
    { threshold: 0.05 }
  );
  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[url('/assets/fundo-landing.png')] bg-cover bg-center min-h-screen">
      <style>{`
        .fade-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&family=Fredoka+One&family=Nunito:ital,wght@0,400;0,700&family=DynaPuff:wght@700&family=Urbanist:wght@700&display=swap');`}</style>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&family=Fredoka+One&family=Nunito:ital,wght@0,400;0,700&family=DynaPuff:wght@700&family=Urbanist:wght@700&family=Quicksand:wght@600&display=swap');`}</style>

      <nav className="sticky top-0 z-50 flex items-center justify-between bg-[#A8DAFD] px-20 shadow-sm h-20 mb-5">
        <img src="/assets/logo.png" alt="AlphaPlay" className="h-14" />
        <ul className="hidden md:flex gap-10 list-none text-[20px] text-[#262626]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          <li><a href="#home" className="no-underline text-inherit transition-colors duration-200 hover:text-[#0C78F4]">Home</a></li>
          <li><a href="#como-funciona" className="no-underline text-inherit transition-colors duration-200 hover:text-[#0C78F4]">Como Funciona</a></li>
          <li><a href="#beneficios" className="no-underline text-inherit transition-colors duration-200 hover:text-[#0C78F4]">Benefícios</a></li>
          <li><a href="#jogos" className="no-underline text-inherit transition-colors duration-200 hover:text-[#0C78F4]">Jogos</a></li>
        </ul>

        <Link href="/login" className="flex items-center justify-center text-white no-underline hover:opacity-90 transition-opacity font-semibold text-[20px] w-42.5 h-14.75 rounded-2xl bg-[#0C78F4]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          Acessar
        </Link>
      </nav>

      <section id="home" className="flex items-center justify-center gap-20 px-20 py-16 min-h-[500px]">
        <div className="max-w-[500px]">
          <h1 className="mb-5 font-normal text-[39px] leading-[130%] text-[#39A5FF]" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Aprender nunca foi tão divertido!
          </h1>

          <p className="mb-9 font-bold text-[24px] leading-[130%] text-black text-justify" style={{ fontFamily: "'Nunito', sans-serif" }}>
            O Alphaplay transforma a alfabetização em uma experiência interativa, segura e acompanhada pelos pais, ajudando crianças de 4 a 8 anos a desenvolverem leitura com confiança.
          </p>

          <Link href="/login" className="flex items-center justify-center text-black no-underline hover:opacity-90 transition-opacity font-bold text-[16px] w-52 h-14.5 rounded-2xl px-10 bg-[#FFC174]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Comece Agora
          </Link>
        </div>

        <div className="max-w-[520px]">
          <img src="assets/hero-img.png" alt="Crianças aprendendo com AlphaPlay" className="w-full rounded-2xl object-cover" />
        </div>
      </section>

      <section id="beneficios" className="px-20 py-20 fade-section">
        <h2
          className="text-center mb-14 font-bold text-[64px] leading-[100%] text-[#0C78F4]"
          style={{ fontFamily: "'DynaPuff', cursive", textShadow: "-4px 0 #ECF0FF, 4px 0 #ECF0FF, 0 -4px #ECF0FF, 0 4px #ECF0FF" }}
        >
          Benefícios
        </h2>

        <div className="flex items-center justify-center gap-12">
          <div className="max-w-[340px]">
            <img src="assets/beneficios-img.png" alt="Benefícios do AlphaPlay" className="w-full rounded-2xl object-cover" />
          </div>

          <div className="flex flex-col gap-5 font-bold text-[20px] text-[#222] leading-[1.4]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 rounded-full w-7 h-7">
                <img src="assets/circle-check.png" alt="Check" />
              </div>
              <span>Desenvolver o interesse pela leitura de forma leve, divertida e natural.</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 rounded-full w-7 h-7">
                <img src="assets/circle-check.png" alt="Check" />
              </div>
              <span>Ajudar crianças com dificuldades na alfabetização.</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 rounded-full w-7 h-7">
                <img src="assets/circle-check.png" alt="Check" />
              </div>
              <span>Uso familiar e intuitivo, facilitando a navegação de crianças e responsáveis.</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 rounded-full w-7 h-7">
                <img src="assets/circle-check.png" alt="Check" />
              </div>
              <span>Ambiente digital seguro, pensado para crianças e responsáveis.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-20 py-20 fade-section">
        <h2
          className="text-center mb-8 font-bold text-[64px] leading-[100%] text-[#0C78F4]"
          style={{ fontFamily: "'DynaPuff', cursive", textShadow: "-4px 0 #ECF0FF, 4px 0 #ECF0FF, 0 -4px #ECF0FF, 0 4px #ECF0FF" }}
        >
          Como funciona
        </h2>

        <p className="text-center font-bold text-[32px] leading-[120%] text-black mt-4 mb-5" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Pra quem é o AlphaPlay
        </p>

        <div className="flex justify-center gap-9 px-20 py-3">
          <div className="flex flex-col items-center text-center w-102.25 h-65 rounded-2xl py-9 px-6 gap-3 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer" style={{ backgroundColor: "#A8DAFD" }}>
            <img src="assets/peca.png" alt="Aprende Brincando" className="h-16" />
            <h3 className="font-bold text-[20px] leading-[120%]" style={{ fontFamily: "'Urbanist', sans-serif" }}>Aprende Brincando</h3>
            <p className="font-normal text-[18px] leading-[150%]" style={{ fontFamily: "'Nunito', sans-serif" }}>Jogos educativos que estimulam letras, sons e leitura.</p>
          </div>

          <div className="flex flex-col items-center text-center w-102.25 h-65 rounded-2xl py-9 px-6 gap-3 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer" style={{ backgroundColor: "#A5E3D1" }}>
            <img src="assets/evolucao.png" alt="Evolução Progressiva" className="h-16" />
            <h3 className="font-bold text-[20px] leading-[120%]" style={{ fontFamily: "'Urbanist', sans-serif" }}>Evolução Progressiva</h3>
            <p className="font-normal text-[18px] leading-[150%]" style={{ fontFamily: "'Nunito', sans-serif" }}>Atividades organizadas por níveis que acompanham o desenvolvimento da criança.</p>
          </div>

          <div className="flex flex-col items-center text-center w-102.25 h-65 rounded-2xl py-9 px-6 gap-3 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer" style={{ backgroundColor: "#F7D448" }}>
            <img src="assets/usuario.png" alt="Participação dos Pais" className="h-16" />
            <h3 className="font-bold text-[20px] leading-[120%]" style={{ fontFamily: "'Urbanist', sans-serif" }}>Participação dos Pais</h3>
            <p className="font-normal text-[18px] leading-[150%]" style={{ fontFamily: "'Nunito', sans-serif" }}>Pais que acompanham, participam e apoiam o aprendizado da criança.</p>
          </div>
        </div>
      </section>

      <section id="jogos" className="px-20 py-20 mb-15 fade-section">
        <h2
          className="text-center mb-20 font-bold text-[64px] leading-[100%] text-[#0C78F4]"
          style={{ fontFamily: "'DynaPuff', cursive", textShadow: "-4px 0 #ECF0FF, 4px 0 #ECF0FF, 0 -4px #ECF0FF, 0 4px #ECF0FF" }}
        >
          Jogos
        </h2>

        <div className="grid grid-cols-2 gap-13 mx-auto w-fit">
          <div className="flex flex-col w-89.75 rounded-[35px] pb-12 bg-[#F4F4F4] transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <img src="assets/memory-game.png" alt="Jogo da Memória" className="w-full h-47.75 object-cover rounded-t-[35px]" />
            <div className="flex flex-col px-6 pt-4 gap-2">
              <h3 className="font-semibold text-[20px] leading-[100%] text-center mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Jogo da Memória</h3>
              <p className="font-normal text-[20px] leading-5.5 text-justify" style={{ fontFamily: "'Nunito', sans-serif" }}>Caçador de letras: Vamos testar suas habilidades motoras e desenvolver seu raciocínio. Encontre o PAR correto.</p>
            </div>
          </div>

          <div className="flex flex-col w-89.75 rounded-[35px] pb-12 bg-[#F4F4F4] transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <img src="assets/alphabet-order.png" alt="Ordenar Letras" className="w-full h-47.75 object-cover rounded-t-[35px]" />
            <div className="flex flex-col px-6 pt-4 gap-2">
              <h3 className="font-semibold text-[20px] leading-[100%] text-center mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Ordenar Letras</h3>
              <p className="font-normal text-[20px] leading-5.5 text-justify" style={{ fontFamily: "'Nunito', sans-serif" }}>Ordene as letras do alfabeto na sequência correta. Arraste cada letra até completar a sequência de A-Z.</p>
            </div>
          </div>

          <div className="flex flex-col w-89.75 rounded-[35px] pb-12 bg-[#F4F4F4] transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <img src="assets/letters-and-sounds.png" alt="Letras e Sons" className="w-full h-47.75 object-cover rounded-t-[35px]" />
            <div className="flex flex-col px-6 pt-4 gap-2">
              <h3 className="font-semibold text-[20px] leading-[100%] text-center mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Letras e Sons</h3>
              <p className="font-normal text-[20px] leading-5.5 text-justify" style={{ fontFamily: "'Nunito', sans-serif" }}>Clique em cada letra do alfabeto e ouça o som. É simples, divertido e educativo.</p>
            </div>
          </div>

          <div className="flex flex-col w-89.75 rounded-[35px] pb-12 bg-[#F4F4F4] transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <img src="assets/letter-detective.png" alt="Detetive das Letras" className="w-full h-47.75 object-cover rounded-t-[35px]" />
            <div className="flex flex-col px-6 pt-4 gap-2">
              <h3 className="font-semibold text-[20px] leading-[100%] text-center mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Detetive das Letras</h3>
              <p className="font-normal text-[20px] leading-5.5 text-justify" style={{ fontFamily: "'Nunito', sans-serif" }}>Uma aventura lúdica de investigação, vamos aprender a consciência fonêmica e silábica das palavras.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="comecar" className="px-20 py-20 mb-30 fade-section">
        <div
          className="relative mx-auto flex flex-col items-center justify-center text-white rounded-2xl overflow-hidden"
          style={{
            width: '1157px',
            height: '434px',
            backgroundImage: "url('assets/foto-final.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-[700px]">
            <h2 className="font-bold text-[40px] leading-[120%] text-white text-center" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              Você quer ajudar seu filho a aprender... mas prender a atenção dele nem sempre é fácil?
            </h2>

            <Link
              href="/login"
              className="flex items-center justify-center text-white no-underline hover:opacity-90 transition-opacity font-semibold text-[16px] w-48.75 h-14 bg-[#2E68FD] rounded-full px-6 py-2 gap-2"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Começar Agora
            </Link>
          </div>
        </div>
        </section>

        <Footer />
    </div>
  );
}