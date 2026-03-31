import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TMDB_BASE = "https://api.themoviedb.org/3";

async function fetchPoster(type: "movie" | "tv", id: number, token: string): Promise<string> {
  const res = await fetch(`${TMDB_BASE}/${type}/${id}?language=en-US`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return "";
  const data = await res.json();
  return (data.poster_path as string) ?? "";
}

export async function GET(request: Request) {
  const token = process.env.TMDB_API_KEY;
  if (!token) return NextResponse.json({ posters: {}, tvPosters: {} });

  const { searchParams } = new URL(request.url);

  const movieIds = (searchParams.get("ids")   || "").split(",").map(Number).filter(Boolean);
  const tvIds    = (searchParams.get("tvIds") || "").split(",").map(Number).filter(Boolean);

  const [movieResults, tvResults] = await Promise.all([
    Promise.all(movieIds.map(id => fetchPoster("movie", id, token))),
    Promise.all(tvIds.map(id    => fetchPoster("tv",    id, token))),
  ]);

  const posters:   Record<number, string> = {};
  const tvPosters: Record<number, string> = {};

  movieIds.forEach((id, i) => { if (movieResults[i]) posters[id]   = movieResults[i]; });
  tvIds.forEach(   (id, i) => { if (tvResults[i])    tvPosters[id] = tvResults[i];    });

  return NextResponse.json(
    { posters, tvPosters },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } }
  );
}
