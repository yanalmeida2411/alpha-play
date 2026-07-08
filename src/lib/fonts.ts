import { DynaPuff, Nunito } from "next/font/google";

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-nunito",
});

export const dynapuff = DynaPuff({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dynapuff",
});
