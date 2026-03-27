"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface NowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
}

export function SpotifyWidget() {
  const [data, setData] = useState<NowPlaying | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/spotify");
        const json = await res.json();
        setData(json);
      } catch {
        setData({ isPlaying: false });
      }
    };
    fetch_();
    const interval = setInterval(fetch_, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="h-16 rounded-xl border border-border bg-muted animate-pulse" />
    );
  }

  if (!data.isPlaying) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-muted-foreground">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-mono text-muted-foreground">
            Not playing
          </p>
          <p className="text-sm text-foreground">Spotify is quiet right now</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors group"
    >
      {data.albumArt && (
        <Image
          src={data.albumArt}
          alt={data.album || "Album art"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-md object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {/* EQ bars */}
          <div className="flex items-end gap-[2px] h-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-[3px] bg-primary rounded-full spotify-bar`}
                style={{ height: "100%", transformOrigin: "bottom" }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-primary uppercase tracking-wider">
            Now playing
          </span>
        </div>
        <p className="text-sm font-medium text-foreground truncate">
          {data.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{data.artist}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
}
