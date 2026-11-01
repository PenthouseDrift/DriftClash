import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { emptyRegistrationInput, type RegistrationInput } from "@/lib/registration";
import { getRegistration } from "@/lib/registration-store";
import { RegistrationForm } from "./RegistrationForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Register | DriftClash" };

export default async function RegisterPage() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect("/auth/signin");

  const existing = await getRegistration(user.id);

  // Pass the form only what it edits, not the sign-up details kept alongside it.
  const initial: RegistrationInput = existing
    ? {
        driver: existing.driver,
        club: existing.club,
        cars: existing.cars.map((c) => ({ ...c, chassisPhotos: c.chassisPhotos ?? [] })),
        consentGameData: existing.consentGameData,
        consentMarketing: existing.consentMarketing,
      }
    : emptyRegistrationInput(user.name ?? "");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">
          {existing ? "Update your registration" : "Register for DriftClash"}
        </h1>
        <p className="text-sm text-zinc-400">
          Signed in as {user.email}. Fields marked <span className="text-amber-400">*</span> are required. Photos are
          resized on your device before they upload.
        </p>
      </div>
      <RegistrationForm userId={user.id} initial={initial} isUpdate={Boolean(existing)} />
    </div>
  );
}
