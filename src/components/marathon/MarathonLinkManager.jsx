"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Languages, Link as LinkIcon, RefreshCw, Sigma } from "lucide-react";
import { getAdminMarathonLinks, updateAdminMarathonLink } from "@/lib/api";
import { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

export default function MarathonLinkManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await getAdminMarathonLinks();
      setLinks(payload?.data || []);
    } catch (err) {
      setError(err.message || "Unable to load Marathon links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getAdminMarathonLinks()
      .then((payload) => active && setLinks(payload?.data || []))
      .catch((err) => active && setError(err.message || "Unable to load Marathon links."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);
  const updateLocal = (section, fields) => setLinks((current) => current.map((item) => item.section === section ? { ...item, ...fields } : item));

  const save = async (item) => {
    setSaving(item.section);
    setError("");
    setMessage("");
    try {
      const payload = await updateAdminMarathonLink(item.section, { url: item.url, isPublished: item.isPublished });
      updateLocal(item.section, payload.data);
      setMessage(`${item.title} link saved${payload.data.isPublished ? " and published" : ""}.`);
    } catch (err) {
      setError(err.message || "Unable to save this Marathon link.");
    } finally {
      setSaving("");
    }
  };

  return (
    <section className="rounded-3xl border border-cyan-300/18 bg-[#101620] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Marathon</p><h2 className="mt-2 text-2xl font-semibold text-white">Live Link Publisher</h2><p className="mt-2 text-sm text-[#8E8A9F]">Publish or hide each section instantly. Any secure HTTPS class link is accepted.</p></div>
        <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-semibold"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </div>
      {loading ? <div className="mt-6 h-36 animate-pulse rounded-2xl bg-white/5" /> : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {links.map((item) => {
            const Icon = item.section === "english" ? Languages : Sigma;
            return (
              <article key={item.section} className="rounded-2xl border border-white/7 bg-[#0B1018] p-4">
                <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 font-bold text-white"><Icon className="h-4 w-4 text-cyan-300" /> {item.title}</span><span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${item.isPublished ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : "border-white/8 bg-white/4 text-[#8E8A9F]"}`}>{item.isPublished ? "Published" : "Hidden"}</span></div>
                <label className="mt-4 block"><span className="flex items-center gap-2 text-xs font-semibold text-[#AAB3C5]"><LinkIcon className="h-3.5 w-3.5" /> Class link</span><input type="url" value={item.url || ""} onChange={(event) => updateLocal(item.section, { url: event.target.value })} placeholder="https://..." className="mt-2 w-full rounded-xl border border-white/8 bg-[#121925] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" /></label>
                <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-white"><input type="checkbox" checked={Boolean(item.isPublished)} onChange={(event) => updateLocal(item.section, { isPublished: event.target.checked })} className="h-4 w-4 accent-cyan-300" /> Publish to enrolled students</label>
                <div className="mt-4 flex gap-2"><button type="button" disabled={saving === item.section} onClick={() => save(item)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-black uppercase tracking-wider text-black disabled:opacity-60"><LoadingButtonLabel loading={saving === item.section} idleText="Save link" loadingText="Saving..." iconName="check" /></button>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 text-white"><ExternalLink className="h-4 w-4" /></a> : null}</div>
              </article>
            );
          })}
        </div>
      )}
      {error ? <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
      {message ? <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-200">{message}</div> : null}
    </section>
  );
}
