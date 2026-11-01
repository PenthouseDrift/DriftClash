import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DriftClashLandingPage() {
  const session = await auth();

  // If already logged in, launch straight into the DriftClash Game Hub
  if (session?.user) {
    redirect("/cards");
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <img
              src="/icons/icon-192.png"
              alt="DriftClash"
              className="h-9 w-9 rounded-xl border border-amber-500/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">
                  DriftClash
                </span>
                <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-black">
                  TCG
                </span>
              </div>
              <span className="block text-[10px] font-medium text-zinc-400">
                Penthouse Drift Trading Card Game
              </span>
            </div>
          </div>

          <Link
            href="/auth/signin"
            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-black transition-colors hover:bg-amber-400"
          >
            Sign In &amp; Play
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl overflow-hidden px-6 pt-16 pb-20 text-center sm:pt-24 sm:pb-24">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[340px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-fuchsia-500/10 blur-3xl" />

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
          <span>⚡ Cross-Play Synced with Penthouse Drift</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
          Forge. Collect. Trade. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Rule the Tandem Arena.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Turn your RC drift builds into full-art trading cards, battle rival 3-card crews in the Tandem Clash Arena for daily P-Credits, and trade rare pulls on the live community Marketplace.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/signin"
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-black text-black shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            ⚡ Launch DriftClash →
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-2">
            <span className="text-2xl">🃏</span>
            <h3 className="text-sm font-black text-white">Shared Card Vault</h3>
            <p className="text-xs text-zinc-400">
              Sign in with your Penthouse Drift account. Your cards, P-Credits, Pack Credits, and Spec Sheets sync in real time across both apps.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-2">
            <span className="text-2xl">⚡</span>
            <h3 className="text-sm font-black text-white">3v3 Tandem Clash Arena</h3>
            <p className="text-xs text-zinc-400">
              Build your 3-card Drift Crew and battle community rivals across Entry, Chase, and Wall-Ride sectors to win daily P-Credits.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-2">
            <span className="text-2xl">🏪</span>
            <h3 className="text-sm font-black text-white">Live Marketplace &amp; Quick Sell</h3>
            <p className="text-xs text-zinc-400">
              List unwanted cards for P-Credits on the player marketplace or Quick Sell instantly from Bronze (10 P) up to Mythic (250 P).
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-2">
            <span className="text-2xl">🎁</span>
            <h3 className="text-sm font-black text-white">Custom Set Packs &amp; Sales</h3>
            <p className="text-xs text-zinc-400">
              Spend P-Credits on Standard Packs or limited-edition Custom Set Packs with transparent pull odds and On-Sale specials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
