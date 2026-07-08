import Footer from "@/src/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alphaplay",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
