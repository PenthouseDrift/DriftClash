import { signIn } from "@/lib/auth";

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-zinc-800 text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/icons/icon-192.png"
            alt="DriftClash"
            className="h-14 w-14 rounded-2xl border border-amber-500/40 shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-1.5">
              <h1 className="text-2xl font-black text-white">DriftClash</h1>
              <span className="rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-black uppercase text-black">
                TCG
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Sign in with your Penthouse Drift Google account to access your shared card collection, P-Credits, and Clash Arena.
            </p>
          </div>
        </div>

        <SignInContent searchParams={searchParams} />
      </div>
    </div>
  );
}

async function SignInContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error && (
        <div className="bg-red-950/50 border border-red-900 text-red-300 rounded-xl p-3 text-sm text-center">
          Sign-in could not be completed. Please try again.
        </div>
      )}

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/cards" });
        }}
      >
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black py-3.5 px-4 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
        >
          <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
      </form>
    </>
  );
}
