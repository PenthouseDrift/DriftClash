import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DevToolsPanel } from "@/components/DevToolsPanel";
import { getForceSelfCheckIn, getImpersonation } from "@/actions/dev";
import { getCardCredits } from "@/lib/card-credits";
import { DriftClashShell } from "@/tcg/components/DriftClashShell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const sessionUser = session.user as typeof session.user & {
    customAvatar?: string | null;
    realRole?: string;
  };
  const userWithAvatar = {
    ...session.user,
    image: sessionUser.customAvatar || session.user.image || null,
  };

  const isDev = process.env.NODE_ENV === "development";
  const isImpersonating = Boolean(sessionUser.realRole);
  const realRole = sessionUser.realRole ?? session.user.role ?? "member";
  const forceSelfCheckin = isDev ? await getForceSelfCheckIn() : false;
  const impersonateVariant = isDev ? await getImpersonation() : null;
  const devCardCredits = isDev ? await getCardCredits(session.user.id) : 0;

  return (
    <DriftClashShell user={userWithAvatar}>
      {isDev && (
        <DevToolsPanel
          isImpersonating={isImpersonating}
          impersonateVariant={impersonateVariant}
          realRole={realRole}
          forceSelfCheckin={forceSelfCheckin}
          cardCredits={devCardCredits}
        />
      )}
      {children}
    </DriftClashShell>
  );
}
