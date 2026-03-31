"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import { SpotifyWidget } from "@/components/spotify-widget";
import Image from "next/image";

interface Track {
  rank: number; title: string; artist: string;
  album: string; albumArt: string; duration: string; url: string;
}
interface Playlist {
  id: string; name: string; description: string;
  tracks: number; image: string; url: string;
}

const FALLBACK_TRACKS: Track[] = [
  { rank:1,  title:"Espresso",             artist:"Sabrina Carpenter",             album:"Short n' Sweet",       albumArt:"", duration:"2:55", url:"#" },
  { rank:2,  title:"A Bar Song (Tipsy)",   artist:"Shaboozey",                     album:"Where I Come From",    albumArt:"", duration:"3:17", url:"#" },
  { rank:3,  title:"Birds of a Feather",   artist:"Billie Eilish",                 album:"HIT ME HARD AND SOFT", albumArt:"", duration:"3:30", url:"#" },
  { rank:4,  title:"Too Sweet",            artist:"Hozier",                        album:"Unreal Unearth",        albumArt:"", duration:"4:02", url:"#" },
  { rank:5,  title:"Good Luck, Babe!",     artist:"Chappell Roan",                 album:"The Rise and Fall…",   albumArt:"", duration:"3:39", url:"#" },
  { rank:6,  title:"White Flag",           artist:"Joseph",                        album:"Good Luck, Kid",        albumArt:"", duration:"3:44", url:"#" },
  { rank:7,  title:"Lose Control",         artist:"Teddy Swims",                   album:"I've Tried Everything", albumArt:"", duration:"3:29", url:"#" },
  { rank:8,  title:"saturn",               artist:"SZA",                           album:"SOS",                   albumArt:"", duration:"2:37", url:"#" },
  { rank:9,  title:"Please Please Please", artist:"Sabrina Carpenter",             album:"Short n' Sweet",        albumArt:"", duration:"2:58", url:"#" },
  { rank:10, title:"I Had Some Help",      artist:"Post Malone ft. Morgan Wallen", album:"F-1 Trillion",          albumArt:"", duration:"3:06", url:"#" },
];

function AlbumArt({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-10 h-10 rounded-lg shrink-0 bg-muted border border-border flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-muted-foreground/25" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden border border-border/40">
      <Image src={src} alt={alt} width={40} height={40}
        className="w-full h-full object-cover" onError={() => setErr(true)} unoptimized />
    </div>
  );
}

function PlaylistArt({ src, name }: { src: string; name: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-12 h-12 rounded-lg shrink-0 bg-muted border border-border flex items-center justify-center">
        <span className="text-lg">🎵</span>
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden border border-border/40">
      <Image src={src} alt={name} width={48} height={48}
        className="w-full h-full object-cover" onError={() => setErr(true)} unoptimized />
    </div>
  );
}

export default function MusicPage() {
  const [tracks, setTracks]       = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracksLoading, setTracksLoading]       = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spotify/top-tracks", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setTracks(d.tracks?.length ? d.tracks : FALLBACK_TRACKS))
      .catch(() => setTracks(FALLBACK_TRACKS))
      .finally(() => setTracksLoading(false));

    fetch("/api/spotify/playlists", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setPlaylists(d.playlists || []))
      .catch(() => setPlaylists([]))
      .finally(() => setPlaylistsLoading(false));
  }, []);

  return (
    <div>
      <section className="relative px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span
            className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]"
          >
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
            What I&apos;ve been putting on repeat. My top tracks this month and the playlists I actually use.
          </p>
        </ScrollReveal>
              </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Now playing */}
      <section className="px-8 md:px-16 py-12">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">Right now</p>
          <div className="max-w-sm"><SpotifyWidget /></div>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Top tracks */}
      <section className="px-8 md:px-16 py-16">
        <ScrollReveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">This month</p>
          <h2 className="font-display text-3xl font-light">Top 10 tracks</h2>
        </ScrollReveal>

        <div className="max-w-xl">
          {tracksLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-border/40">
                  <div className="w-10 h-10 rounded-lg bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                    <div className="h-2.5 bg-muted animate-pulse rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-px">
              {tracks.map((song, i) => (
                <ScrollReveal key={song.rank} delay={i * 35}>
                  <a
                    href={song.url !== "#" ? song.url : undefined}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 py-3 border-b border-border/40 group hover:bg-accent/30 -mx-3 px-3 rounded-xl transition-colors"
                  >
                    <AlbumArt src={song.albumArt} alt={song.album} />
                    <span className="font-mono text-[11px] text-muted-foreground/50 w-4 text-right shrink-0 tabular-nums">
                      {song.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {song.title}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">{song.artist}</p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0 tabular-nums hidden sm:block">
                      {song.duration}
                    </span>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          )}
          <ScrollReveal delay={400} className="mt-5">
            <p className="font-mono text-[10px] text-muted-foreground/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
              Live from Spotify · updates monthly
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Playlists */}
      <section className="px-8 md:px-16 py-16">
        <ScrollReveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Playlists</p>
          <h2 className="font-display text-3xl font-light">My playlists</h2>
        </ScrollReveal>

        {playlistsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border border-border rounded-xl bg-card animate-pulse h-24" />
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <p className="font-mono text-[11px] text-muted-foreground/50 max-w-xl">
            No public playlists found. Make sure your playlists are set to public on Spotify.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {playlists.map((pl, i) => (
              <ScrollReveal key={pl.id} delay={i * 45}>
                <a
                  href={pl.url} target="_blank" rel="noopener noreferrer"
                  className="flex gap-3 p-4 border border-border rounded-xl bg-card hover:border-primary/30 transition-colors group items-start"
                >
                  <PlaylistArt src={pl.image} name={pl.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {pl.name}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                      {pl.tracks} tracks
                    </p>
                    {pl.description && (
                      <p className="font-mono text-[10px] text-muted-foreground/70 mt-1 leading-relaxed line-clamp-2">
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
    </div>
  );
}
