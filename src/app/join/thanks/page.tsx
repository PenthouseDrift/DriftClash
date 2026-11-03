import Link from "next/link";

export const metadata = { title: "Thanks | DriftClash" };

/** Shown after a registration sent without signing up. It shows nothing about what was sent, since there is no one signed in to show it to. */
export default function JoinThanksPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <p aria-hidden className="text-4xl">
          🏁
        </p>
        <h1 className="text-2xl font-black text-white">You’re in</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          We’ve got your details. The Penthouse Drift team will take a look as DriftClash gets closer.
        </p>
        <p className="text-xs leading-relaxed text-zinc-500">
          You registered without signing in, so this can’t be edited afterwards. To register another driver or car, you can
          send the form again.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/join"
            className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-black transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            Register someone else
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
