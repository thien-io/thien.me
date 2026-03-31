import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";

// Use hardcoded TMDB IDs — exact, no search ambiguity
const MOVIES = [
  { key: "The Shawshank Redemption",          id: 278   },
  { key: "The Godfather",                      id: 238   },
  { key: "The Dark Knight",                    id: 155   },
  { key: "The Godfather Part II",              id: 240   },
  { key: "12 Angry Men",                       id: 389   },
  { key: "Schindler's List",                   id: 424   },
  { key: "The Lord of the Rings The Return of the King", id: 122 },
  { key: "Pulp Fiction",                       id: 680   },
  { key: "Inception",                          id: 27205 },
  { key: "The Matrix",                         id: 603   },
  { key: "Goodfellas",                         id: 769   },
  { key: "Interstellar",                       id: 157336 },
  { key: "The Silence of the Lambs",           id: 274   },
  { key: "The Departed",                       id: 1422  },
  { key: "Saving Private Ryan",                id: 857   },
  { key: "Forrest Gump",                       id: 13    },
  { key: "Good Will Hunting",                  id: 489   },
  { key: "Fight Club",                         id: 550   },
  { key: "Spirited Away",                      id: 129   },
  { key: "The Wolf of Wall Street",            id: 106646 },
  { key: "Parasite",                           id: 496243 },
  { key: "Drive",                              id: 57158 },
  { key: "La La Land",                         id: 313369 },
  { key: "Spider-Man Into the Spider-Verse",   id: 324857 },
  { key: "Avengers Infinity War",              id: 299536 },
  { key: "Captain America Civil War",          id: 271110 },
  { key: "Crazy Stupid Love",                  id: 56867 },
  { key: "All Quiet on the Western Front",     id: 765245 },
  { key: "Past Lives",                         id: 952402 },
  { key: "Challengers",                        id: 787699 },
  { key: "Poor Things",                        id: 792307 },
  { key: "Avatar",                             id: 19995 },
  { key: "Superman",                           id: 1924  },
];

async function fetchPoster(id: number, apiKey: string): Promise<string> {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return "";
  const data = await res.json();
  if (!data.poster_path) return "";
  return `${TMDB_IMG}${data.poster_path}`;
}

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    const posters: Record<string, string> = {};
    for (const m of MOVIES) posters[m.key] = "";
    return NextResponse.json({ posters }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const results = await Promise.all(
    MOVIES.map(async (m) => ({
      key: m.key,
      poster: await fetchPoster(m.id, apiKey),
    }))
  );

  const posters: Record<string, string> = {};
  for (const r of results) posters[r.key] = r.poster;

  return NextResponse.json(
    { posters },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } }
  );
}
