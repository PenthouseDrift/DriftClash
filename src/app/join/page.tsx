import { randomUUID } from "crypto";
import Link from "next/link";
import { CardsTrio } from "@/components/CardsShowcase";
import { emptyRegistrationInput } from "@/lib/registration";
import { RegistrationForm } from "../register/RegistrationForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Register without signing up | DriftClash" };

/** Register without a Google account. Open to anyone; see submitGuestRegistration for how it is kept narrow. */
export default function JoinPage() {
  // This form's own id. Its photos are kept under it, and the registration is saved under it.
  const guestId = `guest-${randomUUID()}`;
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <div className="space-y-3">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="text-3xl font-black text-white">Register for DriftClash</h1>
            <p className="text-sm text-zinc-400">
              No sign in needed. Fields marked <span className="text-amber-400">*</span> are required. Photos are resized on
              your device before they upload.
            </p>
          </div>
          <CardsTrio className="w-28 shrink-0 sm:w-44" />
        </div>
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 text-xs leading-relaxed text-zinc-400">
          Because you aren’t signed in, you can send this form once and can’t come back to change it. If you’d like to
          update your details later,{" "}
          <Link href="/auth/signin" className="font-bold text-amber-400 underline hover:text-amber-300">
            sign in with Google
          </Link>{" "}
          instead.
        </p>
      </div>
      <RegistrationForm userId={guestId} initial={emptyRegistrationInput("")} isUpdate={false} guest />
    </div>
  );
}
