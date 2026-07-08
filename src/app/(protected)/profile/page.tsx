import { getChildren, getUser } from "@/src/actions/profileAction";
import ProfileManager from "@/src/components/profile/ProfileManager";
import LogoutButton from "@/src/components/ui/LogoutButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil",
};

export default async function ProfilePage() {
  const children = await getChildren();
  const responsible = await getUser();

  return (
    <main className="flex flex-col relative items-center justify-center w-full min-h-screen py-10">
      <div className="absolute inset-0 z-0 bg-[url('/assets/fundo.png')] bg-cover" />

      <div className="absolute top-8 right-8 z-20">
        <LogoutButton />
      </div>

      <div className="text-center mt-22.5 mb-27 space-y-2 font-dynapuff relative z-10">
        <h1 className="text-5xl font-bold text-secondary-400">
          Olá, {responsible?.name}!
        </h1>
        <h2 className="text-5xl font-medium text-secondary-400">
          Quem vai aprender hoje?
        </h2>
      </div>

      <div className="relative z-30">
        <ProfileManager childrenData={children} />
      </div>
    </main>
  );
}
