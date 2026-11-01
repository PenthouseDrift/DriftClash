import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRegistration } from "@/lib/registration-store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Thanks | DriftClash" };

export default async function ThanksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const registration = await getRegistration(session.user.id);
  if (!registration) redirect("/register");

  const carCount = registration.cars.length;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <p aria-hidden className="text-4xl">
          🏁
        </p>
        <h1 className="text-2xl font-black text-white">You’re in, {registration.driver.driverName}</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          We’ve got your details
          {registration.club.inClub && registration.club.name ? ` for ${registration.club.name}` : ""} and{" "}
          {carCount === 1 ? "your car" : `your ${carCount} cars`}. The Penthouse Drift team will take a look, and we’ll
          be in touch as DriftClash gets closer.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-black transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            Update my details
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-black text-zinc-200 transition-colors hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            Back to the start
          </Link>
        </div>
      </div>
    </div>
  );
}
