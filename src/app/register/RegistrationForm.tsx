"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  MAX_CARS,
  MAX_CHASSIS_PHOTOS,
  MAX_CLUB_PHOTOS,
  MAX_PHOTOS_PER_CAR,
  emptyCar,
  type RegistrationCar,
  type RegistrationInput,
} from "@/lib/registration";
import { PhotoUploader } from "./PhotoUploader";
import { submitGuestRegistration } from "../join/actions";
import { submitRegistration } from "./actions";

const inputCls =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";
const cardCls = "space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-bold text-zinc-200">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-amber-400">
            *
          </span>
        )}
      </span>
      {children}
      {hint && <span className="block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}

function Text({
  value,
  onChange,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
}

export function RegistrationForm({
  userId,
  initial,
  isUpdate,
  guest = false,
}: {
  /** The signed-in person's id, or for a guest the "guest-..." id their photos are kept under. */
  userId: string;
  initial: RegistrationInput;
  isUpdate: boolean;
  /** Sending without signing up: sends through the guest route, with no email. */
  guest?: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<RegistrationInput>(initial);
  const [error, setError] = useState("");
  // A hidden field. People never see it, so only an automated sender fills it in.
  const [website, setWebsite] = useState("");
  const [pending, startTransition] = useTransition();
  const errorRef = useRef<HTMLParagraphElement>(null);

  const setDriver = <K extends keyof RegistrationInput["driver"]>(key: K, value: RegistrationInput["driver"][K]) =>
    setData((d) => ({ ...d, driver: { ...d.driver, [key]: value } }));
  const setClub = <K extends keyof RegistrationInput["club"]>(key: K, value: RegistrationInput["club"][K]) =>
    setData((d) => ({ ...d, club: { ...d.club, [key]: value } }));
  const setCar = <K extends keyof RegistrationCar>(index: number, key: K, value: RegistrationCar[K]) =>
    setData((d) => ({ ...d, cars: d.cars.map((c, i) => (i === index ? { ...c, [key]: value } : c)) }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      // Independent drivers have no club, so no club country is sent either.
      const toSend = data.club.inClub ? data : { ...data, club: { ...data.club, country: "" } };
      const result = guest
        ? await submitGuestRegistration({ guestId: userId, website, registration: toSend })
        : await submitRegistration(toSend);
      if (result.ok) {
        router.push(guest ? "/join/thanks" : "/register/thanks");
      } else {
        setError(result.error);
        errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  const { driver, club, cars } = data;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ── About you ───────────────────────────────────────────────── */}
      <fieldset className={cardCls}>
        <legend className="-ml-1 px-1 text-lg font-black text-white">1. About you</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Driver name" required>
            <Text required maxLength={80} value={driver.driverName} onChange={(v) => setDriver("driverName", v)} autoComplete="name" />
          </Field>
          <Field label="Nickname / tag" hint="What people call you at the track">
            <Text maxLength={60} value={driver.nickname} onChange={(v) => setDriver("nickname", v)} />
          </Field>
        </div>
        {guest && (
          <>
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Leave this empty
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
          </>
        )}
      </fieldset>

      {/* ── Club ────────────────────────────────────────────────────── */}
      <fieldset className={cardCls}>
        <legend className="-ml-1 px-1 text-lg font-black text-white">2. Your club</legend>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-zinc-200">
          <input
            type="checkbox"
            checked={club.inClub}
            onChange={(e) => setClub("inClub", e.target.checked)}
            className="h-5 w-5 accent-amber-500"
          />
          I’m part of a club or team
        </label>

        {club.inClub ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Club name" required>
                <Text required maxLength={100} value={club.name} onChange={(v) => setClub("name", v)} />
              </Field>
              <Field label="Where is the club based?">
                <Text maxLength={120} value={club.location} onChange={(v) => setClub("location", v)} placeholder="Town, track or venue" />
              </Field>
              <Field label="Country" required>
                <Text required maxLength={80} value={club.country} onChange={(v) => setClub("country", v)} autoComplete="country-name" />
              </Field>
              <Field label="Your role in the club">
                <Text maxLength={80} value={club.role} onChange={(v) => setClub("role", v)} placeholder="Member, organiser, owner..." />
              </Field>
            </div>
            <Field label="About the club" hint="What you run, when you meet, what makes it yours">
              <textarea
                maxLength={800}
                rows={3}
                value={club.description}
                onChange={(e) => setClub("description", e.target.value)}
                className={inputCls}
              />
            </Field>
            <PhotoUploader
              userId={userId}
              label="Club logo"
              value={club.logo ? [club.logo] : []}
              onChange={(urls) => setClub("logo", urls[0] ?? "")}
              max={1}
            />
            <PhotoUploader
              userId={userId}
              label="Club photos"
              hint="Group shots, the track, club nights."
              value={club.photos}
              onChange={(urls) => setClub("photos", urls)}
              max={MAX_CLUB_PHOTOS}
            />
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No problem, independent drivers are welcome. Skip to your cars.</p>
        )}
      </fieldset>

      {/* ── Cars ────────────────────────────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-black text-white">3. Your cars</legend>
        <p className="text-sm text-zinc-400">
          Add up to {MAX_CARS} cars. Fill in what you know, a photo of each car is the only must-have.
        </p>

        {cars.map((car, i) => (
          <section key={car.id} aria-label={`Car ${i + 1}`} className={cardCls}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-black text-amber-400">
                Car {i + 1}
                {car.nickname ? ` · ${car.nickname}` : ""}
              </h3>
              {cars.length > 1 && (
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, cars: d.cars.filter((c) => c.id !== car.id) }))}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-amber-500"
                >
                  Remove car
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Car make" required hint="e.g. Yokomo, MST, Rhino, Sakura">
                <Text required maxLength={80} value={car.make} onChange={(v) => setCar(i, "make", v)} />
              </Field>
              <Field label="Car model" required hint="e.g. YD-2, RMX 2.5, D6">
                <Text required maxLength={80} value={car.model} onChange={(v) => setCar(i, "model", v)} />
              </Field>
              <Field label="Car nickname" hint="If it has a name">
                <Text maxLength={80} value={car.nickname} onChange={(v) => setCar(i, "nickname", v)} />
              </Field>
              <Field label="Body shell">
                <Text maxLength={120} value={car.bodyShell} onChange={(v) => setCar(i, "bodyShell", v)} placeholder="e.g. Nissan S15" />
              </Field>
              <Field label="Chassis">
                <Text maxLength={120} value={car.chassis} onChange={(v) => setCar(i, "chassis", v)} />
              </Field>
              <Field label="Motor">
                <Text maxLength={120} value={car.motor} onChange={(v) => setCar(i, "motor", v)} />
              </Field>
              <Field label="ESC">
                <Text maxLength={120} value={car.esc} onChange={(v) => setCar(i, "esc", v)} />
              </Field>
              <Field label="Steering servo">
                <Text maxLength={120} value={car.servo} onChange={(v) => setCar(i, "servo", v)} />
              </Field>
              <Field label="Gyro">
                <Text maxLength={120} value={car.gyro} onChange={(v) => setCar(i, "gyro", v)} />
              </Field>
              <Field label="Tyres">
                <Text maxLength={120} value={car.tyres} onChange={(v) => setCar(i, "tyres", v)} />
              </Field>
            </div>

            <Field label="Anything else about this car" hint="Setup, history, what makes it special">
              <textarea
                maxLength={800}
                rows={2}
                value={car.notes}
                onChange={(e) => setCar(i, "notes", e.target.value)}
                className={inputCls}
              />
            </Field>

            <PhotoUploader
              userId={userId}
              label={`Car ${i + 1} photos (at least 1, up to ${MAX_PHOTOS_PER_CAR})`}
              hint="A side-on shot and one from the front work best. Clear, well lit, no filters."
              value={car.photos}
              onChange={(urls) => setCar(i, "photos", urls)}
              max={MAX_PHOTOS_PER_CAR}
            />
            <PhotoUploader
              userId={userId}
              label={`Car ${i + 1} chassis photo`}
              hint="Optional. The chassis with the body shell off, so we can see the build."
              value={car.chassisPhotos}
              onChange={(urls) => setCar(i, "chassisPhotos", urls)}
              max={MAX_CHASSIS_PHOTOS}
            />
          </section>
        ))}

        {cars.length < MAX_CARS && (
          <button
            type="button"
            onClick={() => setData((d) => ({ ...d, cars: [...d.cars, emptyCar()] }))}
            className="w-full rounded-2xl border border-dashed border-zinc-600 px-4 py-3 text-sm font-black text-zinc-200 transition-colors hover:border-amber-500 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            + Add another car
          </button>
        )}
      </fieldset>

      {/* ── Permission ──────────────────────────────────────────────── */}
      <fieldset className={cardCls}>
        <legend className="-ml-1 px-1 text-lg font-black text-white">4. Your OK</legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-200">
          <input
            type="checkbox"
            required
            checked={data.consentGameData}
            onChange={(e) => setData((d) => ({ ...d, consentGameData: e.target.checked as true }))}
            className="mt-0.5 h-5 w-5 shrink-0 accent-amber-500"
          />
          <span>
            I’m happy for Penthouse Drift to use the details and photos I’ve sent to make cards and content for
            DriftClash. I have the right to share these photos. <span className="text-amber-400">*</span>
          </span>
        </label>
        {/* No email is collected without signing in, so there is nothing to send news to. It is always "no". */}
        {!guest && (
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={data.consentMarketing}
              onChange={(e) => setData((d) => ({ ...d, consentMarketing: e.target.checked }))}
              className="mt-0.5 h-5 w-5 shrink-0 accent-amber-500"
            />
            <span>Keep me posted about DriftClash and Penthouse Drift news (optional).</span>
          </label>
        )}
      </fieldset>

      {error && (
        <p
          ref={errorRef}
          role="alert"
          className="rounded-xl border border-red-900 bg-red-950/60 p-3.5 text-sm font-bold text-red-300"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-black text-black shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Sending..." : isUpdate ? "Save my changes" : "Send my registration"}
      </button>
    </form>
  );
}
