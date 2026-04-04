"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Player {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
}

interface Match {
  id: string;
  score: string;
  played_at: string;
  winner: { id: string; name: string; rank: number };
  loser:  { id: string; name: string; rank: number };
}

interface Location {
  id: string;
  slug: string;
  name: string;
}

interface Submission {
  id: string;
  score: string;
  played_at: string;
  submitter_name: string | null;
  status: string;
  winner: { id: string; name: string; rank: number };
  loser:  { id: string; name: string; rank: number };
}

// ─── Auth screen ──────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }: { onAuth: (key: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!pw.trim()) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        sessionStorage.setItem("admin-key", pw);
        onAuth(pw);
      } else {
        setErr("Wrong password.");
      }
    } catch {
      setErr("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Admin</p>
          <h1 className="font-display text-3xl font-light">Ladder Admin</h1>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {err && <p className="font-mono text-xs text-red-400">{err}</p>}
          <button
            onClick={submit}
            disabled={loading || !pw.trim()}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {loading ? "Checking..." : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Ladder admin panel for one location ─────────────────────────────────────

function LocationPanel({ slug, name, adminKey }: { slug: string; name: string; adminKey: string }) {
  const [players, setPlayers]         = useState<Player[]>([]);
  const [matches, setMatches]         = useState<Match[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [actioning, setActioning]     = useState<string | null>(null);

  // Add player
  const [newName, setNewName]     = useState("");
  const [newRank, setNewRank]     = useState("");
  const [addingP, setAddingP]     = useState(false);
  const [addPErr, setAddPErr]     = useState("");

  // Edit rank inline
  const [editRanks, setEditRanks] = useState<Record<string, string>>({});
  const [savingRank, setSavingRank] = useState<string | null>(null);

  // Add match
  const [mWinner, setMWinner]     = useState("");
  const [mLoser,  setMLoser]      = useState("");
  const [mScore,  setMScore]      = useState("");
  const [mDate,   setMDate]       = useState(new Date().toISOString().split("T")[0]);
  const [addingM, setAddingM]     = useState(false);
  const [addMErr, setAddMErr]     = useState("");

  const headers = { "Content-Type": "application/json", "x-admin-key": adminKey };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pd, md, sd] = await Promise.all([
        fetch(`/api/ladder/${slug}/players`).then(r => r.json()),
        fetch(`/api/ladder/${slug}/matches`).then(r => r.json()),
        fetch(`/api/ladder/${slug}/submissions`, { headers: { "x-admin-key": adminKey } }).then(r => r.json()),
      ]);
      setPlayers(pd.players ?? []);
      setMatches(md.matches ?? []);
      setSubmissions(sd.submissions ?? []);
      // Init edit rank inputs
      const ranks: Record<string, string> = {};
      for (const p of (pd.players ?? [])) ranks[p.id] = String(p.rank);
      setEditRanks(ranks);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function addPlayer() {
    if (!newName.trim()) return;
    setAddingP(true); setAddPErr("");
    try {
      const r = await fetch(`/api/ladder/${slug}/players`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: newName.trim(), rank: newRank ? parseInt(newRank) : undefined }),
      });
      const d = await r.json();
      if (!r.ok) { setAddPErr(d.error ?? "Error"); return; }
      setNewName(""); setNewRank("");
      await fetchAll();
    } catch { setAddPErr("Request failed"); } finally { setAddingP(false); }
  }

  async function deletePlayer(id: string, playerName: string) {
    if (!confirm(`Delete ${playerName}? This cannot be undone.`)) return;
    await fetch(`/api/ladder/${slug}/players/${id}`, { method: "DELETE", headers });
    await fetchAll();
  }

  async function saveRank(id: string) {
    const val = parseInt(editRanks[id] ?? "");
    if (isNaN(val) || val < 1) return;
    setSavingRank(id);
    try {
      await fetch(`/api/ladder/${slug}/players/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ rank: val }),
      });
      await fetchAll();
    } finally { setSavingRank(null); }
  }

  async function addMatch() {
    if (!mWinner || !mLoser || !mScore.trim()) { setAddMErr("All fields required"); return; }
    if (mWinner === mLoser) { setAddMErr("Winner and loser must be different"); return; }
    setAddingM(true); setAddMErr("");
    try {
      const r = await fetch(`/api/ladder/${slug}/matches`, {
        method: "POST",
        headers,
        body: JSON.stringify({ winner_id: mWinner, loser_id: mLoser, score: mScore, played_at: mDate }),
      });
      const d = await r.json();
      if (!r.ok) { setAddMErr(d.error ?? "Error"); return; }
      setMWinner(""); setMLoser(""); setMScore("");
      setMDate(new Date().toISOString().split("T")[0]);
      await fetchAll();
    } catch { setAddMErr("Request failed"); } finally { setAddingM(false); }
  }

  async function deleteMatch(id: string) {
    if (!confirm("Delete this match result?")) return;
    await fetch(`/api/ladder/${slug}/matches/${id}`, { method: "DELETE", headers });
    await fetchAll();
  }

  async function actionSubmission(id: string, action: "approve" | "deny") {
    setActioning(id);
    try {
      await fetch(`/api/ladder/${slug}/submissions/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ action }),
      });
      await fetchAll();
    } finally {
      setActioning(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-muted animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ── Pending submissions ─────────────────────────────────────────── */}
      {submissions.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            Pending score submissions
            <span className="bg-primary text-primary-foreground font-mono text-[9px] px-1.5 py-0.5 rounded-full">
              {submissions.length}
            </span>
          </p>
          <div className="space-y-3">
            {submissions.map(s => (
              <div key={s.id} className="border border-border rounded-xl bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-green-500">{s.winner.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">def.</span>
                    <span className="text-sm text-muted-foreground">{s.loser.name}</span>
                    <span className="font-mono text-xs text-foreground ml-1">{s.score}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(s.played_at + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {s.submitter_name && (
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        submitted by {s.submitter_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => actionSubmission(s.id, "approve")}
                    disabled={actioning === s.id}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-[10px] tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    {actioning === s.id ? "…" : "Approve"}
                  </button>
                  <button
                    onClick={() => actionSubmission(s.id, "deny")}
                    disabled={actioning === s.id}
                    className="px-3 py-1.5 rounded-lg border border-border font-mono text-[10px] text-muted-foreground hover:text-red-400 hover:border-red-400/30 disabled:opacity-40 transition-colors"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Players ─────────────────────────────────────────────────────── */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Players · {players.length}
        </p>

        {/* Add player form */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            placeholder="Player name"
            maxLength={60}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addPlayer()}
            className="flex-1 min-w-40 px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            placeholder="Rank #"
            type="number"
            min={1}
            value={newRank}
            onChange={e => setNewRank(e.target.value)}
            className="w-20 px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={addPlayer}
            disabled={addingP || !newName.trim()}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {addingP ? "Adding…" : "+ Add"}
          </button>
        </div>
        {addPErr && <p className="font-mono text-xs text-red-400 mb-3">{addPErr}</p>}

        {/* Players table */}
        {players.length === 0 ? (
          <p className="font-mono text-xs text-muted-foreground/50">No players yet.</p>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">Rank</th>
                  <th className="text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">Name</th>
                  <th className="text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">W</th>
                  <th className="text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">L</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.id} className={`border-b border-border/50 last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          value={editRanks[p.id] ?? p.rank}
                          onChange={e => setEditRanks(r => ({ ...r, [p.id]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && saveRank(p.id)}
                          className="w-12 px-2 py-1 rounded-lg border border-input bg-background font-mono text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => saveRank(p.id)}
                          disabled={savingRank === p.id}
                          className="font-mono text-[9px] text-primary hover:opacity-70 disabled:opacity-40 transition-opacity"
                        >
                          {savingRank === p.id ? "…" : "set"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-xs text-green-500">{p.wins}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-xs text-red-400/80">{p.losses}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => deletePlayer(p.id, p.name)}
                        className="font-mono text-[9px] text-muted-foreground/50 hover:text-red-400 transition-colors"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add match ───────────────────────────────────────────────────── */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Record match
        </p>
        <div className="border border-border rounded-xl bg-card p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">Winner</label>
              <select
                value={mWinner}
                onChange={e => setMWinner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">— select player —</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>#{p.rank} {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">Loser</label>
              <select
                value={mLoser}
                onChange={e => setMLoser(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">— select player —</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>#{p.rank} {p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">Score</label>
              <input
                placeholder="e.g. 6-3, 7-5"
                value={mScore}
                onChange={e => setMScore(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1.5">Date played</label>
              <input
                type="date"
                value={mDate}
                onChange={e => setMDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          {addMErr && <p className="font-mono text-xs text-red-400">{addMErr}</p>}
          <button
            onClick={addMatch}
            disabled={addingM || !mWinner || !mLoser || !mScore.trim()}
            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {addingM ? "Saving…" : "Record match"}
          </button>
        </div>
      </div>

      {/* ── Match history ───────────────────────────────────────────────── */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Match history · {matches.length}
        </p>
        {matches.length === 0 ? (
          <p className="font-mono text-xs text-muted-foreground/50">No matches recorded yet.</p>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">Date</th>
                  <th className="text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">Winner</th>
                  <th className="text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">Loser</th>
                  <th className="text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 py-2.5">Score</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={m.id} className={`border-b border-border/50 last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(m.played_at + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-2.5 text-green-500 font-medium">{m.winner.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.loser.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{m.score}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => deleteMatch(m.id)}
                        className="font-mono text-[9px] text-muted-foreground/50 hover:text-red-400 transition-colors"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main admin page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [adminKey, setAdminKey]     = useState<string | null>(null);
  const [locations, setLocations]   = useState<Location[]>([]);
  const [locLoading, setLocLoading] = useState(true);
  const [activeTab, setActiveTab]   = useState<string | null>(null);

  // Create ladder
  const [newLocName, setNewLocName] = useState("");
  const [newLocSlug, setNewLocSlug] = useState("");
  const [creating, setCreating]     = useState(false);
  const [createErr, setCreateErr]   = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-key");
    if (saved) setAdminKey(saved);
  }, []);

  const fetchLocations = useCallback(async (selectSlug?: string) => {
    setLocLoading(true);
    try {
      const r = await fetch("/api/ladder/locations");
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      const locs: Location[] = d.locations ?? [];
      setLocations(locs);
      setActiveTab(prev => {
        if (selectSlug && locs.find(l => l.slug === selectSlug)) return selectSlug;
        if (prev && locs.find(l => l.slug === prev)) return prev;
        return locs[0]?.slug ?? null;
      });
    } catch (e) {
      console.error("fetchLocations error", e);
    } finally {
      setLocLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) fetchLocations();
  }, [adminKey, fetchLocations]);

  if (!adminKey) {
    return <AuthScreen onAuth={setAdminKey} />;
  }

  const activeLoc = locations.find(l => l.slug === activeTab);
  const headers = { "Content-Type": "application/json", "x-admin-key": adminKey };

  async function createLadder() {
    if (!newLocName.trim() || !newLocSlug.trim()) { setCreateErr("Name and slug required"); return; }
    setCreating(true); setCreateErr("");
    try {
      const r = await fetch("/api/ladder/locations", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: newLocName.trim(), slug: newLocSlug.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setCreateErr(d.error ?? "Error"); return; }
      setNewLocName(""); setNewLocSlug(""); setShowCreate(false);
      await fetchLocations(d.location.slug);
    } catch { setCreateErr("Request failed"); } finally { setCreating(false); }
  }

  async function deleteLadder(loc: Location) {
    if (!confirm(`Delete "${loc.name}" and ALL its players and matches? This cannot be undone.`)) return;
    await fetch(`/api/ladder/locations/${loc.id}`, { method: "DELETE", headers });
    await fetchLocations();
  }


  // Auto-generate slug from name
  function handleNameChange(val: string) {
    setNewLocName(val);
    setNewLocSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }

  return (
    <div>
      <section className="px-8 md:px-16 pt-10 pb-6 md:pt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Admin</p>
            <h1 className="font-display text-4xl font-light">Ladder Admin</h1>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("admin-key"); setAdminKey(null); }}
            className="font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Location tabs + create */}
        {locLoading ? (
          <div className="flex gap-1.5 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-7 w-28 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 mt-2 items-center">
            {locations.map(loc => (
              <div key={loc.slug} className="flex items-center gap-0.5 group">
                <button
                  onClick={() => setActiveTab(loc.slug)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all ${
                    activeTab === loc.slug
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {loc.name}
                </button>
                {/* Delete ladder button — only visible on hover */}
                <button
                  onClick={() => deleteLadder(loc)}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-md text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title={`Delete ${loc.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* New ladder button */}
            <button
              onClick={() => setShowCreate(v => !v)}
              className="px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider border border-dashed border-border text-muted-foreground/50 hover:text-primary hover:border-primary/40 transition-all"
            >
              + New ladder
            </button>
          </div>
        )}

        {/* Create ladder form */}
        {showCreate && (
          <div className="mt-4 p-4 rounded-xl border border-border bg-card space-y-3 max-w-md">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">New ladder</p>
            <div className="flex gap-2 flex-wrap">
              <input
                placeholder="Location name"
                value={newLocName}
                onChange={e => handleNameChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createLadder()}
                maxLength={100}
                className="flex-1 min-w-36 px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                placeholder="slug"
                value={newLocSlug}
                onChange={e => setNewLocSlug(e.target.value)}
                maxLength={60}
                className="w-36 px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <p className="font-mono text-[9px] text-muted-foreground/50">
              URL will be: /ladder/<span className="text-foreground">{newLocSlug || "slug"}</span>
            </p>
            {createErr && <p className="font-mono text-xs text-red-400">{createErr}</p>}
            <div className="flex gap-2">
              <button
                onClick={createLadder}
                disabled={creating || !newLocName.trim() || !newLocSlug.trim()}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                {creating ? "Creating…" : "Create"}
              </button>
              <button
                onClick={() => { setShowCreate(false); setCreateErr(""); setNewLocName(""); setNewLocSlug(""); }}
                className="px-4 py-2 rounded-xl border border-border font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-10 md:py-14">
        {!activeLoc ? (
          <p className="font-mono text-sm text-muted-foreground/50">
            {locations.length === 0 ? "No ladders yet. Create one above." : "Select a ladder above."}
          </p>
        ) : (
          <LocationPanel
            key={activeTab!}
            slug={activeLoc.slug}
            name={activeLoc.name}
            adminKey={adminKey}
          />
        )}
      </section>
    </div>
  );
}
