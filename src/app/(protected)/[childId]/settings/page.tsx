import { getUser } from "@/src/actions/profileAction";
import SettingsClient from "@/src/components/settings";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ childId: string }>;
}) {
    const { childId } = await params;

    const cookieStore = await cookies();
    const hasPin = cookieStore.has("pin_code");

    if (!hasPin) {
        redirect(`/${childId}`);
    }

    const initialUser = await getUser();

    return <SettingsClient initialUser={initialUser} />;
}
