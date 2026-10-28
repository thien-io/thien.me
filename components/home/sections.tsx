import Image from "next/image";
import { Mail } from "lucide-react";
import { BookButton } from "@/components/book-button";
import { LogoMark } from "@/components/logo-mark";
import { InlinePhoto, StageSection } from "@/components/home/stage";
import { EMAIL, FAQ, PHOTOS, RATES, type PhotoId } from "@/lib/site";

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="reveal-line">
      <h2 id={id} className="t-h2">
        <span className="line-mask"><span>{children}</span></span>
      </h2>
    </div>
  );
}

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

export function About() {
  return (
    <StageSection id="about" photo="twinView" labelledBy="about-title" className="section-pad">
      <Heading id="about-title">Hey, I&apos;m Thien.</Heading>
      <InlinePhoto photo="twinView" aspect="aspect-[3/2]" className="mt-8" />

      <div className="mt-8 max-w-[38rem]">
        <span className="reveal flex h-11 w-11 items-center justify-center rounded-full bg-moss text-ball" style={d(0.06)}>
          <LogoMark className="h-6 w-6" />
        </span>
        <div className="mt-7 flex flex-col gap-5">
          <p className="reveal" style={d(0.1)}>
            I&apos;m an RSPA certified tennis and pickleball coach based in Connecticut. This season I coach at
            Twin Lakes Beach Club in Salisbury and at Lakeridge in Torrington.
          </p>
          <p className="reveal" style={d(0.16)}>
            I work with players of every level, from people picking up a racket for the first time to competitive
            players who want to sharpen their game.
          </p>
          <p className="reveal" style={d(0.22)}>
            My coaching is about real technique and a strong mental game: the kind of habits that hold up when it
            matters.
          </p>
          <p className="reveal" style={d(0.28)}>
            Off the court I hike, travel, and try to keep my plants alive.
          </p>
        </div>
        <p className="reveal mt-8" style={d(0.32)}>
          <span className="t-statement block italic">Thien</span>
        </p>
      </div>

      <dl className="mt-14 grid grid-cols-3 gap-4 md:gap-8">
        {[
          ["4.5", "USTA rating"],
          ["4.4", "DUPR rating"],
          ["8+", "Years coaching"],
        ].map(([n, label], i) => (
          <div key={label} className="reveal flex flex-col-reverse" style={d(0.1 + i * 0.08)}>
            <dt className="t-small mt-1 text-soft">{label}</dt>
            <dd className="t-h2 tabular !leading-none">
              {n}
            </dd>
          </div>
        ))}
      </dl>
    </StageSection>
  );
}

export function Rates() {
  return (
    <StageSection id="rates" photo="felt" labelledBy="rates-title" className="section-pad">
      <Heading id="rates-title">${RATES.hourly} an hour.</Heading>
      <InlinePhoto photo="felt" aspect="aspect-[3/2]" className="mt-8" />
      <p className="reveal mt-5 max-w-[40ch]" style={d(0.08)}>
        One rate for tennis and pickleball, at every court. Private lessons, one on one.
      </p>

      <div className="mt-12 flex flex-col gap-12">
        <div>
          <h3 className="reveal font-semibold" style={d(0.1)}>
            Private lessons
          </h3>
          <ul className="mt-5 flex flex-col gap-6">
            {RATES.sessions.map((s, i) => (
              <li key={s.name} className="reveal" style={d(0.14 + i * 0.06)}>
                <div className="flex items-baseline justify-between gap-6">
                  <span>{s.name}</span>
                  <span className="tabular font-semibold">${s.price}</span>
                </div>
                <p className="t-small mt-1 max-w-[40ch] text-soft">{s.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="reveal font-semibold" style={d(0.1)}>
            Paying
          </h3>
          <ul className="mt-5 flex flex-col gap-4">
            {RATES.payment.map((p, i) => (
              <li key={p.name} className="reveal flex items-baseline justify-between gap-6" style={d(0.14 + i * 0.06)}>
                <span>{p.name}</span>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-line">
                    {p.detail}
                  </a>
                ) : (
                  <span className="text-soft">{p.detail}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reveal mt-12" style={d(0.1)}>
        <BookButton />
      </div>
    </StageSection>
  );
}

export function Questions() {
  return (
    <StageSection id="questions" photo="net" labelledBy="questions-title" className="section-pad">
      <Heading id="questions-title">Good questions.</Heading>
      <InlinePhoto photo="net" aspect="aspect-[3/2]" className="mt-8" />
      <div className="mt-10 flex max-w-[40rem] flex-col gap-5">
        {FAQ.map((f, i) => (
          <p key={f.q} className="reveal" style={d(0.04 + Math.min(i, 6) * 0.04)}>
            <strong className="font-semibold">{f.q}</strong> {f.a}
          </p>
        ))}
        <p className="reveal" style={d(0.1)}>
          <strong className="font-semibold">Something else?</strong>{" "}
          <a href={`mailto:${EMAIL}`} className="link-line">
            {EMAIL}
          </a>
          , and I will write back.
        </p>
      </div>
    </StageSection>
  );
}

const STRIP: { id: PhotoId; w: number }[] = [
  { id: "twinLakes", w: 112 },
  { id: "ball", w: 150 },
  { id: "stillwater", w: 112 },
  { id: "twinView", w: 200 },
  { id: "felt", w: 150 },
  { id: "twinCourt", w: 200 },
  { id: "twinEvening", w: 200 },
  { id: "hardCourts", w: 225 },
  { id: "net", w: 150 },
  { id: "randsView", w: 225 },
];

/* Breaks the split: a full-width field of leaf green, pictures drifting across the top. */
export function BookBand() {
  const strip = [...STRIP, ...STRIP];
  return (
    <section id="book" aria-labelledby="book-title" className="relative overflow-hidden bg-field py-12 text-field-ink md:py-14">
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {strip.map((s, i) => {
            const p = PHOTOS[s.id];
            return (
              <div key={i} className="relative h-[110px] shrink-0 overflow-hidden rounded-[10px] bg-field-2 md:h-[150px]" style={{ width: `calc(${s.w}px * var(--strip-scale, 1))` }}>
                <Image src={p.src} alt="" fill sizes="240px" loading="eager" className="object-cover" style={{ objectPosition: p.position }} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-[var(--gutter)] pt-14 md:pt-[72px]">
        <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-8">
          <div className="reveal-line">
            <h2 id="book-title" className="t-h2">
              <span className="line-mask"><span>Pick a court, pick a time.</span></span>
            </h2>
          </div>
          <p className="reveal max-w-[44ch] text-field-ink/85" style={d(0.08)}>
            The calendar shows every open slot. Choose one and I will text you to confirm.
          </p>
        </div>

        <div className="mt-10 grid gap-2 md:grid-cols-3">
          <BookButton
            court="twin"
            arrow={false}
            className="reveal press group flex h-[72px] flex-col items-start justify-center rounded-[14px] bg-field-2 px-6 text-left transition-colors duration-300 hover:bg-field-3 md:h-[112px]"
          >
            <span className="t-statement font-semibold">Twin Lakes</span>
            <span className="t-small text-field-ink/75">Salisbury · members and guests</span>
          </BookButton>
          <BookButton
            court="lakeridge"
            arrow={false}
            className="reveal press group flex h-[72px] flex-col items-start justify-center rounded-[14px] bg-field-2 px-6 text-left transition-colors duration-300 hover:bg-field-3 md:h-[112px]"
          >
            <span className="t-statement font-semibold">Lakeridge</span>
            <span className="t-small text-field-ink/75">Torrington · tennis and pickleball</span>
          </BookButton>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("A question about lessons")}`}
            className="reveal press flex h-[72px] items-center justify-between gap-4 rounded-[14px] bg-field-ink px-6 text-field transition-colors duration-300 hover:bg-white md:h-[112px]"
          >
            <span className="flex flex-col">
              <span className="t-statement font-semibold">Ask first</span>
              <span className="t-small opacity-75">{EMAIL}</span>
            </span>
            <Mail className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
