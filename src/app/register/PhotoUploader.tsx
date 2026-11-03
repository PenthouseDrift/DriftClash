"use client";

import { upload } from "@vercel/blob/client";
import { useId, useRef, useState } from "react";

const MAX_EDGE = 1600;

/** Shrink a phone photo to a sensible size before it's uploaded (they're often 5-10MB). */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser can't process photos");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("Couldn't prepare that photo");
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}

export function PhotoUploader({
  userId,
  label,
  hint,
  value,
  onChange,
  max,
}: {
  userId: string;
  label: string;
  hint?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max: number;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  const room = max - value.length;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    const chosen = Array.from(files).slice(0, room);
    if (files.length > room) setError(`Only ${max} photo${max === 1 ? "" : "s"} allowed here, so some were skipped.`);

    setBusy((n) => n + chosen.length);
    const added: string[] = [];
    for (const file of chosen) {
      try {
        const small = await shrink(file);
        const blob = await upload(`registrations/${userId}/${crypto.randomUUID()}.jpg`, small, {
          access: "public",
          // A registration sent without signing in has a guest folder and its own, narrower, upload route.
          handleUploadUrl: userId.startsWith("guest-") ? "/api/upload-guest" : "/api/upload",
          contentType: "image/jpeg",
        });
        added.push(blob.url);
      } catch (err) {
        setError(err instanceof Error ? `A photo couldn't be added: ${err.message}` : "A photo couldn't be added.");
      } finally {
        setBusy((n) => n - 1);
      }
    }
    if (added.length > 0) onChange([...value, ...added]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <label htmlFor={inputId} className="text-sm font-bold text-zinc-200">
          {label}
        </label>
        <span className="text-xs text-zinc-500">
          {value.length}/{max}
        </span>
      </div>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}

      {(value.length > 0 || busy > 0) && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <li key={url} className="relative aspect-square overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`${label} ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((u) => u !== url))}
                aria-label={`Remove ${label} ${i + 1}`}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-black text-white hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                ×
              </button>
            </li>
          ))}
          {Array.from({ length: busy }).map((_, i) => (
            <li
              key={`busy-${i}`}
              role="status"
              aria-label="Uploading photo"
              className="flex aspect-square animate-pulse items-center justify-center rounded-xl border border-dashed border-amber-500/50 bg-zinc-800 text-xs font-bold text-amber-400"
            >
              Uploading
            </li>
          ))}
        </ul>
      )}

      {room > 0 && (
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple={max > 1}
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full cursor-pointer rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-sm file:font-black file:text-black hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500"
        />
      )}

      {error && (
        <p role="alert" className="text-xs font-bold text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
