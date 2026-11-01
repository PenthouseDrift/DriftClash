"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { registrationInputSchema } from "@/lib/registration";
import { saveRegistration } from "@/lib/registration-store";

export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Check what was sent and save it against the signed-in Google account. */
export async function submitRegistration(input: unknown): Promise<SubmitResult> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email) {
    return { ok: false, error: "Please sign in again, then send the form." };
  }

  const parsed = registrationInputSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // Point at the car when the problem is inside one (cars.0.photos -> "Car 1").
    const path = issue.path;
    const where = path[0] === "cars" && typeof path[1] === "number" ? `Car ${path[1] + 1}: ` : "";
    return { ok: false, error: `${where}${issue.message}` };
  }

  try {
    await saveRegistration(
      { id: user.id, email: user.email, name: user.name ?? "", image: user.image ?? "" },
      parsed.data
    );
  } catch (err) {
    console.error("[register] save failed:", err);
    return { ok: false, error: "We couldn't save that just now. Please try again in a moment." };
  }

  revalidatePath("/");
  revalidatePath("/register");
  return { ok: true };
}
