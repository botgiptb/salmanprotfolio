"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Plus, Trash2, Save, Film, Briefcase, Wrench,
  BarChart2, Lock, Eye, EyeOff, Pencil, X, Check,
  GripVertical, Upload, ImageIcon, Link2, Globe2, ExternalLink,
  ChevronLeft, ChevronRight, FolderPlus, AlertCircle
} from "lucide-react";

/* ─── Types ──────────────────────────────────────── */
interface GalleryProject {
  id: number;
  category: string;
  companyName: string;
  description: string;
  coverImage: string;
  images: string[];
}
interface GalleryData  { categories: string[]; projects: GalleryProject[]; }
interface Service      { id: number; title: string; description: string; accent: string; skills: string[]; }
interface Skill        { id: number; name: string; pct: number; }
interface ToolItem     { id: number; name: string; cat: string; level: string; }
interface Social       { behance: string; instagram: string; youtube: string; linkedin: string; }
interface SiteData {
  gallery:  GalleryData;
  services: Service[];
  skills:   Skill[];
  toolkit:  ToolItem[];
  social:   Social;
}

/* ─── Helpers ─────────────────────────────────────── */
const TABS = [
  { key: "portfolio", label: "Gallery",   icon: Film },
  { key: "services",  label: "Services",  icon: Briefcase },
  { key: "skills",    label: "Skills",    icon: BarChart2 },
  { key: "toolkit",   label: "Toolkit",   icon: Wrench },
  { key: "social",    label: "Social",    icon: Globe2 },
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
            if (r.ok) r.json().then((d) => { setData(normalise(d)); setAuthed(true); });
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
      setData(normalise(d)); setAuthed(true);
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
        const res = await r.json().catch(() => ({}));
        if (res.github) {
          alert("Saved! Changes committed to GitHub. Vercel will rebuild your site in ~1–2 minutes.");
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const err = await r.json().catch(() => ({}));
        alert(`Failed to save: ${err.error || r.statusText}`);
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : String(err)}`);
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
          {tab === "portfolio" && <GalleryPanel  data={data} setData={setData} />}
          {tab === "services"  && <ServicesPanel  data={data} setData={setData} />}
          {tab === "skills"    && <SkillsPanel    data={data} setData={setData} />}
          {tab === "toolkit"   && <ToolkitPanel   data={data} setData={setData} />}
          {tab === "social"    && <SocialPanel    data={data} setData={setData} />}
        </main>
      </div>
    </div>
  );
}

/* ── Normalise legacy data shape ─────────────────── */
function normalise(d: Record<string, unknown>): SiteData {
  const rawGallery = (d.gallery as any) ?? { categories: [], projects: [], works: [] };
  
  // Migrate legacy 'works' array if it exists and 'projects' doesn't
  let projectsList: GalleryProject[] = [];
  if (Array.isArray(rawGallery.projects)) {
    projectsList = rawGallery.projects;
  } else if (Array.isArray(rawGallery.works)) {
    // Basic automatic grouping of old flat works into showcase projects
    const grouped: Record<string, string[]> = {};
    rawGallery.works.forEach((w: any) => {
      if (w.category && w.image) {
        if (!grouped[w.category]) grouped[w.category] = [];
        grouped[w.category].push(w.image);
      }
    });
    projectsList = Object.keys(grouped).map((cat, idx) => ({
      id: 1000 + idx,
      category: cat,
      companyName: `${cat} Portfolio Showcase`,
      description: `A showcase of my recent client work and conceptual layouts for ${cat}.`,
      coverImage: grouped[cat][0] ?? "",
      images: grouped[cat]
    }));
  }

  return {
    gallery: {
      categories: rawGallery.categories ?? [],
      projects: projectsList
    },
    services: (d.services as Service[])  ?? [],
    skills:   (d.skills   as Skill[])    ?? [],
    toolkit:  (d.toolkit  as ToolItem[]) ?? [],
    social:   (d.social   as Social)     ?? { behance: "", instagram: "", youtube: "", linkedin: "" },
  };
}

/* ══════════════════════════════════════════════════
   GALLERY PANEL
══════════════════════════════════════════════════ */
type UploadItem = { name: string; status: "uploading" | "done" | "error"; };

function GalleryPanel({ data, setData }: { data: SiteData; setData: (d: SiteData) => void }) {
  const gallery = data.gallery ?? { categories: [], projects: [] };
  const [activeCat, setActiveCat]     = useState<string>(gallery.categories[0] ?? "");
  const [newCat, setNewCat]           = useState("");
  
  // Modal editor states for single project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage]   = useState("");
  const [images, setImages]           = useState<string[]>([]);
  const [uploads, setUploads]         = useState<UploadItem[]>([]);
  const [dragging, setDragging]       = useState(false);
  
  const coverFileRef                  = useRef<HTMLInputElement>(null);
  const galleryFilesRef               = useRef<HTMLInputElement>(null);

  /* keep activeCat in sync when categories change */
  useEffect(() => {
    if (!gallery.categories.includes(activeCat) && gallery.categories.length > 0) {
      setActiveCat(gallery.categories[0]);
    }
  }, [gallery.categories]);

  const catProjects = (gallery.projects ?? []).filter((p) => p.category === activeCat);

  // Add category
  function addCategory() {
    const v = newCat.trim();
    if (!v || gallery.categories.includes(v)) return;
    const updated = { ...gallery, categories: [...gallery.categories, v], projects: gallery.projects ?? [] };
    setData({ ...data, gallery: updated });
    setActiveCat(v);
    setNewCat("");
  }

  // Delete category
  function deleteCategory(cat: string) {
    const projectsList = gallery.projects ?? [];
    const count = projectsList.filter((p) => p.category === cat).length;
    const msg = count > 0
      ? `Delete "${cat}" and its ${count} project${count > 1 ? "s" : ""}? This cannot be undone.`
      : `Delete category "${cat}"?`;
    if (!confirm(msg)) return;
    const categories = gallery.categories.filter((c) => c !== cat);
    const projects   = projectsList.filter((p) => p.category !== cat);
    setData({ ...data, gallery: { categories, projects } });
    setActiveCat(categories[0] ?? "");
  }

  // Rename category
  function renameCategory(oldCat: string) {
    const newName = prompt(`Rename category "${oldCat}" to:`, oldCat);
    if (!newName) return;
    const v = newName.trim();
    if (!v || oldCat === v) return;
    if (gallery.categories.includes(v)) {
      alert(`A category named "${v}" already exists.`);
      return;
    }
    const categories = gallery.categories.map((c) => c === oldCat ? v : c);
    const projects   = (gallery.projects ?? []).map((p) =>
      p.category === oldCat ? { ...p, category: v } : p
    );
    setData({
      ...data,
      gallery: { categories, projects }
    });
    if (activeCat === oldCat) {
      setActiveCat(v);
    }
  }

  // Open modal to add a project
  function handleAddProject() {
    setEditingProjectId(null);
    setCompanyName("");
    setDescription("");
    setCoverImage("");
    setImages([]);
    setUploads([]);
    setIsModalOpen(true);
  }

  // Open modal to edit a project
  function handleEditProject(proj: GalleryProject) {
    setEditingProjectId(proj.id);
    setCompanyName(proj.companyName);
    setDescription(proj.description ?? "");
    setCoverImage(proj.coverImage ?? "");
    setImages(proj.images ?? []);
    setUploads([]);
    setIsModalOpen(true);
  }

  // Delete project
  function deleteProject(id: number) {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    setData({
      ...data,
      gallery: {
        ...gallery,
        projects: (gallery.projects ?? []).filter((p) => p.id !== id)
      }
    });
  }

  // Move project up/down (reordering)
  function moveProject(id: number, dir: -1 | 1) {
    const projList = (gallery.projects ?? []).filter((p) => p.category === activeCat);
    const others   = (gallery.projects ?? []).filter((p) => p.category !== activeCat);
    const idx      = projList.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= projList.length) return;
    const next = [...projList];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setData({
      ...data,
      gallery: {
        ...gallery,
        projects: [...others, ...next]
      }
    });
  }

  // Handle Cover Image Upload
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "same-origin" });
      const json = await res.json();
      if (res.ok) {
        setCoverImage(json.url);
      } else {
        alert(`Failed to upload cover: ${json.error}`);
      }
    } catch {
      alert("Failed to upload cover due to network error.");
    }
  }

  // Handle Gallery Files Upload
  async function handleGalleryFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    
    const startIdx = uploads.length;
    setUploads((prev) => [...prev, ...arr.map((f) => ({ name: f.name, status: "uploading" as const }))]);

    const newUrls: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "same-origin" });
        const json = await res.json();
        if (res.ok) {
          newUrls.push(json.url);
          setUploads((prev) => prev.map((u, idx) => idx === startIdx + i ? { ...u, status: "done" as const } : u));
        } else {
          setUploads((prev) => prev.map((u, idx) => idx === startIdx + i ? { ...u, status: "error" as const } : u));
        }
      } catch {
        setUploads((prev) => prev.map((u, idx) => idx === startIdx + i ? { ...u, status: "error" as const } : u));
      }
    }

    if (newUrls.length > 0) {
      setImages((prev) => [...prev, ...newUrls]);
    }
    setTimeout(() => setUploads([]), 3000);
  }

  // Reorder images within project
  function moveImage(idx: number, dir: -1 | 1) {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= images.length) return;
    const next = [...images];
    [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
    setImages(next);
  }

  // Delete image from project
  function deleteImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  // Save Project in CMS State
  function handleSaveProject() {
    const company = companyName.trim();
    if (!company) {
      alert("Please enter a project name.");
      return;
    }

    const projectsList = gallery.projects ?? [];
    let updatedProjects: GalleryProject[];

    if (editingProjectId === null) {
      const newProj: GalleryProject = {
        id: Date.now(),
        category: activeCat,
        companyName: company,
        description: description.trim(),
        coverImage: coverImage || (images[0] ?? ""),
        images: images
      };
      updatedProjects = [...projectsList, newProj];
    } else {
      updatedProjects = projectsList.map((p) =>
        p.id === editingProjectId
          ? {
              ...p,
              companyName: company,
              description: description.trim(),
              coverImage: coverImage || (images[0] ?? ""),
              images: images
            }
          : p
      );
    }

    setData({
      ...data,
      gallery: {
        ...gallery,
        projects: updatedProjects
      }
    });
    setIsModalOpen(false);
  }

  /* Drag & Drop */
  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true); }
  function onDragLeave()                   { setDragging(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    handleGalleryFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <PanelHeader title="Gallery Projects" />
          <p className="text-zinc-400 text-xs font-heading mt-1">
            Manage projects per category. Each project holds a cover, description, and multiple uploaded images.
          </p>
        </div>
        {gallery.categories.length > 0 && (
          <button
            onClick={handleAddProject}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-purple text-zinc-100 font-heading font-black text-xs hover:bg-violet-500 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {gallery.categories.map((cat) => (
          <div key={cat} className="flex items-center gap-1 group">
            <button
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${activeCat === cat ? "bg-brand-purple text-zinc-100" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
            >
              {cat}
              <span className="ml-2 text-[9px] opacity-60">
                {(gallery.projects ?? []).filter((p) => p.category === cat).length}
              </span>
            </button>
            <button
              onClick={() => renameCategory(cat)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-brand-cyan hover:bg-brand-cyan/20 transition-all cursor-pointer"
              title={`Rename ${cat}`}
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={() => deleteCategory(cat)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition-all cursor-pointer"
              title={`Delete ${cat}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add new category */}
        <div className="flex items-center gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="New category..."
            className="w-36 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 placeholder-zinc-700 text-xs font-heading focus:outline-none focus:border-brand-cyan/50"
          />
          <button
            onClick={addCategory}
            disabled={!newCat.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan font-heading font-black text-xs hover:bg-brand-cyan/30 cursor-pointer transition-all disabled:opacity-40"
          >
            <FolderPlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {gallery.categories.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
          <FolderPlus className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 font-heading font-bold text-xs uppercase tracking-widest">Create a category to start adding projects</p>
        </div>
      ) : catProjects.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-800/60 rounded-2xl">
          <ImageIcon className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 font-heading font-bold text-xs uppercase tracking-widest">
            No projects in {activeCat} yet
          </p>
          <p className="text-zinc-500 text-[11px] font-heading mt-1 mb-4">Click "New Project" above to create one</p>
        </div>
      ) : (
        /* Project list grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catProjects.map((proj, i) => {
            const imgCount = proj.images?.length ?? 0;
            return (
              <div key={proj.id} className="group relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4 flex flex-col justify-between hover:border-brand-purple/40 transition-colors">
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/60 mb-4 relative">
                    {proj.coverImage ? (
                      <img src={proj.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                        <ImageIcon className="w-8 h-8 text-zinc-800" />
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/85 text-[9px] font-heading font-black text-zinc-300 tracking-wider">
                      {imgCount} photo{imgCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h4 className="font-display font-black text-base text-zinc-200 truncate">{proj.companyName}</h4>
                  <p className="text-zinc-500 text-xs font-sans mt-1 line-clamp-2 leading-relaxed h-8">
                    {proj.description || "No description provided."}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-900">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => moveProject(proj.id, -1)}
                      disabled={i === 0}
                      className="p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-zinc-550 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                    </button>
                    <button
                      onClick={() => moveProject(proj.id, 1)}
                      disabled={i === catProjects.length - 1}
                      className="p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-zinc-550 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProject(proj)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-355 font-heading font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-900/20 text-red-400 cursor-pointer transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal editor */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950">
                <div>
                  <h3 className="font-display font-black text-zinc-200 text-lg uppercase tracking-wider">
                    {editingProjectId === null ? "Create Project" : "Edit Project"}
                  </h3>
                  <p className="text-zinc-450 text-[10px] font-heading mt-0.5 uppercase tracking-widest">
                    Category: <span className="text-brand-purple">{activeCat}</span>
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Form Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Project / Company Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Nike Commercial, Apex Branding"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-brand-purple/50 text-sm font-heading"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe the company project, scope of work, and key results..."
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-brand-purple/50 text-sm font-heading resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Cover Image (Leave empty to use first gallery image)</label>
                      <input
                        ref={coverFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                      {coverImage ? (
                        <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-zinc-800 bg-zinc-900/40 w-44">
                          <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCoverImage("")}
                            className="absolute top-2 right-2 p-1 rounded bg-black/80 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => coverFileRef.current?.click()}
                          className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40 cursor-pointer w-44 transition-colors"
                        >
                          <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                          <span className="text-[10px] font-heading font-black text-brand-cyan uppercase tracking-wider">Upload Cover</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Gallery Uploads */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Project Gallery Photos</label>
                    <div
                      onClick={() => galleryFilesRef.current?.click()}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-dashed cursor-pointer transition-all ${dragging ? "border-brand-purple bg-brand-purple/10" : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40"}`}
                    >
                      <input
                        ref={galleryFilesRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleGalleryFiles(e.target.files)}
                      />
                      <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                      <p className="text-xs font-heading font-bold text-zinc-400 text-center">
                        <span className="text-brand-cyan">Click to browse</span> or drag images here
                      </p>
                    </div>

                    {uploads.length > 0 && (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {uploads.map((u, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-[10px]">
                            {u.status === "uploading" && <div className="w-3 h-3 rounded-full border border-brand-purple border-t-transparent animate-spin" />}
                            {u.status === "done" && <Check className="w-3 h-3 text-emerald-400" />}
                            {u.status === "error" && <AlertCircle className="w-3 h-3 text-red-400" />}
                            <span className="text-zinc-500 truncate flex-1 font-heading">{u.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2.5 max-h-[30vh] overflow-y-auto pr-1">
                        {images.map((img, idx) => (
                          <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => deleteImage(idx)}
                                className="p-1 rounded bg-red-950/80 border border-red-900/60 text-red-400 hover:bg-red-900 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, -1)}
                                  disabled={idx === 0}
                                  className="p-1 rounded bg-zinc-900/80 border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, 1)}
                                  disabled={idx === images.length - 1}
                                  className="p-1 rounded bg-zinc-900/80 border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <span className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[8px] font-heading font-black text-zinc-500">
                              {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center border border-dashed border-zinc-900 rounded-xl">
                        <ImageIcon className="w-6 h-6 text-zinc-800 mx-auto mb-2" />
                        <p className="text-zinc-750 font-heading font-bold text-[10px] uppercase tracking-wider">Gallery is empty</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-zinc-900 bg-zinc-950 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-550 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="flex-1 py-3 rounded-xl bg-brand-purple text-zinc-100 font-heading font-black text-xs uppercase tracking-wider hover:bg-violet-500 cursor-pointer transition-colors"
                >
                  Save Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      {editing && <ServiceModal service={editing} onSave={saveService} onClose={() => setEditing(null)} />}
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
            <div className="flex-1"><FormField label="Accent Colour (hex)" value={s.accent} onChange={(v) => setS({ ...s, accent: v })} placeholder="#8b5cf6" /></div>
            <div className="mt-5 w-10 h-10 rounded-lg border border-zinc-800" style={{ background: s.accent }} />
          </div>
          <FormField label="Toolkit (comma-separated)" value={skillStr} onChange={setSkillStr} placeholder="After Effects, Premiere Pro" />
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
   SOCIAL PANEL
══════════════════════════════════════════════════ */
function SocialPanel({ data, setData }: { data: SiteData; setData: (d: SiteData) => void }) {
  const social = data.social ?? { behance: "", instagram: "", youtube: "", linkedin: "" };

  function update(field: keyof typeof social, val: string) {
    setData({ ...data, social: { ...social, [field]: val } });
  }

  const fields: { key: keyof typeof social; label: string; placeholder: string; color: string }[] = [
    { key: "behance",   label: "Behance",   placeholder: "https://www.behance.net/yourprofile",  color: "text-[#1769ff]" },
    { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/yourhandle", color: "text-[#e1306c]" },
    { key: "youtube",   label: "YouTube",   placeholder: "https://www.youtube.com/@yourchannel", color: "text-[#ff0000]" },
    { key: "linkedin",  label: "LinkedIn",  placeholder: "https://www.linkedin.com/in/yourname", color: "text-[#0077b5]" },
  ];

  return (
    <div>
      <PanelHeader title="Social Links" />
      <p className="text-zinc-600 text-xs font-heading mt-2 mb-8">Links appear as icon buttons in the Contact section of your portfolio.</p>
      <div className="space-y-5 max-w-lg">
        {fields.map(({ key, label, placeholder, color }) => (
          <div key={key} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center gap-3 mb-3">
              <Globe2 className={`w-4 h-4 ${color}`} />
              <span className={`font-heading font-black text-sm ${color}`}>{label}</span>
              {social[key] && (
                <a href={social[key]} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-[10px] font-heading text-zinc-600 hover:text-zinc-300 transition-colors">
                  Preview <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              value={social[key]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-700 text-sm font-heading focus:outline-none focus:border-brand-purple/50 transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Shared UI ────────────────────────────────────── */
function PanelHeader({ title, count, onAdd }: { title: string; count?: number; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display font-black text-xl text-zinc-100 tracking-tight">{title}</h2>
        {count !== undefined && <p className="text-zinc-600 text-xs font-heading mt-0.5">{count} item{count !== 1 ? "s" : ""}</p>}
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
