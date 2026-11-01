import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { auth, signOut } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DriftClash | Register your club, driver and cars",
  description:
    "Register your RC drift club, your driver profile and your cars to be part of DriftClash, the Penthouse Drift trading card game.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#09090b",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-amber-500 focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-192.png"
                alt=""
                className="h-9 w-9 rounded-xl border border-amber-500/40 shadow-sm"
              />
              <span className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">DriftClash</span>
                <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-black">
                  Register
                </span>
              </span>
            </Link>

            {session?.user && (
              <div className="flex items-center gap-3">
                <span className="hidden max-w-[16rem] truncate text-xs text-zinc-400 sm:block">
                  {session.user.email}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-200 transition-colors hover:border-amber-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-zinc-800/80 px-4 py-6 text-center text-xs text-zinc-500">
          DriftClash is part of Penthouse Drift. Registration only for now; the game is coming later.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
