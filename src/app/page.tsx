import Link from "next/link";
import { auth } from "@/lib/auth";
import { getRegistration } from "@/lib/registration-store";

const STEPS = [
  { n: "1", title: "Sign in with Google", body: "One tap. We use it so each person registers once and can come back to update their details." },
  { n: "2", title: "Tell us about you and your club", body: "Your driver name, where you're from, and your club if you're in one." },
  { n: "3", title: "Add your cars", body: "Make, model, setup and photos. The more detail, the better your cards will look." },
];

const WHAT = [
  { icon: "🏁", title: "Your club", body: "Name, location, links and photos." },
  { icon: "🧑‍🔧", title: "Your driver profile", body: "Driver name, experience, and a photo." },
  { icon: "🏎️", title: "Your cars", body: "Specs, setup details and pictures of up to five cars." },
];

export default async function LandingPage() {
  const session = await auth();
  const existing = session?.user?.id ? await getRegistration(session.user.id) : null;

  const ctaHref = session?.user ? "/register" : "/auth/signin";
  const ctaLabel = existing ? "Update my registration" : session?.user ? "Continue to the form" : "Sign in with Google to register";

  return (
    <div>
      <section className="relative mx-auto max-w-5xl overflow-hidden px-4 pb-14 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[340px] w-[580px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-fuchsia-500/10 blur-3xl"
        />
        <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
          Registration is open
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          Get your club, driver and cars into{" "}
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            DriftClash
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          DriftClash is the Penthouse Drift trading card game. We are collecting RC drift clubs, drivers and cars now,
          so they can appear as cards when the game launches.
        </p>

        {existing && (
          <p
            role="status"
            className="mx-auto mt-6 max-w-md rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300"
          >
            You’re registered, {existing.driver.driverName}. You can update your details any time.
          </p>
        )}

        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-block w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-black text-black shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 sm:w-auto"
          >
            {ctaLabel} →
          </Link>
        </div>
        {!session?.user && (
          <p className="mt-4 text-sm text-zinc-400">
            Don’t want to sign in?{" "}
            <Link href="/join" className="font-bold text-amber-400 underline hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-amber-400">
              Register without signing up
            </Link>
          </p>
        )}
      </section>

      <section aria-labelledby="what-heading" className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
        <h2 id="what-heading" className="mb-5 text-center text-sm font-black uppercase tracking-wider text-zinc-400">
          What we’d like to know
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {WHAT.map((item) => (
            <li key={item.title} className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <span aria-hidden className="text-2xl">
                {item.icon}
              </span>
              <h3 className="text-sm font-black text-white">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-heading" className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 id="how-heading" className="mb-5 text-center text-sm font-black uppercase tracking-wider text-zinc-400">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-black text-black">
                {step.n}
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-zinc-500">
          What you send is seen by the Penthouse Drift team and may be used to make cards and content for DriftClash.
          You can update your details here whenever you like.
        </p>
      </section>
    </div>
  );
}
