const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64")
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=50`
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/me/playlists?limit=50`

export async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token!,
    }),
  })

  return response.json()
}

export async function getTopTracks() {
  const { access_token } = await getAccessToken()

  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  return response.json()
}

export async function getPlaylists() {
  const { access_token } = await getAccessToken()

  const response = await fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  return response.json()
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken()

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (response.status === 204 || response.status > 400) {
    return { isPlaying: false }
  }

  const data = await response.json()

  return {
    isPlaying: data.is_playing,
    title: data.item?.name,
    artist: data.item?.artists?.map((_artist: any) => _artist.name).join(", "),
    album: data.item?.album?.name,
    albumImageUrl: data.item?.album?.images?.[0]?.url,
    songUrl: data.item?.external_urls?.spotify,
    progress_ms: data.progress_ms || 0,
    duration_ms: data.item?.duration_ms || 0,
  }
}
