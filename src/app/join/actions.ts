"use server";

import { revalidatePath } from "next/cache";
import { allowRequest } from "@/lib/rate-limit";
import { GUEST_ID_PATTERN, photoUrlsOf, registrationInputSchema } from "@/lib/registration";
import { saveGuestRegistration } from "@/lib/registration-store";

export type GuestSubmitResult = { ok: true } | { ok: false; error: string };

/** Registrations one visitor may send in an hour. Enough for a mistake or two, not enough to flood the list. */
const SENDS_PER_HOUR = 5;

/**
 * Save a registration from someone who hasn't signed in. Nothing here proves who is sending, so it is kept narrow:
 *  - limited per visitor, and a hidden field only a bot would fill in is ignored;
 *  - the photos must be ones uploaded for this very form (under this form's own folder), not other people's pictures;
 *  - it only ever creates a new registration, never changes an existing one.
 */
export async function submitGuestRegistration(input: {
  guestId: string;
  /** A hidden field. People leave it empty; automated senders tend to fill every field. */
  website: string;
  registration: unknown;
}): Promise<GuestSubmitResult> {
  // A bot gets the same answer as a person, and nothing is saved.
  if (typeof input?.website === "string" && input.website.trim() !== "") return { ok: true };

  if (typeof input?.guestId !== "string" || !GUEST_ID_PATTERN.test(input.guestId)) {
    return { ok: false, error: "Please reload the page and try again." };
  }

  const parsed = registrationInputSchema.safeParse(input.registration);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // Point at the car when the problem is inside one (cars.0.photos -> "Car 1").
    const path = issue.path;
    const where = path[0] === "cars" && typeof path[1] === "number" ? `Car ${path[1] + 1}: ` : "";
    return { ok: false, error: `${where}${issue.message}` };
  }

  const folder = `/registrations/${input.guestId}/`;
  const photosOk = photoUrlsOf(parsed.data).every((url) => {
    try {
      return new URL(url).pathname.startsWith(folder);
    } catch {
      return false;
    }
  });
  if (!photosOk) return { ok: false, error: "A photo wasn't added from this page. Please add the photos again." };

  if (!(await allowRequest("guest-register", SENDS_PER_HOUR, 3600))) {
    return { ok: false, error: "That's a lot of registrations from one place. Please try again in a while." };
  }

  try {
    await saveGuestRegistration({ id: input.guestId }, parsed.data);
  } catch (err) {
    console.error("[join] save failed:", err);
    return { ok: false, error: "We couldn't save that just now. Please try again in a moment." };
  }
  revalidatePath("/");
  return { ok: true };
}
