/**
 * Pictures of real DriftClash cards from the Penthouse Drift game, so people can see what their car could become.
 * The files in /public are pre-sized WebPs (made from the game's own cards), two widths each so phones fetch the small one.
 */

/** Five cards, Bronze to Mythic, fanned out. For the top of a page. */
export function CardsFan({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/cards-fan-1100.webp"
      srcSet="/cards-fan-560.webp 560w, /cards-fan-1100.webp 1100w"
      sizes="(min-width: 1024px) 720px, 92vw"
      width={1100}
      height={470}
      alt="Five DriftClash cards from Bronze to Mythic, each showing an RC drift car, its driver and its stats"
      loading="eager"
      decoding="async"
      className={`mx-auto h-auto w-full max-w-3xl drop-shadow-[0_0_2rem_rgba(245,158,11,0.2)] ${className}`}
    />
  );
}

/** A smaller Mythic and two Legend cards. For beside a heading. */
export function CardsTrio({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/cards-promo-480.webp"
      srcSet="/cards-promo-240.webp 240w, /cards-promo-480.webp 480w"
      sizes="(min-width: 640px) 176px, 112px"
      width={480}
      height={382}
      alt="A Mythic card and two Legend cards"
      loading="lazy"
      decoding="async"
      className={`h-auto drop-shadow-[0_0_1rem_rgba(232,185,35,0.35)] ${className}`}
    />
  );
}
