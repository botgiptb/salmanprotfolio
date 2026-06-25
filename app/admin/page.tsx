"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LogOut, Plus, Trash2, Save, Film, Briefcase, Wrench,
  BarChart2, ChevronDown, ChevronUp, Lock, Eye, EyeOff,
  Layers, Pencil, X, Check, GripVertical
} from "lucide-react";

/* ─── Types ──────────────────────────────────────── */
interface Project {
  id: number; title: string; category: string; client: string;
  software: string[]; videoUrl: string; thumbnail: string; description: string;
}
interface Service {
  id: number; title: string; description: string; accent: string; skills: string[];
}
interface Skill { id: number; name: string; pct: number; }
interface ToolItem { id: number; name: string; cat: string; level: string; }
interface SiteData {
  portfolio: Project[]; categories: string[];
  services: Service[]; skills: Skill[]; toolkit: ToolItem[];
}

/* ─── Helpers ─────────────────────────────────────── */
const TABS = [
  { key: "portfolio", label: "Portfolio",  icon: Film },
  { key: "services",  label: "Services",   icon: Briefcase },
  { key: "skills",    label: "Skills",     icon: BarChart2 },
  { key: "toolkit",   label: "Toolkit",    icon: Wrench },
  { key: "categories",label: "Categories", icon: Layers },
] as const;
type Tab = typeof TABS[number]["key"];

const LEVELS = ["Expert", "Advanced", "Intermediate", "Beginner"];

function newId(arr: { id: number }[]) {
  return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
}

/* ─── Main Component ─────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed]     = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [authErr, setAuthErr]   = useState("");
  const [loading, setLoading]   = useState(false);

  const [data, setData]     = useState<SiteData | null>(null);
  const [tab, setTab]       = useState<Tab>("portfolio");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  /* Check existing session */
  useEffect(() => {
    fetch("/api/auth", { credentials: "same-origin" })
      .then((r) => r.json().catch(() => ({ authed: false })))
      .then((res) => {
        if (res.authed) {
          fetch("/api/data", { credentials: "same-origin" }).then((r) => {
            if (r.ok) r.json().then((d) => { setData(d); setAuthed(true); });
          });
        }
      })
      .catch(() => {});
  }, []);

  /* Login */
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setAuthErr("");
    const r = await fetch("/api/auth", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ password }),
      credentials: "same-origin"
    });
    if (r.ok) {
      const d = await fetch("/api/data", { credentials: "same-origin" }).then((r) => r.json());
      setData(d); setAuthed(true);
    } else {
      setAuthErr("Incorrect password. Try again.");
    }
    setLoading(false);
  }

  /* Logout */
  async function logout() {
    await fetch("/api/auth", { method: "DELETE", credentials: "same-origin" });
    setAuthed(false); setData(null);
  }

  /* Save */
  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    try {
      const r = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "same-origin"
      });
      if (r.ok) {
        const resData = await r.json().catch(() => ({}));
        if (resData.github) {
          alert("Success! Changes committed to GitHub. Vercel will rebuild your site automatically (this usually takes 1-2 minutes to show up on the live site).");
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const errData = await r.json().catch(() => ({}));
        alert(`Failed to save changes: ${errData.error || r.statusText || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Network error saving changes: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  }, [data]);

  /* ── Login Screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050507] px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 mb-5">
              <Lock className="w-6 h-6 text-brand-purple" />
            </div>
            <h1 className="text-2xl font-display font-black text-zinc-100 mb-1">ADMIN PANEL</h1>
            <p className="text-xs font-heading text-zinc-600 uppercase tracking-widest">Salman Studio CMS</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 text-sm font-heading"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authErr && <p className="text-xs text-red-400 font-heading text-center">{authErr}</p>}
            <button
              type="submit" disabled={loading || !password}
              className="w-full py-3.5 rounded-xl bg-brand-purple font-heading font-black text-sm text-zinc-100 hover:bg-violet-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Enter Dashboard"}
            </button>
          </form>
          <p className="text-center text-[10px] text-zinc-700 mt-6 font-heading">Default password: salman2024</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="flex items-center justify-center h-screen text-zinc-500">Loading data...</div>;

  /* ── Dashboard ── */
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-[#050507]/95 backdrop-blur border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-purple/25 border border-brand-purple/40 flex items-center justify-center">
            <span className="text-brand-purple font-display font-black text-xs">S</span>
          </div>
          <span className="font-display font-black text-sm text-zinc-200 tracking-widest">STUDIO CMS</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-[10px] font-heading font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors">
            View Site ↗
          </a>
          <button
            onClick={save}
            disabled={saving}
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-heading font-black text-[10px] md:text-xs uppercase tracking-wider transition-all cursor-pointer ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/30"}`}
          >
            {saved ? <><Check className="w-3 h-3 md:w-3.5 md:h-3.5" />Saved!</> : saving ? "Saving..." : <><Save className="w-3 h-3 md:w-3.5 md:h-3.5" />Save Changes</>}
          </button>
          <button onClick={logout} className="p-2 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900 transition-all cursor-pointer" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible w-full md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-zinc-900 py-3 md:py-6 px-4 md:px-3 gap-2 md:gap-1 scrollbar-none">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-xl text-left font-heading font-bold text-[10px] md:text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${tab === key ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Panel content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {tab === "portfolio"  && <PortfolioPanel  data={data} setData={setData} />}
          {tab === "services"   && <ServicesPanel   data={data} setData={setData} />}
          {tab === "skills"     && <SkillsPanel     data={data} setData={setData} />}
          {tab === "toolkit"    && <ToolkitPanel    data={data} setData={setData} />}
          {tab === "categories" && <CategoriesPanel data={data} setData={setData} />}
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PORTFOLIO PANEL
══════════════════════════════════════════════════ */
function PortfolioPanel({ data, setData }: { data: SiteData; setData: (d: SiteData) => void }) {
  const [editing, setEditing] = useState<Project | null>(null);

  function saveProject(p: Project) {
    const exists = data.portfolio.find((x) => x.id === p.id);
    const portfolio = exists
      ? data.portfolio.map((x) => (x.id === p.id ? p : x))
      : [...data.portfolio, p];
    setData({ ...data, portfolio });
    setEditing(null);
  }

  function deleteProject(id: number) {
    if (!confirm("Delete this project?")) return;
    setData({ ...data, portfolio: data.portfolio.filter((x) => x.id !== id) });
  }

  return (
    <div>
      <PanelHeader title="Portfolio Works" count={data.portfolio.length} onAdd={() => setEditing({ id: newId(data.portfolio), title: "", category: data.categories[0] ?? "", client: "", software: [], videoUrl: "", thumbnail: "", description: "" })} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {data.portfolio.map((p) => (
          <div key={p.id} className="rounded-2xl bg-zinc-950/60 border border-zinc-800/60 overflow-hidden group">
            <div className="aspect-video relative">
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">No image</div>
              )}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[9px] font-heading font-bold text-brand-cyan">{p.category}</span>
            </div>
            <div className="p-4">
              <h3 className="font-heading font-black text-sm text-zinc-100 truncate">{p.title || "Untitled"}</h3>
              <p className="text-zinc-600 text-[11px] mt-0.5 mb-3">{p.client}</p>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-heading font-bold text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-all">
                  <Pencil className="w-3 h-3" />Edit
                </button>
                <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-900 cursor-pointer transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProjectModal
          project={editing}
          categories={data.categories}
          onSave={saveProject}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function ProjectModal({ project, categories, onSave, onClose }: { project: Project; categories: string[]; onSave: (p: Project) => void; onClose: () => void }) {
  const [p, setP] = useState<Project>(project);
  const [sw, setSw] = useState(project.software.join(", "));

  function handleSave() {
    onSave({ ...p, software: sw.split(",").map((s) => s.trim()).filter(Boolean) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(139,92,246,0.15)]">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="font-heading font-black text-sm text-zinc-100 uppercase tracking-wider">{project.title ? "Edit Project" : "New Project"}</h2>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <FormField label="Title" value={p.title} onChange={(v) => setP({ ...p, title: v })} />
          <div>
            <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Category</label>
            <select value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-heading focus:outline-none focus:border-brand-purple/50">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <FormField label="Client" value={p.client} onChange={(v) => setP({ ...p, client: v })} />
          <FormField label="Thumbnail URL" value={p.thumbnail} onChange={(v) => setP({ ...p, thumbnail: v })} placeholder="https://..." />
          <FormField label="Video URL (Vimeo embed, optional)" value={p.videoUrl} onChange={(v) => setP({ ...p, videoUrl: v })} placeholder="https://player.vimeo.com/video/..." />
          <FormField label="Software (comma-separated)" value={sw} onChange={setSw} placeholder="After Effects, Nuke, Blender" />
          <div>
            <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Description</label>
            <textarea value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-heading focus:outline-none focus:border-brand-purple/50 resize-none" />
          </div>
          {p.thumbnail && (
            <div className="aspect-video rounded-lg overflow-hidden border border-zinc-800">
              <img src={p.thumbnail} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t border-zinc-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-zinc-800 text-zinc-500 font-heading font-bold text-sm hover:text-zinc-300 cursor-pointer">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-brand-purple text-zinc-100 font-heading font-black text-sm hover:bg-violet-500 cursor-pointer transition-colors">Save Project</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SERVICES PANEL
══════════════════════════════════════════════════ */
function ServicesPanel({ data, setData }: { data: SiteData; setData: (d: SiteData) => void }) {
  const [editing, setEditing] = useState<Service | null>(null);

  function saveService(s: Service) {
    const exists = data.services.find((x) => x.id === s.id);
    const services = exists ? data.services.map((x) => (x.id === s.id ? s : x)) : [...data.services, s];
    setData({ ...data, services });
    setEditing(null);
  }

  return (
    <div>
      <PanelHeader title="Services" count={data.services.length} onAdd={() => setEditing({ id: newId(data.services), title: "", description: "", accent: "#8b5cf6", skills: [] })} />
      <div className="space-y-3 mt-6">
        {data.services.map((s) => (
          <div key={s.id} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: s.accent }} />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-black text-sm text-zinc-100">{s.title || "Untitled"}</h3>
              <p className="text-zinc-500 text-[11px] mt-0.5 line-clamp-2">{s.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {s.skills.map((sk) => <span key={sk} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-heading text-zinc-400">{sk}</span>)}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(s)} className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-200 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => setData({ ...data, services: data.services.filter((x) => x.id !== s.id) })} className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <ServiceModal service={editing} onSave={saveService} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function ServiceModal({ service, onSave, onClose }: { service: Service; onSave: (s: Service) => void; onClose: () => void }) {
  const [s, setS] = useState(service);
  const [skillStr, setSkillStr] = useState(service.skills.join(", "));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-[0_0_60px_rgba(139,92,246,0.15)]">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="font-heading font-black text-sm text-zinc-100 uppercase tracking-wider">{service.title ? "Edit Service" : "New Service"}</h2>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <FormField label="Title" value={s.title} onChange={(v) => setS({ ...s, title: v })} />
          <div>
            <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Description</label>
            <textarea value={s.description} onChange={(e) => setS({ ...s, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-heading focus:outline-none focus:border-brand-purple/50 resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FormField label="Accent Colour (hex)" value={s.accent} onChange={(v) => setS({ ...s, accent: v })} placeholder="#8b5cf6" />
            </div>
            <div className="mt-5 w-10 h-10 rounded-lg border border-zinc-800" style={{ background: s.accent }} />
          </div>
          <FormField label="Toolkit (comma-separated)" value={skillStr} onChange={setSkillStr} placeholder="After Effects, Nuke" />
        </div>
        <div className="flex gap-3 p-5 border-t border-zinc-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-zinc-800 text-zinc-500 font-heading font-bold text-sm cursor-pointer">Cancel</button>
          <button onClick={() => onSave({ ...s, skills: skillStr.split(",").map((x) => x.trim()).filter(Boolean) })} className="flex-1 py-2.5 rounded-lg bg-brand-purple text-zinc-100 font-heading font-black text-sm hover:bg-violet-500 cursor-pointer transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SKILLS PANEL
══════════════════════════════════════════════════ */
function SkillsPanel({ data, setData }: { data: SiteData; setData: (d: SiteData) => void }) {
  function update(id: number, field: keyof Skill, val: string | number) {
    setData({ ...data, skills: data.skills.map((s) => s.id === id ? { ...s, [field]: val } : s) });
  }
  function add() {
    setData({ ...data, skills: [...data.skills, { id: newId(data.skills), name: "NEW SKILL", pct: 80 }] });
  }

  return (
    <div>
      <PanelHeader title="Skill Bars" count={data.skills.length} onAdd={add} />
      <div className="space-y-4 mt-6">
        {data.skills.map((s) => (
          <div key={s.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center gap-3 mb-3">
              <GripVertical className="w-4 h-4 text-zinc-700 shrink-0" />
              <input
                value={s.name}
                onChange={(e) => update(s.id, "name", e.target.value.toUpperCase())}
                className="flex-1 bg-transparent font-heading font-black text-sm text-zinc-200 focus:outline-none border-b border-zinc-800 focus:border-brand-purple/50 pb-0.5"
              />
              <span className="font-heading font-black text-sm text-brand-cyan w-10 text-right">{s.pct}%</span>
              <button onClick={() => setData({ ...data, skills: data.skills.filter((x) => x.id !== s.id) })} className="text-zinc-700 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
            <input
              type="range" min={0} max={100} value={s.pct}
              onChange={(e) => update(s.id, "pct", parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full accent-brand-purple cursor-pointer"
            />
            <div className="mt-2 h-[3px] rounded-full bg-zinc-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full transition-all" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TOOLKIT PANEL
══════════════════════════════════════════════════ */
function ToolkitPanel({ data, setData }: { data: SiteData; setData: (d: SiteData) => void }) {
  function update(id: number, field: keyof ToolItem, val: string) {
    setData({ ...data, toolkit: data.toolkit.map((t) => t.id === id ? { ...t, [field]: val } : t) });
  }
  function add() {
    setData({ ...data, toolkit: [...data.toolkit, { id: newId(data.toolkit), name: "", cat: "", level: "Expert" }] });
  }

  return (
    <div>
      <PanelHeader title="Creative Toolkit" count={data.toolkit.length} onAdd={add} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        {data.toolkit.map((t) => (
          <div key={t.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <input
                value={t.name}
                onChange={(e) => update(t.id, "name", e.target.value)}
                placeholder="Software name"
                className="flex-1 bg-transparent font-heading font-black text-sm text-zinc-200 focus:outline-none border-b border-zinc-800 focus:border-brand-purple/50 pb-0.5"
              />
              <button onClick={() => setData({ ...data, toolkit: data.toolkit.filter((x) => x.id !== t.id) })} className="ml-3 text-zinc-700 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <input
              value={t.cat}
              onChange={(e) => update(t.id, "cat", e.target.value)}
              placeholder="Category"
              className="w-full bg-transparent font-heading text-xs text-zinc-500 focus:outline-none border-b border-zinc-900 focus:border-brand-purple/30 pb-0.5"
            />
            <select
              value={t.level}
              onChange={(e) => update(t.id, "level", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs font-heading text-zinc-400 focus:outline-none cursor-pointer"
            >
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CATEGORIES PANEL
══════════════════════════════════════════════════ */
function CategoriesPanel({ data, setData }: { data: SiteData; setData: (d: SiteData) => void }) {
  const [newCat, setNewCat] = useState("");

  function add() {
    const v = newCat.trim();
    if (!v || data.categories.includes(v)) return;
    setData({ ...data, categories: [...data.categories, v] });
    setNewCat("");
  }

  return (
    <div>
      <PanelHeader title="Portfolio Categories" count={data.categories.length} />
      <p className="text-zinc-600 text-xs font-heading mt-2 mb-6">Categories appear as filter tabs on the Portfolio section.</p>
      <div className="space-y-2 mb-6">
        {data.categories.map((c) => (
          <div key={c} className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="font-heading font-bold text-sm text-zinc-200">{c}</span>
            <button onClick={() => setData({ ...data, categories: data.categories.filter((x) => x !== c) })} className="text-zinc-700 hover:text-red-400 cursor-pointer transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add new category..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-700 text-sm font-heading focus:outline-none focus:border-brand-cyan/50"
        />
        <button onClick={add} className="px-4 py-2.5 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan font-heading font-black text-sm hover:bg-brand-cyan/30 cursor-pointer transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ── Shared UI pieces ─────────────────────────────── */
function PanelHeader({ title, count, onAdd }: { title: string; count: number; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display font-black text-xl text-zinc-100 tracking-tight">{title}</h2>
        <p className="text-zinc-600 text-xs font-heading mt-0.5">{count} item{count !== 1 ? "s" : ""}</p>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple/20 border border-brand-purple/30 text-brand-purple font-heading font-black text-xs uppercase tracking-wider hover:bg-brand-purple/30 cursor-pointer transition-all">
          <Plus className="w-3.5 h-3.5" />Add New
        </button>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-700 text-sm font-heading focus:outline-none focus:border-brand-purple/50 transition-colors"
      />
    </div>
  );
}
