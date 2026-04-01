"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import { SpotifyWidget } from "@/components/spotify-widget";
import Image from "next/image";

interface Track {
  rank: number; title: string; artist: string;
  album: string; albumArt: string; albumArtSmall: string; duration: string; url: string;
}
interface Playlist {
  id: string; name: string; description: string;
  tracks: number; image: string; url: string;
}

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

function PlaylistArt({ src, name }: { src: string; name: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-14 h-14 rounded-xl shrink-0 bg-muted border border-border/50 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden border border-border/30">
      <Image src={src} alt={name} width={56} height={56}
        className="w-full h-full object-cover" onError={() => setErr(true)} unoptimized />
    </div>
  );
}

export default function MusicPage() {
  const [playlists, setPlaylists]   = useState<Playlist[]>([]);
  const [top100, setTop100]         = useState<Track[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [top100Loading, setTop100Loading]       = useState(true);
  const [activeTrack, setActiveTrack]           = useState<Track | null>(null);

  useEffect(() => {
    fetch("/api/spotify/playlists", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setPlaylists(d.playlists || []))
      .catch(() => setPlaylists([]))
      .finally(() => setPlaylistsLoading(false));

    fetch("/api/spotify/top-100")
      .then(r => r.json())
      .then(d => setTop100(d.tracks || []))
      .catch(() => setTop100([]))
      .finally(() => setTop100Loading(false));
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveTrack(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeTrack ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeTrack]);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]">
            listen
          </span>
        </ParallaxSection>
        <div className="relative z-10">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Music</p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
              What I&apos;m<br /><em className="text-primary">listening to.</em>
            </h1>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              All-time favourites and the playlists I actually use.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* ── Now playing ──────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-12">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">Right now</p>
          <div className="w-full max-w-md">
            <SpotifyWidget />
          </div>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* ── Top 100 grid ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-16">
        <ScrollReveal className="mb-8">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">All-time</p>
          <h2 className="font-display text-3xl font-light">Top 100 tracks</h2>
        </ScrollReveal>

        {top100Loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
            {top100.map((track, i) => (
              <button
                key={track.rank}
                onClick={() => setActiveTrack(track)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-border/30 bg-muted shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary tile-fade"
                style={{ animationDelay: `${i * 12}ms` }}
                aria-label={`${track.title} by ${track.artist}`}
              >
                {track.albumArtSmall ? (
                  <Image
                    src={track.albumArtSmall}
                    alt={track.album}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 20vw, (max-width: 1024px) 12vw, 10vw"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-0.5 px-1">
                  <span className="font-mono text-white/50 text-[9px]">#{track.rank}</span>
                  <span className="font-mono text-white text-[9px] font-medium text-center leading-tight line-clamp-2">{track.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <ScrollReveal delay={200} className="mt-4">
          <p className="font-mono text-[10px] text-muted-foreground/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />
            All-time favourites · click any cover for details
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* ── Playlists ────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-16">
        <ScrollReveal className="mb-8">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Playlists</p>
          <h2 className="font-display text-3xl font-light">My playlists</h2>
        </ScrollReveal>

        {playlistsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border bg-card animate-pulse h-[88px]" />
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <p className="font-mono text-[11px] text-muted-foreground/50">
            No public playlists found. Make sure your playlists are set to public on Spotify.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {playlists.map((pl, i) => (
              <ScrollReveal key={pl.id} delay={i * 50}>
                <a
                  href={pl.url} target="_blank" rel="noopener noreferrer"
                  className="flex gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-accent/20 transition-all group items-start"
                >
                  <PlaylistArt src={pl.image} name={pl.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {pl.name}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground/60 mt-0.5">
                      {pl.tracks} tracks
                    </p>
                    {pl.description && (
                      <p className="font-mono text-[10px] text-muted-foreground/60 mt-1.5 leading-relaxed line-clamp-2">
                        {pl.description}
                      </p>
                    )}
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* ── Track detail overlay ─────────────────────────────────────────────── */}
      {activeTrack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background/95 backdrop-blur-lg"
          onClick={() => setActiveTrack(null)}
        >
          <div className="relative w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <div
              className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-border shadow-2xl bg-card"
              style={{ maxHeight: "88vh" }}
            >
              <div className="md:w-[280px] shrink-0 aspect-square md:aspect-auto relative bg-muted">
                {activeTrack.albumArt && (
                  <Image src={activeTrack.albumArt} alt={activeTrack.album} fill
                    className="object-cover" sizes="280px" unoptimized />
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-10 flex flex-col justify-center">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                  #{activeTrack.rank} · {activeTrack.duration}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-2 leading-tight">
                  {activeTrack.title}
                </h2>
                <p className="font-mono text-sm text-primary mb-1">{activeTrack.artist}</p>
                <p className="font-mono text-xs text-muted-foreground mb-8">{activeTrack.album}</p>
                <a
                  href={activeTrack.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DB954] text-black text-sm font-medium hover:bg-[#1ed760] transition-colors w-fit"
                >
                  <SpotifyLogo />
                  Listen on Spotify
                </a>
              </div>
            </div>
            <button
              onClick={() => setActiveTrack(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 flex items-center justify-center transition-all font-mono text-sm shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style suppressHydrationWarning>{`
        @keyframes tileIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .tile-fade {
          opacity: 0;
          animation: tileIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
