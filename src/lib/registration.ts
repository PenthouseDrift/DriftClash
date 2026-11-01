import { z } from "zod";

/**
 * What a person gives us when they register: who they are, their club, and their cars.
 * Stored in the shared Redis so the Penthouse Drift admin can read it (see registration-store.ts).
 * The same shape is read by penthouseDrift/src/lib/driftclash-registrations.ts. Keep the two in step.
 */

export const MAX_CARS = 5;
/** Every photo upload on the form is capped at this many. */
export const MAX_PHOTOS = 2;
export const MAX_PHOTOS_PER_CAR = MAX_PHOTOS;
export const MAX_CHASSIS_PHOTOS = MAX_PHOTOS;
export const MAX_CLUB_PHOTOS = MAX_PHOTOS;

const text = (max: number) => z.string().trim().max(max);
const required = (max: number, label: string) => z.string().trim().min(1, `${label} is required`).max(max);

/** Photos are uploaded straight to Vercel Blob, so only those addresses are accepted. */
const photoUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
    } catch {
      return false;
    }
  }, "That photo address isn't valid");


export const driverSchema = z.object({
  driverName: required(80, "Driver name"),
  nickname: text(60),
});

export const clubSchema = z.object({
  country: text(80),
  inClub: z.boolean(),
  name: text(100),
  location: text(120),
  role: text(80),
  description: text(800),
  logo: photoUrl.or(z.literal("")),
  photos: z.array(photoUrl).max(MAX_CLUB_PHOTOS),
});

export const carSchema = z.object({
  id: z.string().trim().min(1).max(40),
  nickname: text(80),
  make: required(80, "Car make"),
  model: required(80, "Car model"),
  chassis: text(120),
  bodyShell: text(120),
  motor: text(120),
  esc: text(120),
  servo: text(120),
  gyro: text(120),
  tyres: text(120),
  notes: text(800),
  photos: z.array(photoUrl).min(1, "Add at least one photo of each car").max(MAX_PHOTOS_PER_CAR),
  chassisPhotos: z.array(photoUrl).max(MAX_CHASSIS_PHOTOS).default([]),
});

export const registrationInputSchema = z
  .object({
    driver: driverSchema,
    club: clubSchema,
    cars: z.array(carSchema).min(1, "Add at least one car").max(MAX_CARS),
    consentGameData: z.literal(true, { error: "We need your OK to use this in the game" }),
    consentMarketing: z.boolean(),
  })
  .refine((data) => !data.club.inClub || data.club.name.length > 0, {
    path: ["club", "name"],
    message: "Club name is required",
  })
  .refine((data) => !data.club.inClub || data.club.country.length > 0, {
    path: ["club", "country"],
    message: "Country is required",
  });

export type RegistrationInput = z.infer<typeof registrationInputSchema>;
export type RegistrationCar = z.infer<typeof carSchema>;

export type RegistrationStatus = "new" | "reviewed";

/** A saved registration. `id` is the person's Google account id, so each person has one. */
export interface Registration extends RegistrationInput {
  id: string;
  email: string;
  googleName: string;
  googleImage: string;
  status: RegistrationStatus;
  createdAt: number;
  updatedAt: number;
  reviewedAt?: number;
}

export function emptyCar(): RegistrationCar {
  return {
    id: crypto.randomUUID(),
    nickname: "",
    make: "",
    model: "",
    chassis: "",
    bodyShell: "",
    motor: "",
    esc: "",
    servo: "",
    gyro: "",
    tyres: "",
    notes: "",
    photos: [],
    chassisPhotos: [],
  };
}

export function emptyRegistrationInput(name = ""): RegistrationInput {
  return {
    driver: {
      driverName: name,
      nickname: "",
    },
    club: {
      country: "United Kingdom",
      inClub: true,
      name: "",
      location: "",
      role: "",
      description: "",
      logo: "",
      photos: [],
    },
    cars: [emptyCar()],
    consentGameData: true as const,
    consentMarketing: false,
  };
}
