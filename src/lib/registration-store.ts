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
    status: existing?.status ?? "new",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...(existing?.reviewedAt ? { reviewedAt: existing.reviewedAt } : {}),
  };
  await redis.set(REGISTRATION_KEY(who.id), record);
  await redis.zadd(REGISTRATION_INDEX, { score: record.createdAt, member: who.id });
  return record;
}
