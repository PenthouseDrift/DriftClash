import { redis } from "./redis";
import type { Registration, RegistrationInput } from "./registration";

/** Redis keys. The Penthouse Drift admin reads the same ones. */
export const REGISTRATION_KEY = (id: string) => `driftclash:registration:${id}`;
export const REGISTRATION_INDEX = "driftclash:registrations";

export async function getRegistration(id: string): Promise<Registration | null> {
  const record = await redis.get<Registration>(REGISTRATION_KEY(id));
  return record ?? null;
}

interface Who {
  id: string;
  email: string;
  name: string;
  image: string;
}

/**
 * Save someone's registration. One per Google account: sending the form again updates it and keeps
 * the original sign-up time, so it stays in the same place in the admin list.
 */
export async function saveRegistration(who: Who, input: RegistrationInput): Promise<Registration> {
  const existing = await getRegistration(who.id);
  const now = Date.now();
  const record: Registration = {
    ...input,
    id: who.id,
    email: who.email,
    googleName: who.name,
    googleImage: who.image,
    source: "google",
    status: existing?.status ?? "new",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...(existing?.reviewedAt ? { reviewedAt: existing.reviewedAt } : {}),
  };
  await redis.set(REGISTRATION_KEY(who.id), record);
  await redis.zadd(REGISTRATION_INDEX, { score: record.createdAt, member: who.id });
  return record;
}

/**
 * Save a registration sent without signing up. Every send is its own new registration: with no sign in there is nothing to
 * prove who is sending, so a later send must never be able to change an earlier one. It has no email, since nobody signed up.
 */
export async function saveGuestRegistration(who: { id: string }, input: RegistrationInput): Promise<Registration> {
  const now = Date.now();
  const record: Registration = {
    ...input,
    id: who.id,
    email: "",
    googleName: "",
    googleImage: "",
    source: "guest",
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  // Only if nothing is saved under this id yet, so sending the same form twice can't change what was first sent.
  const saved = await redis.set(REGISTRATION_KEY(who.id), record, { nx: true });
  if (saved === null) return (await getRegistration(who.id)) ?? record;
  await redis.zadd(REGISTRATION_INDEX, { score: record.createdAt, member: who.id });
  return record;
}
