"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCompetitionSummary, getContentCatalog, getMyStats, getProfile } from '@/lib/api';
import { getRankInfo } from '@/lib/rank';

export default function MathWorkspace({ view = 'overview' }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [basis, setBasis] = useState('score');
  useEffect(() => {
    let active = true;
    const request = view === 'archive' ? getContentCatalog('recordings', 'math') : view === 'leaderboard' ? getCompetitionSummary('math') : Promise.all([getMyStats('math'), getProfile()]);
    request.then(payload => { if (active) setData(payload); }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [view]);
  if (error) return <p role="alert" className="rounded-2xl border border-red-400/20 p-6 text-red-200">{error}</p>;
  if (!data) return <p role="status" className="p-6 text-[#AAA5B8]">Loading your Math Course…</p>;

  if (view === 'archive') return <div className="space-y-8"><Heading title="Math Recorded Classes" description="Start with the basics, then build on your foundation with the archive classes." />{data.data.map(group => <section key={group.label}><h2 className="mb-4 font-serif text-2xl">{group.label}</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{group.topics.map(item => <div key={item.label} className="rounded-2xl border border-white/10 bg-[#121017] p-5"><p className="font-semibold">{item.label}</p>{item.href ? <a href={item.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-emerald-200">Open class ↗</a> : <p className="mt-3 text-xs text-[#AAA5B8]">Coming soon</p>}</div>)}</div></section>)}</div>;

  if (view === 'leaderboard') {
    const summary = data.data;
    const entries = [...summary.leaderboard].sort((a, b) => basis === 'rp' ? (b.rankInfo.rankPoints - a.rankInfo.rankPoints || a.rank - b.rank) : a.rank - b.rank);
    const rows = entries.map((entry, index) => ({ ...entry, displayRank: basis === 'rp' ? entries.findIndex(other => other.rankInfo.rankPoints === entry.rankInfo.rankPoints) + 1 : index + 1 }));
    return <div className="space-y-6"><Heading title="Math Leaderboard" description="Everyone enrolled in Math competes here. Only math-course exams count." />
      <div className="flex gap-2">{[['score', 'Score'], ['rp', 'Math RP']].map(([value, label]) => <button key={value} onClick={() => setBasis(value)} aria-pressed={basis === value} className={`rounded-xl border px-5 py-3 text-sm ${basis === value ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200' : 'border-white/10'}`}>{label}</button>)}</div>
      {summary.currentUserEntry && <p className="rounded-2xl bg-emerald-300/10 p-5 text-emerald-100">Your math score: {summary.currentUserEntry.totalScore.toFixed(2)} · {summary.currentUserEntry.rankInfo.rankName} · {summary.currentUserEntry.rankInfo.rankPoints.toFixed(2)} RP</p>}
      <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-[#181420] text-[#AAA5B8]"><tr>{['Position', 'Student', 'Score', 'Math rank', 'Math RP', 'Exams'].map(title => <th key={title} className="whitespace-nowrap p-4">{title}</th>)}</tr></thead><tbody>{rows.map(entry => <tr key={entry.studentId} className="border-t border-white/8 bg-[#121017]"><td className="p-4">#{entry.displayRank}</td><td className="p-4 font-semibold">{entry.name}</td><td className="p-4">{entry.totalScore.toFixed(2)}</td><td className="whitespace-nowrap p-4 text-emerald-200">{entry.rankInfo.rankName}</td><td className="p-4">{entry.rankInfo.rankPoints.toFixed(2)}</td><td className="p-4">{entry.examsTaken}</td></tr>)}</tbody></table>{!rows.length && <p className="p-8 text-sm text-[#AAA5B8]">The leaderboard opens when the first exam results are released.</p>}</div>
    </div>;
  }
  const [statsPayload, profilePayload] = data;
  const stats = statsPayload.stats;
  const user = profilePayload.data;
  const rank = getRankInfo(statsPayload.rankInfo);
  return <div className="space-y-7"><Heading title="Your Math Course" description="Your classes, exams, and progress in one place." />
    <div className="grid gap-3 sm:grid-cols-3">{[['Math rank', rank.rankName], ['Math rank points', rank.rankPoints.toFixed(2)], ['Exams completed', stats.totalExams]].map(([label, value]) => <div key={label} className="rounded-2xl border border-emerald-300/15 bg-[#121017] p-6"><p className="text-xs text-[#AAA5B8]">{label}</p><p className="mt-3 text-2xl font-bold text-emerald-200">{value}</p></div>)}</div>
    <div className="grid gap-3 sm:grid-cols-2">{[['classes', 'Live Classes', 'Join your scheduled special classes.'], ['archived-classes', 'Recorded Classes', '12 basic recordings and 12 archive classes.'], ['live-exams', 'Math Exams', 'Daily mocks and full-length math papers.'], ['leaderboard', 'Math Leaderboard', 'See how your math preparation is progressing.']].map(([path, title, description]) => <Link key={path} href={`/dashboard/math/${path}`} className="rounded-2xl border border-white/10 bg-[#121017] p-6 transition hover:border-emerald-300/40"><h2 className="text-lg font-semibold">{title} ↗</h2><p className="mt-2 text-sm text-[#AAA5B8]">{description}</p></Link>)}</div>
    {!user.hasClassAccess && <section className="rounded-3xl border border-[#DFB15B]/25 bg-[#DFB15B]/5 p-6"><h2 className="font-serif text-2xl">Join Slytherin</h2><p className="mt-3 text-sm leading-7 text-[#AAA5B8]">Add full website access and join the house competition for BDT 5,999. Your math progress stays here.</p><Link href="/payment/details?plan=slytherinUpgrade" className="mt-5 inline-flex rounded-xl bg-[#DFB15B] px-5 py-3 font-bold text-black">Upgrade to Slytherin</Link></section>}
    <section><h2 className="mb-4 font-serif text-2xl">Your results</h2>{!statsPayload.history.length ? <p className="text-sm text-[#AAA5B8]">Your completed math exams will appear here after results are released.</p> : <div className="space-y-3">{statsPayload.history.map(item => <Link key={item._id} href={`/dashboard/math/live-exams/${item.exam._id}`} className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-[#121017] p-5"><span>{item.exam.title}</span><span className="whitespace-nowrap text-emerald-200">{item.isDisqualified ? 0 : item.score} / {item.exam.totalMarks}</span></Link>)}</div>}</section>
  </div>;
}
function Heading({ title, description }) { return <div><h1 className="font-serif text-3xl sm:text-4xl">{title}</h1><p className="mt-3 text-sm leading-7 text-[#AAA5B8]">{description}</p></div>; }
