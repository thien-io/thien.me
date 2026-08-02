"use client";

import { useState, useEffect, useCallback } from "react";

const TMDB = "https://image.tmdb.org/t/p";

type Media = {
  id: number; title: string; year: number;
  genre: string; genres: string[];
  rating: number; note: string; poster: string;
  mediaType: "movie" | "tv";
};

// ── Movies ────────────────────────────────────────────────────────────────────
const MOVIES: Media[] = [
  // 2025 / 2026
  { id:1054867, title:"One Battle After Another",       year:2025, genre:"Action / Comedy",      genres:["Action","Comedy","Drama"],      rating:5, poster:"", mediaType:"movie", note:"PTA's best since There Will Be Blood. DiCaprio, Penn, and Del Toro in a bonkers epic. Shot on VistaVision. The funniest serious movie I've seen." },
  { id:1233413, title:"Sinners",                        year:2025, genre:"Horror / Thriller",    genres:["Horror","Thriller"],            rating:5, poster:"", mediaType:"movie", note:"Ryan Coogler fuses blues, vampires, and the Jim Crow South into something wholly original. That juke joint scene may be the sequence of the decade." },
  { id:687163,  title:"Project Hail Mary",              year:2026, genre:"Sci-Fi",               genres:["Sci-Fi"],                       rating:5, poster:"", mediaType:"movie", note:"Ryan Gosling and an alien doing science together. Pure heart. The best sci-fi film in years and Gosling's finest work." },
  { id:1317288, title:"Marty Supreme",                  year:2025, genre:"Drama / Sport",        genres:["Drama","Sport"],                rating:4, poster:"", mediaType:"movie", note:"Safdie's solo debut. Chalamet disappears into a ping-pong obsessive in 1950s New York. Completely unhinged in the best way." },
  { id:507086,  title:"The Fantastic Four: First Steps",year:2025, genre:"Superhero",            genres:["Action","Sci-Fi"],              rating:4, poster:"", mediaType:"movie", note:"Finally a Fantastic Four that works. Retro-futurist aesthetic, great family chemistry, Galactus done right." },
  { id:911430,  title:"F1",                             year:2025, genre:"Action / Sport",       genres:["Action","Sport"],               rating:4, poster:"", mediaType:"movie", note:"Pitt in a cockpit. Kosinski makes Formula One feel as tactile and immediate as Top Gun: Maverick." },
  { id:1061474, title:"Superman",                       year:2025, genre:"Superhero",            genres:["Action","Sci-Fi"],              rating:4, poster:"", mediaType:"movie", note:"Gunn's Superman is warm, earnest, and genuinely fun. Corenswet nails the duality. The DCU is in good hands." },
  { id:696506,  title:"Mickey 17",                      year:2025, genre:"Sci-Fi / Comedy",      genres:["Sci-Fi","Comedy"],              rating:4, poster:"", mediaType:"movie", note:"Bong Joon-ho back in space. Pattinson playing multiple versions of himself. Bonkers, funny, and surprisingly moving." },

  // Lord of the Rings
  { id:120,     title:"The Fellowship of the Ring",     year:2001, genre:"Fantasy / Adventure",  genres:["Fantasy","Drama","Action"],     rating:5, poster:"", mediaType:"movie", note:"The beginning of the greatest trilogy ever made. The Shire, Rivendell, and that first glimpse of Mordor. Pure cinema." },
  { id:121,     title:"The Two Towers",                 year:2002, genre:"Fantasy / Adventure",  genres:["Fantasy","Drama","Action"],     rating:5, poster:"", mediaType:"movie", note:"Helm's Deep. Gollum. The tone darkens and it gets better. The siege sequence is still unmatched in scope." },
  { id:122,     title:"The Return of the King",         year:2003, genre:"Fantasy / Adventure",  genres:["Fantasy","Drama","Action"],     rating:5, poster:"", mediaType:"movie", note:"The ending that earns every one of its emotions. 'My friends, you bow to no one.' Best fantasy film ever made." },

  // Crime & Thrillers
  { id:238,    title:"The Godfather",              year:1972, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"Perfect. The only word that applies." },
  { id:240,    title:"The Godfather Part II",      year:1974, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"Rare case where the sequel equals the original." },
  { id:769,    title:"Goodfellas",                 year:1990, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"The most entertaining crime film ever made. Every scene." },
  { id:1422,   title:"The Departed",               year:2006, genre:"Crime / Thriller",    genres:["Crime","Thriller"],            rating:5, poster:"", mediaType:"movie", note:"Scorsese at his sharpest. That ending." },
  { id:524,    title:"Casino",                     year:1995, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"Scorsese, De Niro, Pesci. Three hours of neon and violence." },
  { id:500,    title:"Reservoir Dogs",             year:1992, genre:"Crime / Thriller",    genres:["Crime","Thriller"],            rating:5, poster:"", mediaType:"movie", note:"Tarantino's debut. Ear scene. 'Stuck in the Middle with You.'" },
  { id:16869,  title:"Inglourious Basterds",       year:2009, genre:"War / Drama",         genres:["War","Drama"],                 rating:5, poster:"", mediaType:"movie", note:"The basement bar scene and the cinema scene. Two of the greatest sequences in modern cinema." },
  { id:68718,  title:"Django Unchained",           year:2012, genre:"Western / Drama",     genres:["Western","Drama"],             rating:5, poster:"", mediaType:"movie", note:"DiCaprio's best performance. Waltz's second-best. Foxx's finest hour." },
  { id:680,    title:"Pulp Fiction",               year:1994, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"Changed what movies could do structurally. Still feels fresh." },
  { id:111,    title:"Scarface",                   year:1983, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:4, poster:"", mediaType:"movie", note:"Al Pacino at maximum. The original excess movie." },
  { id:311,    title:"Once Upon a Time in America",year:1984, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"De Niro. 229 minutes. Leone at his most operatic and devastating. One of the great American crime epics." },
  { id:475557, title:"Joker",                      year:2019, genre:"Crime / Thriller",    genres:["Crime","Thriller","Drama"],    rating:5, poster:"", mediaType:"movie", note:"Phoenix carries every scene. A slow, uncomfortable descent that you can't look away from." },
  { id:640,    title:"Catch Me If You Can",        year:2002, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"DiCaprio and Hanks playing cat and mouse. Spielberg at his most effortless and entertaining." },
  { id:2109,   title:"Rush Hour",                  year:1998, genre:"Action / Comedy",     genres:["Action","Comedy"],             rating:4, poster:"", mediaType:"movie", note:"Chan and Tucker is one of the great comedy pairings. 'Do you understand the words coming out of my mouth?'" },

  // Drama
  { id:278,    title:"The Shawshank Redemption",   year:1994, genre:"Drama",               genres:["Drama"],                       rating:5, poster:"", mediaType:"movie", note:"The ending still lands. Every single time." },
  { id:13,     title:"Forrest Gump",               year:1994, genre:"Drama",               genres:["Drama"],                       rating:5, poster:"", mediaType:"movie", note:"Life is like a box of chocolates. Somehow never gets old." },
  { id:489,    title:"Good Will Hunting",           year:1997, genre:"Drama",               genres:["Drama"],                       rating:5, poster:"", mediaType:"movie", note:"It's not your fault. Damon and Affleck wrote something perfect." },
  { id:550,    title:"Fight Club",                  year:1999, genre:"Drama / Thriller",    genres:["Drama","Thriller"],            rating:5, poster:"", mediaType:"movie", note:"The first rule. The twist. Still polarising." },
  { id:424,    title:"Schindler's List",            year:1993, genre:"Historical Drama",    genres:["Drama","History"],             rating:5, poster:"", mediaType:"movie", note:"Devastating. Watch it once. Remember it forever." },
  { id:57158,  title:"Drive",                       year:2011, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"Almost no dialogue. Pure atmosphere. Gosling at his best." },
  { id:496243, title:"Parasite",                    year:2019, genre:"Thriller / Drama",    genres:["Thriller","Drama"],            rating:5, poster:"", mediaType:"movie", note:"The staircase scene. The basement reveal. Bong Joon-ho." },
  { id:787699, title:"Challengers",                 year:2024, genre:"Drama / Sport",       genres:["Drama","Sport"],               rating:5, poster:"", mediaType:"movie", note:"Tennis has never looked this complicated. Or this good." },
  { id:106646, title:"The Wolf of Wall Street",     year:2013, genre:"Biography / Drama",   genres:["Drama","Comedy"],              rating:4, poster:"", mediaType:"movie", note:"Three hours that feel like ninety minutes." },
  { id:313369, title:"La La Land",                  year:2016, genre:"Musical / Romance",   genres:["Drama","Romance"],             rating:5, poster:"", mediaType:"movie", note:"The ending broke something in me. I haven't fixed it." },
  { id:389,    title:"12 Angry Men",                year:1957, genre:"Drama / Thriller",    genres:["Drama","Thriller"],            rating:5, poster:"", mediaType:"movie", note:"One room. Twelve people. Still riveting." },
  { id:346698, title:"Barbie",                      year:2023, genre:"Comedy / Drama",      genres:["Comedy","Drama"],              rating:4, poster:"", mediaType:"movie", note:"Gerwig made a movie about the patriarchy inside a Mattel product. It works." },
  { id:453,    title:"A Beautiful Mind",            year:2001, genre:"Drama",               genres:["Drama"],                       rating:5, poster:"", mediaType:"movie", note:"Crowe's best. The twist reframes everything without feeling cheap." },
  { id:264644, title:"Room",                        year:2015, genre:"Drama / Thriller",    genres:["Drama","Thriller"],            rating:5, poster:"", mediaType:"movie", note:"Brie Larson's performance. The two-act structure. One of the most emotionally precise films I've seen." },
  { id:59440,  title:"Warrior",                     year:2011, genre:"Drama / Sport",       genres:["Drama","Sport"],               rating:5, poster:"", mediaType:"movie", note:"The most underrated sports movie ever made. Hardy and Edgerton are both heartbreaking." },
  { id:390043, title:"Molly's Game",                year:2017, genre:"Drama / Thriller",    genres:["Drama","Thriller"],            rating:4, poster:"", mediaType:"movie", note:"Sorkin writing at full speed. Chastain carries every scene." },
  { id:2976,   title:"The Talented Mr. Ripley",     year:1999, genre:"Thriller / Drama",    genres:["Thriller","Drama"],            rating:5, poster:"", mediaType:"movie", note:"Damon, Law, Blanchett. Sun-drenched dread. One of the great psychological thrillers." },
  { id:11324,  title:"Shutter Island",              year:2010, genre:"Thriller / Mystery",  genres:["Thriller","Drama"],            rating:4, poster:"", mediaType:"movie", note:"The twist recontextualises everything. First viewing is irreplaceable." },

  // Sci-Fi
  { id:27205,  title:"Inception",                   year:2010, genre:"Sci-Fi / Thriller",   genres:["Sci-Fi","Thriller"],           rating:5, poster:"", mediaType:"movie", note:"The spinning top. Still arguing about it. Nolan's most crowd-pleasing masterwork." },
  { id:157336, title:"Interstellar",                year:2014, genre:"Sci-Fi / Drama",      genres:["Sci-Fi","Drama"],              rating:5, poster:"", mediaType:"movie", note:"The docking scene. The time dilation. Hans Zimmer's organ drone." },
  { id:603,    title:"The Matrix",                  year:1999, genre:"Sci-Fi / Action",     genres:["Sci-Fi","Action"],             rating:5, poster:"", mediaType:"movie", note:"Changed cinema. The lobby scene. The Wachowskis at their peak." },
  { id:348,    title:"Alien",                       year:1979, genre:"Sci-Fi / Horror",     genres:["Sci-Fi","Horror"],             rating:5, poster:"", mediaType:"movie", note:"Still terrifying. Ridley Scott's claustrophobic masterpiece." },
  { id:872585, title:"Oppenheimer",                 year:2023, genre:"Historical Drama",    genres:["Drama","History"],             rating:5, poster:"", mediaType:"movie", note:"Three hours. Cillian Murphy in every frame. The Trinity test." },
  { id:105,    title:"Back to the Future",          year:1985, genre:"Sci-Fi / Comedy",     genres:["Sci-Fi","Comedy"],             rating:5, poster:"", mediaType:"movie", note:"The plot is clockwork perfect. Still the best time travel movie ever written." },

  // Action
  { id:155,    title:"The Dark Knight",             year:2008, genre:"Action / Thriller",   genres:["Action","Thriller"],           rating:5, poster:"", mediaType:"movie", note:"Ledger's Joker is the ceiling. Nothing in the genre comes close." },
  { id:272,    title:"Batman Begins",               year:2005, genre:"Action / Thriller",   genres:["Action","Thriller"],           rating:4, poster:"", mediaType:"movie", note:"The one that made superhero movies serious again. Nolan's origin blueprint." },
  { id:557,    title:"Spider-Man",                  year:2002, genre:"Superhero",           genres:["Action"],                      rating:4, poster:"", mediaType:"movie", note:"Raimi's original. Cheese and all, it holds up. 'With great power...'" },
  { id:98,     title:"Gladiator",                   year:2000, genre:"Action / Epic",       genres:["Action","Drama"],              rating:5, poster:"", mediaType:"movie", note:"Are you not entertained? Russell Crowe's best. Zimmer's score." },
  { id:562,    title:"Die Hard",                    year:1988, genre:"Action / Thriller",   genres:["Action","Thriller"],           rating:5, poster:"", mediaType:"movie", note:"The perfect action movie. Every beat is exactly right. McTiernan's masterpiece." },
  { id:956,    title:"Mission: Impossible III",     year:2006, genre:"Action / Thriller",   genres:["Action","Thriller"],           rating:5, poster:"", mediaType:"movie", note:"The best MI film. Hoffman's villain is terrifying. The bridge sequence is relentless." },
  { id:361743, title:"Top Gun: Maverick",           year:2022, genre:"Action / Drama",      genres:["Action","Drama"],              rating:5, poster:"", mediaType:"movie", note:"Did not expect a sequel to be this good. The best pure action film in a decade." },
  { id:24428,  title:"The Avengers",                year:2012, genre:"Action / Sci-Fi",     genres:["Action","Sci-Fi"],             rating:4, poster:"", mediaType:"movie", note:"The payoff to five years of buildup. The Battle of New York still holds up." },
  { id:96721,  title:"Rush",                        year:2013, genre:"Drama / Sport",       genres:["Drama","Sport","Action"],      rating:5, poster:"", mediaType:"movie", note:"Hemsworth vs Brühl. Richie shoots Formula 1 better than anyone. The Lauda-Hunt rivalry is perfect." },

  // Sport
  { id:9395,   title:"Remember the Titans",         year:2000, genre:"Drama / Sport",       genres:["Drama","Sport"],               rating:4, poster:"", mediaType:"movie", note:"Denzel and a football team. The scene in Gettysburg gets me every time." },
  { id:1367,   title:"Rocky",                       year:1976, genre:"Drama / Sport",       genres:["Drama","Sport"],               rating:5, poster:"", mediaType:"movie", note:"Stallone wrote it in three days. It won Best Picture. Perfect." },

  // Classics
  { id:346,    title:"Seven Samurai",               year:1954, genre:"Drama / Adventure",   genres:["Drama","Action"],              rating:5, poster:"", mediaType:"movie", note:"The template for every ensemble action film since. Kurosawa's peak." },
  { id:1366,   title:"One Flew Over the Cuckoo's Nest", year:1975, genre:"Drama",          genres:["Drama"],                       rating:5, poster:"", mediaType:"movie", note:"Nicholson vs. Nurse Ratched. One of cinema's great battles of will." },
  { id:642,    title:"Butch Cassidy and the Sundance Kid", year:1969, genre:"Western",     genres:["Western","Comedy"],            rating:5, poster:"", mediaType:"movie", note:"Newman and Redford. The best movie friendship ever put on screen." },

  // Animation
  { id:10681,  title:"WALL-E",                      year:2008, genre:"Animation / Sci-Fi",  genres:["Animation","Sci-Fi"],          rating:5, poster:"", mediaType:"movie", note:"The first 40 minutes is near-silent cinema. Pixar's absolute best." },
  { id:862,    title:"Toy Story",                   year:1995, genre:"Animation / Family",  genres:["Animation","Family"],          rating:5, poster:"", mediaType:"movie", note:"Changed everything. Still completely perfect." },
  { id:10193,  title:"Toy Story 3",                 year:2010, genre:"Animation / Family",  genres:["Animation","Family"],          rating:5, poster:"", mediaType:"movie", note:"The furnace. Woody's gang holding hands. A film about growing up that wrecks adults." },
  { id:2062,   title:"Ratatouille",                 year:2007, genre:"Animation / Family",  genres:["Animation","Family"],          rating:5, poster:"", mediaType:"movie", note:"Anyone can cook. The Anton Ego memory sequence is perfect cinema." },
  { id:8587,   title:"The Lion King",               year:1994, genre:"Animation / Family",  genres:["Animation","Family"],          rating:5, poster:"", mediaType:"movie", note:"Circle of Life, Mufasa's death, Be Prepared. Disney's peak." },
  { id:8392,   title:"My Neighbor Totoro",          year:1988, genre:"Animation / Fantasy", genres:["Animation","Fantasy"],         rating:5, poster:"", mediaType:"movie", note:"Miyazaki's gentlest film. Nothing bad happens. Pure warmth." },
  { id:129,    title:"Spirited Away",               year:2001, genre:"Animation / Fantasy", genres:["Animation","Fantasy"],         rating:5, poster:"", mediaType:"movie", note:"The greatest animated film ever made. Not a debate." },
  { id:269149, title:"Zootopia",                    year:2016, genre:"Animation / Comedy",  genres:["Animation","Comedy"],          rating:4, poster:"", mediaType:"movie", note:"Better social commentary than most prestige dramas. And it's about bunnies." },
  { id:1084242,title:"Zootopia 2",                  year:2025, genre:"Animation / Comedy",  genres:["Animation","Comedy"],          rating:4, poster:"", mediaType:"movie", note:"Judy and Nick are back. Picks up without missing a beat." },
  { id:10191,  title:"How to Train Your Dragon",    year:2010, genre:"Animation / Adventure",genres:["Animation","Action"],         rating:4, poster:"", mediaType:"movie", note:"Hiccup and Toothless. The flying sequences are still breathtaking." },
  { id:10674,  title:"Mulan",                       year:1998, genre:"Animation / Adventure",genres:["Animation","Action"],         rating:4, poster:"", mediaType:"movie", note:"Reflection, I'll Make a Man Out of You. Disney's most badass heroine." },
  { id:354912, title:"Coco",                        year:2017, genre:"Animation / Family",  genres:["Animation","Family"],          rating:5, poster:"", mediaType:"movie", note:"The most Pixar movie Pixar has ever made. The last 20 minutes will wreck you." },
  { id:14160,  title:"Up",                          year:2009, genre:"Animation / Drama",   genres:["Animation","Drama"],           rating:5, poster:"", mediaType:"movie", note:"The first 10 minutes are among the greatest short films ever made. The rest isn't bad either." },
  { id:12,     title:"Finding Nemo",                year:2003, genre:"Animation / Family",  genres:["Animation","Family"],          rating:5, poster:"", mediaType:"movie", note:"Pixar doing The Odyssey with fish. The ocean feels real and the ending lands every time." },

  // Harry Potter
  { id:671,   title:"Sorcerer's Stone",             year:2001, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:4, poster:"", mediaType:"movie", note:"The one that started everything. Still magical." },
  { id:672,   title:"Chamber of Secrets",           year:2002, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:3, poster:"", mediaType:"movie", note:"The weakest of the eight but Dobby is irreplaceable." },
  { id:673,   title:"Prisoner of Azkaban",          year:2004, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:5, poster:"", mediaType:"movie", note:"Cuarón's entry. The best one. The time-turner sequence is perfect." },
  { id:674,   title:"Goblet of Fire",               year:2005, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:4, poster:"", mediaType:"movie", note:"The Triwizard Tournament. Voldemort's return. The tone shifts for real." },
  { id:675,   title:"Order of the Phoenix",         year:2007, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:4, poster:"", mediaType:"movie", note:"Umbridge is the most hatable villain. Sirius. The DA." },
  { id:767,   title:"Half-Blood Prince",            year:2009, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:4, poster:"", mediaType:"movie", note:"The cave sequence. Dumbledore's death. The series grows up." },
  { id:12444, title:"Deathly Hallows Pt. 1",        year:2010, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:4, poster:"", mediaType:"movie", note:"The tent scenes. Dobby's death. A quiet, mournful film." },
  { id:12445, title:"Deathly Hallows Pt. 2",        year:2011, genre:"Fantasy",             genres:["Fantasy","Family"],            rating:5, poster:"", mediaType:"movie", note:"The Battle of Hogwarts. Snape's memories. The best ending to a franchise." },
  { id:77,    title:"Memento",                      year:2000, genre:"Thriller / Mystery",  genres:["Thriller","Mystery"],          rating:5, poster:"", mediaType:"movie", note:"Nolan's most purely clever film. Gets better every rewatch." },
  { id:1359,  title:"American Psycho",              year:2000, genre:"Thriller",            genres:["Thriller","Drama"],            rating:5, poster:"", mediaType:"movie", note:"Bale is operating in a different dimension. Business card scene forever." },
  { id:598,   title:"City of God",                  year:2002, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"", mediaType:"movie", note:"The most kinetic crime film ever made. Rocket and Lil Zé are unforgettable." },
  { id:24,    title:"Kill Bill: Vol. 1",             year:2003, genre:"Action / Thriller",   genres:["Action","Thriller"],           rating:5, poster:"", mediaType:"movie", note:"Anime sequence. The Crazy 88. Relentless, beautiful violence." },
  { id:105,   title:"Back to the Future",           year:1985, genre:"Sci-Fi / Comedy",     genres:["Sci-Fi","Comedy"],             rating:5, poster:"", mediaType:"movie", note:"The plot is clockwork perfect. Still the best time travel movie ever written." },
];

// ── TV Shows ──────────────────────────────────────────────────────────────────
const SHOWS: Media[] = [
  { id:1396,  title:"Breaking Bad",              year:2008, genre:"Crime / Drama",       genres:["Crime","Drama","Thriller"],    rating:5, poster:"", mediaType:"tv", note:"The greatest TV drama ever made. Walter White's transformation is still unmatched in television history." },
  { id:1399,  title:"Game of Thrones",           year:2011, genre:"Fantasy / Drama",     genres:["Fantasy","Drama","Action"],    rating:5, poster:"", mediaType:"tv", note:"Seasons 1-4 were television at its absolute peak. Nothing before or since has felt like it." },
  { id:76331, title:"Succession",                year:2018, genre:"Drama / Comedy",      genres:["Drama","Comedy"],              rating:5, poster:"", mediaType:"tv", note:"The sharpest writing on TV. Every Roy is awful in a different and brilliant way." },
  { id:2316,  title:"The Office",                year:2005, genre:"Comedy",              genres:["Comedy"],                      rating:5, poster:"", mediaType:"tv", note:"Six perfect seasons. Michael Scott is one of the great comedic characters ever written. That's what she said." },
  { id:19885, title:"Sherlock",                  year:2010, genre:"Crime / Drama",       genres:["Crime","Drama","Mystery"],     rating:5, poster:"", mediaType:"tv", note:"Cumberbatch and Freeman. The first two series are as good as TV gets. The Game is On." },
  { id:1044,  title:"Planet Earth",              year:2006, genre:"Documentary",         genres:["Documentary"],                 rating:5, poster:"", mediaType:"tv", note:"Attenborough's narration. The cinematography. Makes you feel small in the best way." },
  { id:246,   title:"Avatar: The Last Airbender",year:2005, genre:"Animation / Fantasy", genres:["Animation","Fantasy","Action"],rating:5, poster:"", mediaType:"tv", note:"The best animated series ever made. The world-building, the character arcs, the finale. All of it." },
  { id:97546, title:"Ted Lasso",                 year:2020, genre:"Comedy / Drama",      genres:["Comedy","Drama"],              rating:5, poster:"", mediaType:"tv", note:"The most optimistic thing on TV. Believe." },
  { id:43082, title:"Key & Peele",               year:2012, genre:"Comedy",              genres:["Comedy"],                      rating:5, poster:"", mediaType:"tv", note:"The greatest sketch comedy of its generation. East/West Bowl alone justifies its existence." },
  { id:713,   title:"Chappelle's Show",          year:2003, genre:"Comedy",              genres:["Comedy"],                      rating:5, poster:"", mediaType:"tv", note:"Two seasons of the most fearless comedy ever put on TV. Chappelle was untouchable." },
  { id:1621,  title:"Boardwalk Empire",          year:2010, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:4, poster:"", mediaType:"tv", note:"Nucky Thompson's Atlantic City. Buscemi, Shannon, and HBO at full budget. Criminally underrated." },
  { id:1405,  title:"Dexter",                    year:2006, genre:"Crime / Thriller",    genres:["Crime","Thriller","Drama"],    rating:4, poster:"", mediaType:"tv", note:"Seasons 1-4 are brilliant. Hall's performance carries the whole thing." },
  { id:1420,  title:"New Girl",                  year:2011, genre:"Comedy",              genres:["Comedy"],                      rating:4, poster:"", mediaType:"tv", note:"Schmidt alone is worth the watch. The kind of sitcom that sneaks up on you." },
  { id:12971, title:"Dragon Ball Z",              year:1989, genre:"Animation / Action",  genres:["Animation","Action"],          rating:4, poster:"", mediaType:"tv", note:"Grew up with this. The Frieza and Cell sagas defined what anime could be." },
];

// ── Deduplicate (Back to the Future was added twice) ─────────────────────────
const DEDUPED_MOVIES = MOVIES.filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);

// ── Filters ───────────────────────────────────────────────────────────────────
type SortKey = "year" | "rating" | "title";
type FilterKey = "All" | "Action" | "Animation" | "Comedy" | "Crime" | "Documentary" | "Drama" | "Family" | "Fantasy" | "History" | "Horror" | "Mystery" | "Romance" | "Sci-Fi" | "Sport" | "Thriller" | "War" | "Western";

const MOVIE_FILTERS: FilterKey[] = ["All","Action","Animation","Comedy","Crime","Drama","Family","Fantasy","History","Horror","Mystery","Romance","Sci-Fi","Sport","Thriller","War","Western"];
const TV_FILTERS:    FilterKey[] = ["All","Action","Animation","Comedy","Crime","Documentary","Drama","Fantasy","Mystery","Thriller"];

const STARS = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

const GENRE_COLORS: Record<string, string> = {
  Action:      "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25",
  Animation:   "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/25",
  Comedy:      "bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/25",
  Crime:       "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/25",
  Documentary: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25",
  Drama:       "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25",
  Family:      "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/25",
  Fantasy:     "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
  History:     "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
  Horror:      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25",
  Mystery:     "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25",
  Romance:     "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/25",
  "Sci-Fi":    "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25",
  Sport:       "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  Thriller:    "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
  War:         "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/25",
  Western:     "bg-orange-600/10 text-orange-800 dark:text-orange-500 border-orange-600/25",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function MoviesPage() {
  const [active, setActive]   = useState<Media | null>(null);
  const [flipped, setFlipped] = useState(false);

  const [movieSort,   setMovieSort]   = useState<SortKey>("year");
  const [movieDir,    setMovieDir]    = useState<"asc"|"desc">("desc");
  const [movieFilter, setMovieFilter] = useState<FilterKey>("All");
  const [tvFilter,    setTvFilter]    = useState<FilterKey>("All");

  const [freshPosters,   setFreshPosters]   = useState<Record<number, string>>({});
  const [freshTVPosters, setFreshTVPosters] = useState<Record<number, string>>({});

  useEffect(() => {
    const movieIds = DEDUPED_MOVIES.map(m => m.id).join(",");
    const tvIds    = SHOWS.map(s => s.id).join(",");
    fetch(`/api/movies?ids=${movieIds}&tvIds=${tvIds}`)
      .then(r => r.json())
      .then(data => {
        if (data.posters)   setFreshPosters(data.posters);
        if (data.tvPosters) setFreshTVPosters(data.tvPosters);
      })
      .catch(() => {});
  }, []);

  const close = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setActive(null), 650);
  }, []);

  const open = useCallback((m: Media) => {
    setActive(m);
    setFlipped(false);
    setTimeout(() => setFlipped(true), 80);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  const toggleMovieSort = (k: SortKey) => {
    if (movieSort === k) setMovieDir(d => d === "asc" ? "desc" : "asc");
    else { setMovieSort(k); setMovieDir(k === "title" ? "asc" : "desc"); }
  };

  const movieList = [...DEDUPED_MOVIES]
    .filter(m => movieFilter === "All" || m.genres.includes(movieFilter))
    .sort((a, b) => {
      const d = movieSort === "year"   ? a.year - b.year
              : movieSort === "rating" ? a.rating - b.rating
              : a.title.localeCompare(b.title);
      return movieDir === "asc" ? d : -d;
    });

  const tvList = [...SHOWS]
    .filter(s => tvFilter === "All" || s.genres.includes(tvFilter))
    .sort((a, b) => b.rating - a.rating || b.year - a.year);

  const posterUrl = (m: Media, size: "w342" | "w500" | "original") => {
    const path = m.mediaType === "tv"
      ? (freshTVPosters[m.id] ?? m.poster)
      : (freshPosters[m.id]   ?? m.poster);
    return path ? `${TMDB}/${size}${path}` : "";
  };

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative px-8 md:px-16 pt-28 pb-10 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden">
          <span className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]">watch</span>
        </div>
        <div className="relative z-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Movies & TV</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Films I&apos;ve<br /><em className="text-primary">loved.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Films and shows I keep coming back to.
          </p>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* ── Movie controls ──────────────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-5 flex flex-wrap gap-2 items-center border-b border-border/30">
        <div className="flex gap-1.5 items-center">
          <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mr-1">Sort</span>
          {(["year","rating","title"] as SortKey[]).map(k => (
            <button key={k} onClick={() => toggleMovieSort(k)}
              className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${movieSort === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"}`}>
              {k}{movieSort === k ? (movieDir === "desc" ? " ↓" : " ↑") : ""}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-border/50 mx-1 hidden sm:block" />
        <div className="flex flex-wrap gap-1.5">
          {MOVIE_FILTERS.map(f => (
            <button key={f} onClick={() => setMovieFilter(f)}
              className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all ${movieFilter === f ? "border-foreground bg-foreground text-background" : (f !== "All" && GENRE_COLORS[f]) ? GENRE_COLORS[f] : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"}`}>
              {f}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] text-muted-foreground/40 ml-auto">{movieList.length}</span>
      </div>

      {/* ── Movie grid ──────────────────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
          {movieList.map(movie => (
            <button key={movie.id} onClick={() => open(movie)}
              className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label={movie.title}>
              <div className="relative w-full rounded-lg overflow-hidden border border-border/30 bg-muted shadow-sm" style={{ paddingBottom: "150%" }}>
                <div className="absolute inset-0">
                  {posterUrl(movie, "w342") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={posterUrl(movie, "w342")} alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-muted animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 gap-0.5">
                    <span className="font-mono text-[9px] text-amber-400 leading-tight">{STARS(movie.rating)}</span>
                    <span className="font-mono text-[8px] text-white/70 leading-tight">{movie.year}</span>
                  </div>
                </div>
              </div>
              <p className="font-mono text-[8px] text-muted-foreground mt-1.5 truncate leading-tight px-0.5">{movie.title}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/50 mx-8 md:mx-16 mt-8" />

      {/* ── TV Shows ────────────────────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-5 flex flex-wrap gap-2 items-center border-b border-border/30">
        <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mr-2">TV</span>
        <div className="flex flex-wrap gap-1.5">
          {TV_FILTERS.map(f => (
            <button key={f} onClick={() => setTvFilter(f)}
              className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all ${tvFilter === f ? "border-foreground bg-foreground text-background" : (f !== "All" && GENRE_COLORS[f]) ? GENRE_COLORS[f] : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"}`}>
              {f}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] text-muted-foreground/40 ml-auto">{tvList.length}</span>
      </div>

      <div className="px-8 md:px-16 py-8 pb-20">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
          {tvList.map(show => (
            <button key={show.id} onClick={() => open(show)}
              className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label={show.title}>
              <div className="relative w-full rounded-lg overflow-hidden border border-border/30 bg-muted shadow-sm" style={{ paddingBottom: "150%" }}>
                <div className="absolute inset-0">
                  {posterUrl(show, "w342") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={posterUrl(show, "w342")} alt={show.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-muted animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 gap-0.5">
                    <span className="font-mono text-[9px] text-amber-400 leading-tight">{STARS(show.rating)}</span>
                    <span className="font-mono text-[8px] text-white/70 leading-tight">{show.year}</span>
                  </div>
                </div>
              </div>
              <p className="font-mono text-[8px] text-muted-foreground mt-1.5 truncate leading-tight px-0.5">{show.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Card flip overlay ───────────────────────────────────────────────── */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 bg-background/95 backdrop-blur-lg"
          onClick={close}
        >
          {/* 3-D scene wrapper */}
          <div
            className="relative"
            style={{ perspective: "1400px" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Flip card */}
            <div
              className={`card-flip-inner relative cursor-pointer${flipped ? " is-flipped" : ""}`}
              onClick={() => setFlipped(f => !f)}
              style={{
                width: "min(300px, 82vw)",
                height: "min(450px, calc(82vw * 1.5))",
              }}
            >
              {/* FRONT — full poster */}
              <div className="card-face rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted">
                {posterUrl(active, "w500") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={posterUrl(active, "w500")}
                    alt={active.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-muted-foreground/20" />
                  </div>
                )}
              </div>

              {/* BACK — info */}
              <div className="card-face card-back rounded-2xl overflow-hidden border border-border shadow-2xl bg-card flex flex-col p-6 md:p-7">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  {active.year} · {active.genre}
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-light text-foreground mb-2 leading-tight">
                  {active.title}
                </h2>
                <p className="font-mono text-sm text-primary mb-4">
                  {STARS(active.rating)}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm flex-1 overflow-y-auto">
                  {active.note}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/40">
                  {active.genres.map(g => (
                    <span key={g} className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${GENRE_COLORS[g] ?? "text-muted-foreground bg-muted border-border/50"}`}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Close */}
            <button onClick={close}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/30 flex items-center justify-center transition-all font-mono text-sm shadow-lg z-10">
              ✕
            </button>
          </div>
        </div>
      )}

      <style suppressHydrationWarning>{`
        .card-flip-inner {
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-flip-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
