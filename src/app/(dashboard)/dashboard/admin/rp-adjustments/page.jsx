"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Gift,
  History,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import {
  applyRankPointAdjustmentBatch,
  getAdminRankPointAdjustmentBatches,
  getProfile,
  previewRankPointAdjustmentBatch,
  reverseRankPointAdjustmentBatch,
  saveAuthSession,
} from "@/lib/api";
import FlashyLoader from "@/components/shared/FlashyLoader";
import { formatRankPoints } from "@/lib/rank";

const HOUSES = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];
const today = new Date();
const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
const EMPTY_FORM = {
  label: "",
  reason: "Offline class participation",
  program: "general",
  expectedHouse: "Gryffindor",
  effectiveDate: new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10),
};

function signedPoints(value) {
  const points = Number(value || 0);
  return `${points > 0 ? "+" : ""}${formatRankPoints(points)}`;
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function pointTone(value) {
  const points = Number(value || 0);
  if (points > 0) return "text-emerald-300";
  if (points < 0) return "text-rose-300";
  return "text-[#8E8A9F]";
}

export default function RankPointAdjustmentsPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [batches, setBatches] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [previewing, setPreviewing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [reversingId, setReversingId] = useState("");
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);
  const [success, setSuccess] = useState("");

  const loadBatches = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const payload = await getAdminRankPointAdjustmentBatches();
      setBatches(payload?.data || []);
    } catch (err) {
      setError(err.message || "Unable to load RP adjustment history.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then(async (payload) => {
        const token = window.localStorage.getItem("exam_archive_token");
        if (token && payload?.data) saveAuthSession(token, payload.data);
        if (!mounted) return;
        const allowed = payload?.data?.role === "admin";
        setIsAdmin(allowed);
        if (allowed) await loadBatches();
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Unable to verify admin access.");
      })
      .finally(() => {
        if (mounted) {
          setProfileLoading(false);
          setHistoryLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [loadBatches]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setPreview(null);
    setError("");
    setDetails([]);
    setSuccess("");
  };

  const summaryCards = useMemo(() => {
    const summary = preview?.summary;
    if (!summary) return [];
    return [
      { label: "Students", value: summary.rowCount, tone: "text-white" },
      { label: "Positive", value: summary.positiveCount, tone: "text-emerald-300" },
      { label: "Zero", value: summary.zeroCount, tone: "text-[#8E8A9F]" },
      { label: "Negative", value: summary.negativeCount, tone: "text-rose-300" },
      { label: "Net RP", value: signedPoints(summary.totalPoints), tone: pointTone(summary.totalPoints) },
    ];
  }, [preview]);

  const handlePreview = async (event) => {
    event.preventDefault();
    setError("");
    setDetails([]);
    setSuccess("");
    setPreview(null);
    if (!file) {
      setError("Choose a CSV file first.");
      return;
    }

    setPreviewing(true);
    try {
      const payload = await previewRankPointAdjustmentBatch(file, form);
      setPreview(payload?.data || null);
    } catch (err) {
      setError(err.message || "Unable to preview this CSV.");
      setDetails(Array.isArray(err.data?.details) ? err.data.details : []);
    } finally {
      setPreviewing(false);
    }
  };

  const handleApply = async () => {
    if (!file || !preview || preview.duplicateBatch) return;
    const confirmed = window.confirm(
      `Apply ${preview.summary.rowCount} audited RP adjustments totaling ${signedPoints(preview.summary.totalPoints)}? This can only be undone by reversing the whole batch.`
    );
    if (!confirmed) return;

    setApplying(true);
    setError("");
    setDetails([]);
    setSuccess("");
    try {
      const payload = await applyRankPointAdjustmentBatch(file, form);
      setSuccess(payload?.message || "RP adjustments applied successfully.");
      setFile(null);
      setPreview(null);
      const fileInput = document.getElementById("rp-adjustment-file");
      if (fileInput) fileInput.value = "";
      await loadBatches();
    } catch (err) {
      setError(err.message || "Unable to apply this RP batch.");
      setDetails(Array.isArray(err.data?.details) ? err.data.details : []);
    } finally {
      setApplying(false);
    }
  };

  const handleReverse = async (batch) => {
    const confirmed = window.confirm(
      `Reverse “${batch.label}”? Equal and opposite entries will be added for all ${batch.rowCount} students.`
    );
    if (!confirmed) return;

    setReversingId(batch._id);
    setError("");
    setSuccess("");
    try {
      const payload = await reverseRankPointAdjustmentBatch(batch._id);
      setSuccess(payload?.message || "The RP batch was reversed.");
      await loadBatches();
    } catch (err) {
      setError(err.message || "Unable to reverse this batch.");
    } finally {
      setReversingId("");
    }
  };

  if (profileLoading) {
    return <FlashyLoader title="Checking admin access" message="Preparing the audited RP adjustment workspace." />;
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/8 p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-rose-300" />
          <h1 className="mt-4 text-3xl font-semibold text-white">Admin access required</h1>
          <p className="mt-2 text-sm text-[#8E8A9F]">Only administrators can preview or apply RP adjustment batches.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#DFB15B]/18 bg-[#11101A] p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#DFB15B]">
              <Gift className="h-4 w-4" /> Audited rewards
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">RP Adjustments</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
              Preview a house CSV, resolve every student, and apply the exact signed RP values as one reversible batch.
            </p>
          </div>
          <button
            type="button"
            onClick={loadBatches}
            disabled={historyLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-white transition hover:border-[#DFB15B]/30 hover:bg-[#DFB15B]/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${historyLoading ? "animate-spin" : ""}`} /> Refresh history
          </button>
        </div>
      </section>

      {(error || success) && (
        <section className={`rounded-2xl border px-4 py-3 text-sm ${error ? "border-rose-400/25 bg-rose-500/10 text-rose-200" : "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"}`}>
          <div className="flex items-start gap-2">
            {error ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
            <div>
              <p>{error || success}</p>
              {details.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs">
                  {details.slice(0, 20).map((detail, index) => (
                    <li key={`${detail.rowNumber || index}-${detail.email || "row"}`}>
                      Row {detail.rowNumber || "?"} · {detail.email || "Unknown email"}: {detail.message || "Invalid row"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <form onSubmit={handlePreview} className="rounded-[2rem] border border-white/8 bg-[#11101A] p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-white">Upload a batch</h2>
              <p className="text-xs text-[#8E8A9F]">CSV only · 1 MB · 500 students maximum</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">
              Batch label
              <input
                value={form.label}
                onChange={(event) => updateForm("label", event.target.value)}
                maxLength={120}
                required
                placeholder="Gryffindor Offline Class Bonus — 2026-10-01"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-[#DFB15B]/45"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">
              Reason
              <input
                value={form.reason}
                onChange={(event) => updateForm("reason", event.target.value)}
                maxLength={240}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-[#DFB15B]/45"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">
                Expected house
                <select
                  value={form.expectedHouse}
                  onChange={(event) => updateForm("expectedHouse", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0B14] px-4 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#DFB15B]/45"
                >
                  {HOUSES.map((house) => <option key={house}>{house}</option>)}
                </select>
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">
                Class date
                <input
                  type="date"
                  value={form.effectiveDate}
                  onChange={(event) => updateForm("effectiveDate", event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0B14] px-4 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#DFB15B]/45"
                />
              </label>
            </div>

            <label className="block rounded-2xl border border-dashed border-white/15 bg-white/3 p-4 text-center transition hover:border-[#DFB15B]/35 hover:bg-[#DFB15B]/5">
              <FileSpreadsheet className="mx-auto h-7 w-7 text-[#DFB15B]" />
              <span className="mt-2 block text-sm font-semibold text-white">{file?.name || "Choose bonus RP CSV"}</span>
              <span className="mt-1 block text-xs text-[#8E8A9F]">Email,Bonus RP or Name,Sum Bonus</span>
              <input
                id="rp-adjustment-file"
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(event) => {
                  setFile(event.target.files?.[0] || null);
                  setPreview(null);
                  setError("");
                  setDetails([]);
                }}
              />
            </label>

            <button
              type="submit"
              disabled={previewing || !file}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#DFB15B] to-amber-500 px-5 py-3.5 text-sm font-black text-[#17110A] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {previewing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {previewing ? "Validating every row" : "Preview and validate"}
            </button>
          </div>
        </form>

        <div className="rounded-[2rem] border border-white/8 bg-[#11101A] p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-white">Validation preview</h2>
              <p className="text-xs text-[#8E8A9F]">No RP changes until you confirm this preview.</p>
            </div>
          </div>

          {!preview ? (
            <div className="mt-6 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/8 bg-black/15 p-8 text-center text-sm text-[#6B667B]">
              Upload a CSV to resolve student accounts, enforce house membership, and calculate the signed RP total.
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {summaryCards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/7 bg-white/3 px-3 py-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">{item.label}</p>
                    <p className={`mt-1 text-lg font-black ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {preview.duplicateBatch && (
                <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  This exact house/date batch was already applied as “{preview.duplicateBatch.label}”.
                </div>
              )}

              <div className="max-h-80 overflow-auto rounded-2xl border border-white/7">
                <table className="w-full min-w-[620px] text-left text-xs">
                  <thead className="sticky top-0 bg-[#171520] text-[10px] uppercase tracking-wider text-[#8E8A9F]">
                    <tr>
                      <th className="px-4 py-3">Row</th>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">House</th>
                      <th className="px-4 py-3 text-right">RP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {preview.rows.map((row) => (
                      <tr key={row.studentId} className="text-[#C7C3D3]">
                        <td className="px-4 py-3 text-[#6B667B]">{row.rowNumber}</td>
                        <td className="px-4 py-3 font-semibold text-white">{row.studentName}</td>
                        <td className="px-4 py-3">{row.email}</td>
                        <td className="px-4 py-3">{row.house}</td>
                        <td className={`px-4 py-3 text-right font-black ${pointTone(row.points)}`}>{signedPoints(row.points)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleApply}
                disabled={applying || Boolean(preview.duplicateBatch)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/12 px-5 py-3.5 text-sm font-black text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {applying ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {applying ? "Applying atomically" : "Confirm and apply batch"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/8 bg-[#11101A] p-6">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-[#DFB15B]" />
          <div>
            <h2 className="text-xl font-semibold text-white">Batch history</h2>
            <p className="text-xs text-[#8E8A9F]">Original imports and their immutable reversal records.</p>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex justify-center py-12"><LoaderCircle className="h-7 w-7 animate-spin text-[#DFB15B]" /></div>
        ) : batches.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#6B667B]">No RP adjustment batches yet.</p>
        ) : (
          <div className="mt-5 grid gap-3">
            {batches.map((batch) => (
              <article key={batch._id} className="rounded-2xl border border-white/7 bg-white/3 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-white">{batch.label}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${batch.kind === "reversal" ? "border-amber-400/20 bg-amber-400/10 text-amber-200" : batch.status === "reversed" ? "border-rose-400/20 bg-rose-400/10 text-rose-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>
                        {batch.kind === "reversal" ? "Reversal" : batch.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8E8A9F]">{batch.reason}</p>
                    <p className="mt-2 text-[11px] text-[#6B667B]">
                      {batch.expectedHouse} · {formatDate(batch.effectiveDate)} · {batch.rowCount} rows · Imported by {batch.importedBy?.name || "Admin"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className={`text-lg font-black ${pointTone(batch.totalPoints)}`}>{signedPoints(batch.totalPoints)} RP</span>
                    {batch.kind === "import" && batch.status === "applied" && (
                      <button
                        type="button"
                        onClick={() => handleReverse(batch)}
                        disabled={reversingId === batch._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/8 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-50"
                      >
                        {reversingId === batch._id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                        Reverse
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
