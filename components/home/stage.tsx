"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PHOTOS, type PhotoId } from "@/lib/site";

/* The split stage: one photograph held still beside the reading column, changing
   to the picture of whichever section is in the middle of the screen. */

const StageContext = createContext<{ photo: PhotoId; show: (p: PhotoId) => void } | null>(null);

export function StageProvider({ initial, children }: { initial: PhotoId; children: React.ReactNode }) {
  const [photo, setPhoto] = useState<PhotoId>(initial);
  return <StageContext.Provider value={{ photo, show: setPhoto }}>{children}</StageContext.Provider>;
}

function useStage() {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("Stage components must sit inside <StageProvider>");
  return ctx;
}

/** The sticky photograph (desktop only). */
export function Stage({ photos }: { photos: PhotoId[] }) {
  const { photo } = useStage();
  const reduce = useReducedMotion();
  const p = PHOTOS[photo];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-ink">
      {photos.map((id) => {
        const on = id === photo;
        const ph = PHOTOS[id];
        return (
          <motion.div
            key={id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on || reduce ? 1 : 1.06 }}
            transition={{
              opacity: { duration: 0.9, ease: [0.32, 0.72, 0, 1] },
              scale: { duration: on ? 9 : 1.2, ease: [0.22, 1, 0.36, 1] },
            }}
            aria-hidden={!on}
          >
            <Image
              src={ph.src}
              alt={on ? ph.alt : ""}
              fill
              priority={id === photos[0]}
              sizes="47vw"
              className="object-cover"
              style={{ objectPosition: ph.position }}
            />
          </motion.div>
        );
      })}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[rgba(20,22,16,0.28)] [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="absolute bottom-5 left-5 right-5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={photo}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="t-fine text-white"
          >
            {p.caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A section of the reading column that asks the stage for its photograph while centred. */
export function StageSection({
  id,
  photo,
  className = "",
  children,
  labelledBy,
}: {
  id?: string;
  photo: PhotoId;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const { show } = useStage();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      rootMargin: "-48% 0px -48% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (active) show(photo);
  }, [active, photo, show]);

  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}

/** On phones the stage is not fixed: each section carries its own picture inline. */
export function InlinePhoto({
  photo,
  aspect = "aspect-[4/3]",
  className = "",
  priority = false,
  caption = true,
}: {
  photo: PhotoId;
  aspect?: string;
  className?: string;
  priority?: boolean;
  caption?: boolean;
}) {
  const p = PHOTOS[photo];
  return (
    <figure className={`lg:hidden ${className}`}>
      <div className={`relative w-full overflow-hidden rounded-[14px] bg-surface ${aspect}`}>
        <AnimatePresence initial={false}>
          <motion.div
            key={photo}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              priority={priority}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: p.position }}
            />
          </motion.div>
        </AnimatePresence>
        {caption && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[rgba(20,22,16,0.3)] [mask-image:linear-gradient(to_top,black,transparent)]" />
            <p className="t-fine absolute bottom-3 left-4 right-4 text-white">{p.caption}</p>
          </>
        )}
      </div>
    </figure>
  );
}
