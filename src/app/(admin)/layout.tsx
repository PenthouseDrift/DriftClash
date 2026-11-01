import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DriftClashShell } from "@/tcg/components/DriftClashShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin" && session.user.role !== "moderator") {
    redirect("/cards");
  }

  const sessionUser = session.user as typeof session.user & {
    customAvatar?: string | null;
  };
  const userWithAvatar = {
    ...session.user,
    image: sessionUser.customAvatar || session.user.image || null,
  };

  return <DriftClashShell user={userWithAvatar}>{children}</DriftClashShell>;
}
