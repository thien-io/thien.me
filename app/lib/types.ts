export type Views = {
  total: number
}
export type Likes = {
  total: number
}

export type Song = {
  songUrl: string
  artist: string
  title: string
}

export type NowPlayingSong = {
  album: string
  albumImageUrl: string
  artist: string
  isPlaying: boolean
  songUrl: string
  title: string
}

export type TopTracks = {
  tracks: Song[]
}

export type GitHub = {
  stars: number
}

export type Article = {
  title: string
  tags?: any
  name: string
  coverImage: string
  summary: string
  publishedDate?: any
  lastUpdatedDate?: any
}

export type Snippet = {
  title: string
  tags?: any
  coverImage: string
  summary: string
  publishedDate?: any
  lastUpdatedDate?: any
}

export type Language =
  | 'markup'
  | 'bash'
  | 'clike'
  | 'c'
  | 'cpp'
  | 'css'
  | 'javascript'
  | 'jsx'
  | 'coffeescript'
  | 'actionscript'
  | 'css-extr'
  | 'diff'
  | 'git'
  | 'go'
  | 'graphql'
  | 'handlebars'
  | 'json'
  | 'less'
  | 'makefile'
  | 'markdown'
  | 'objectivec'
  | 'ocaml'
  | 'python'
  | 'reason'
  | 'sass'
  | 'scss'
  | 'sql'
  | 'stylus'
  | 'tsx'
  | 'typescript'
  | 'wasm'
  | 'yaml'

export interface IRepo {
  name: string
  html_url: string
  description: string
  created_at: string
  updated_at: string
  homepage: string
  stargazers_count: number
  watchers_count: number
  language: string
  forks_count: number
  license: {
    spdx_id: string
  }
  owner: {
    login: string
  }
}

export interface IGithubUser {
  login: string
  avatar_url: string
  html_url: string
  name: string
  company: string
  blog: string
  location: string
  email: string
  bio: string
  public_repos: number
  followers: number
  totalStarsAndForks: {
    stars: number
    forks: number
  }
}
export type Reactions = {
  like_count: number
  love_count: number
  clap_count: number
  party_count: number
}

export type GithubSortOptions = 'stars' | 'forks' | 'upd'

export type Movie = {
  title: string
  tags?: string[]
  coverImage: string
  summary: string
  publishedDate?: any
  lastUpdatedDate?: any
}
