"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Medal,
  Radio,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { getCompetitionSummary, getContentCatalog, getMyStats, getProfile } from "@/lib/api";
import { formatRankPoints, getRankInfo, getRankProgressPercent, getRankTone } from "@/lib/rank";
import FlashyLoader from "@/components/shared/FlashyLoader";
import {
  MathActionCard,
  MathEmptyState,
  MathHero,
  MathPageShell,
  MathPanel,
  MathStatCard,
} from "@/components/math/MathDashboardUI";

function formatNumber(value) {
  return Number(value || 0).toFixed(2);
}

function getStudentId(value) {
  return value?._id?.toString?.() || value?.id?.toString?.() || value?.studentId?.toString?.() || "";
}

function getEntryRankPoints(entry) {
  return Number(getRankInfo(entry?.rankInfo).rankPoints || 0);
}

function sortRankPointEntries(first, second) {
  const rankPointDelta = getEntryRankPoints(second) - getEntryRankPoints(first);
  if (rankPointDelta !== 0) return rankPointDelta;

  const scoreDelta = Number(second.totalScore || 0) - Number(first.totalScore || 0);
  if (scoreDelta !== 0) return scoreDelta;

  return (first.name || "").localeCompare(second.name || "");
}

const QUICK_LINKS = [
  ["classes", "Live Classes", "Join scheduled special math classes.", Video],
  ["archived-classes", "Recorded Classes", "Build from basics through archive lessons.", Archive],
  ["live-exams", "Math Exams", "Daily mocks and full-length math papers.", Radio],
  ["leaderboard", "Math Leaderboard", "Track your standing across math exams.", Trophy],
];

const BASIS_OPTIONS = [
  { value: "score", label: "Score", icon: Trophy },
  { value: "rp", label: "Math RP", icon: Sparkles },
];

export default function MathWorkspace({ view = "overview" }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [basis, setBasis] = useState("score");

  useEffect(() => {
    let active = true;

    const request =
      view === "archive"
        ? getContentCatalog("recordings", "math")
        : view === "leaderboard"
          ? getCompetitionSummary("math")
          : Promise.all([getMyStats("math"), getProfile()]);

    request
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load your Math Course.");
      });

    return () => {
      active = false;
    };
  }, [view]);

  if (error) {
    return (
      <MathPageShell>
        <MathEmptyState
          icon={Sparkles}
          title="Math workspace could not load"
          message={error}
        />
      </MathPageShell>
    );
  }

  if (!data) {
    return (
      <FlashyLoader
        eyebrow="Math Course"
        title="Preparing your math workspace"
        message="Classes, rankings, and progress are being gathered."
        iconName="brain"
        skeleton="dashboard"
        className="min-h-[520px]"
      />
    );
  }

  if (view === "archive") return <ArchiveView payload={data} />;
  if (view === "leaderboard") return <LeaderboardView payload={data} basis={basis} setBasis={setBasis} />;

  return <OverviewView payload={data} />;
}

function OverviewView({ payload }) {
  const [statsPayload, profilePayload] = payload;
  const stats = statsPayload?.stats || {};
  const history = Array.isArray(statsPayload?.history) ? statsPayload.history : [];
  const user = profilePayload?.data || {};
  const rank = getRankInfo(statsPayload?.rankInfo);
  const rankTone = getRankTone(rank);
  const rankProgress = getRankProgressPercent(rank).toFixed(0);
  const firstName = user?.name?.trim?.().split(" ")[0] || "Student";

  return (
    <MathPageShell>
      <MathHero
        eyebrow="Math Course Command Center"
        title={`Welcome back, ${firstName}`}
        description="Your math classes, exam rhythm, rank progress, and recorded lessons now live in one focused workspace."
        icon={Brain}
        action={
          <Link
            href="/dashboard/math/live-exams"
            className="inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-linear-to-r from-emerald-300 via-[#DFB15B] to-[#AA7C11] px-5 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-[0_16px_44px_rgba(52,211,153,0.18)] transition hover:brightness-110 active:scale-[0.98]"
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <Radio className="h-4 w-4 shrink-0" />
              <span className="truncate">Open Math Exams</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">Current Rank</span>
            <span className={`mt-1 block truncate text-sm font-bold ${rankTone.name}`}>{rank.rankName}</span>
          </div>
          <div className="rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">Rank Charge</span>
            <span className="mt-1 block truncate text-sm font-bold text-emerald-200">{rankProgress}%</span>
          </div>
          <div className="rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">Completed</span>
            <span className="mt-1 block truncate text-sm font-bold text-white">{stats.totalExams || 0} exams</span>
          </div>
        </div>
      </MathHero>

      <div className="grid gap-4 sm:grid-cols-3">
        <MathStatCard label="Math Rank" value={rank.rankName} icon={Medal} />
        <MathStatCard label="Math Rank Points" value={formatRankPoints(rank.rankPoints)} icon={Sparkles} tone="gold" />
        <MathStatCard label="Exams Completed" value={stats.totalExams || 0} icon={CheckCircle2} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {QUICK_LINKS.map(([path, title, description, Icon]) => (
          <MathActionCard
            key={path}
            href={`/dashboard/math/${path}`}
            title={title}
            description={description}
            icon={Icon}
          />
        ))}
      </div>

      {!user.hasClassAccess ? (
        <MathPanel
          eyebrow="Optional Upgrade"
          title="Join Slytherin"
          description="Add full website access and house competition while keeping your Math Course progress intact."
          icon={Sparkles}
          action={
            <Link
              href="/payment/details?plan=slytherinUpgrade"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
            >
              Upgrade to Slytherin
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
          className="border-[#DFB15B]/18 bg-[#DFB15B]/7"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {["Full website access", "Regular exams", "House competition"].map((item) => (
              <div key={item} className="rounded-2xl border border-[#DFB15B]/12 bg-[#0F0D15]/70 px-4 py-3 text-sm font-semibold text-[#F4DFA6]">
                {item}
              </div>
            ))}
          </div>
        </MathPanel>
      ) : null}

      <MathPanel
        eyebrow="Recent Results"
        title="Your results"
        description="Completed math exam scores appear here after results are released."
        icon={BarChart3}
      >
        {!history.length ? (
          <MathEmptyState
            icon={Target}
            title="No released results yet"
            message="Your completed math exams will appear here after admins release scores."
          />
        ) : (
          <div className="grid gap-3">
            {history.map((item, index) => (
              <motion.div
                key={item._id || `${item.exam?._id}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
              >
                <Link
                  href={`/dashboard/math/live-exams/${item.exam?._id}`}
                  className="grid gap-3 rounded-2xl border border-white/6 bg-[#0F0D15] p-4 transition hover:border-emerald-300/35 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-white">{item.exam?.title || "Math Exam"}</span>
                    <span className="mt-1 block text-xs font-medium text-[#8E8A9F]">{item.exam?.competitionCategory || "math"} exam</span>
                  </span>
                  <span className="rounded-2xl border border-emerald-300/16 bg-emerald-300/8 px-4 py-2 text-sm font-bold text-emerald-100">
                    {item.isDisqualified ? 0 : item.score} / {item.exam?.totalMarks || 0}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </MathPanel>
    </MathPageShell>
  );
}

function ArchiveView({ payload }) {
  const groups = Array.isArray(payload?.data) ? payload.data : [];
  const topicCount = groups.reduce((total, group) => total + (group.topics?.length || 0), 0);

  return (
    <MathPageShell>
      <MathHero
        eyebrow="Recorded Math Archive"
        title="Math Recorded Classes"
        description="Start with the basics, then move through archive classes at your own pace."
        icon={BookOpenCheck}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <HeroMetric label="Folders" value={groups.length || 0} />
          <HeroMetric label="Topics" value={topicCount} />
          <HeroMetric label="Format" value="Drive links" />
        </div>
      </MathHero>

      {!groups.length ? (
        <MathEmptyState
          icon={Archive}
          title="Recordings are being arranged"
          message="Math course recordings will appear here once the archive catalog is published."
        />
      ) : (
        <div className="grid gap-5">
          {groups.map((group, groupIndex) => (
            <MathPanel
              key={group.label}
              eyebrow={`${group.topics?.length || 0} topics`}
              title={group.label}
              description="Open available class links or check back when pending topics are published."
              icon={Archive}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(group.topics || []).map((item, index) => {
                  const ready = Boolean(item.href?.trim());
                  return (
                    <motion.article
                      key={item.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min((groupIndex + index) * 0.03, 0.24) }}
                      className="flex min-h-40 flex-col justify-between rounded-2xl border border-white/6 bg-[#0F0D15] p-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/16 bg-emerald-300/8 font-serif text-sm font-bold text-emerald-200">
                            {index + 1}
                          </span>
                          <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${ready ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : "border-white/8 bg-white/5 text-[#8E8A9F]"}`}>
                            {ready ? "Ready" : "Pending"}
                          </span>
                        </div>
                        <h3 className="mt-4 text-sm font-bold leading-6 text-white">{item.label}</h3>
                      </div>

                      {ready ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/18 bg-emerald-300/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-100 transition hover:bg-emerald-300 hover:text-black"
                        >
                          Open Class
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/6 bg-white/4 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">
                          <Clock3 className="h-3.5 w-3.5" />
                          Coming Soon
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            </MathPanel>
          ))}
        </div>
      )}
    </MathPageShell>
  );
}

function LeaderboardView({ payload, basis, setBasis }) {
  const summary = payload?.data || {};
  const leaderboard = useMemo(() => (Array.isArray(summary.leaderboard) ? summary.leaderboard : []), [summary.leaderboard]);
  const displayedLeaderboard = useMemo(() => {
    if (basis === "rp") {
      let previousPoints = null;
      let previousRank = 0;
      return [...leaderboard].sort(sortRankPointEntries).map((entry, index) => {
        const rankPoints = getEntryRankPoints(entry);
        const displayRank = previousPoints === rankPoints ? previousRank : index + 1;
        previousPoints = rankPoints;
        previousRank = displayRank;
        return { ...entry, displayRank };
      });
    }

    return leaderboard.map((entry, index) => ({ ...entry, displayRank: entry.rank || index + 1 }));
  }, [basis, leaderboard]);

  const currentUserEntry = summary.currentUserEntry || null;
  const currentRankInfo = getRankInfo(currentUserEntry?.rankInfo);
  const currentRankTone = getRankTone(currentRankInfo);
  const currentUserId = getStudentId(currentUserEntry);
  const topEntry = displayedLeaderboard[0] || null;

  return (
    <MathPageShell>
      <MathHero
        eyebrow="Math Competition"
        title="Math Leaderboard"
        description="Everyone enrolled in Math competes here. Only math-course exams count toward this board."
        icon={Trophy}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <HeroMetric label="Ranked Students" value={displayedLeaderboard.length} />
          <HeroMetric label="Top Score" value={topEntry ? formatNumber(topEntry.totalScore) : "0.00"} />
          <HeroMetric label="Your Rank" value={currentUserEntry?.rank || "Pending"} />
        </div>
      </MathHero>

      <MathPanel
        eyebrow="Your Standing"
        title={currentUserEntry ? `${basis === "rp" ? "RP" : "Score"} Rank ${currentUserEntry.rank || "Pending"}` : "No Rank Yet"}
        description={currentUserEntry ? "Your math rank updates after finalized math exam results." : "Submit a released math exam to enter the leaderboard."}
        icon={Medal}
        action={
          <div className="inline-flex w-fit rounded-full border border-white/8 bg-white/5 p-1">
            {BASIS_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = basis === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setBasis(option.value)}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-bold uppercase tracking-wider transition ${isActive ? "bg-emerald-300 text-black" : "text-[#9D96B3] hover:bg-white/7 hover:text-white"}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              );
            })}
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <MathStatCard label="Total Score" value={formatNumber(currentUserEntry?.totalScore)} icon={Zap} />
          <MathStatCard label="Math Rank" value={currentRankInfo.rankName} icon={Medal} tone="gold" />
          <MathStatCard label="Math RP" value={formatRankPoints(currentRankInfo.rankPoints)} icon={Sparkles} />
        </div>
        {currentUserEntry ? (
          <p className={`mt-4 inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${currentRankTone.badge}`}>
            {currentRankInfo.rankName}
          </p>
        ) : null}
      </MathPanel>

      <MathPanel
        eyebrow="Ranked Students"
        title="Math students"
        description={`Showing all ${displayedLeaderboard.length} ranked student${displayedLeaderboard.length === 1 ? "" : "s"} by ${basis === "rp" ? "rank points" : "score"}.`}
        icon={Users}
      >
        {!displayedLeaderboard.length ? (
          <MathEmptyState
            icon={Trophy}
            title="Leaderboard opens soon"
            message="The leaderboard opens when the first math exam results are released."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {displayedLeaderboard.map((entry, index) => {
              const rankInfo = getRankInfo(entry.rankInfo);
              const rankTone = getRankTone(rankInfo);
              const isCurrentUser = currentUserId && getStudentId(entry) === currentUserId;
              const primaryValue = basis === "rp" ? formatRankPoints(rankInfo.rankPoints) : formatNumber(entry.totalScore);

              return (
                <motion.div
                  key={entry.studentId || `${entry.name}-${entry.displayRank}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.35) }}
                  className={`grid grid-cols-[auto_1fr] gap-3 rounded-2xl border px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center ${isCurrentUser ? "border-emerald-300/30 bg-emerald-300/10 shadow-[0_0_32px_rgba(52,211,153,0.09)]" : "border-white/5 bg-[#0F0D15]"}`}
                >
                  <RankBadge rank={entry.displayRank || index + 1} />
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className={`truncate text-sm font-semibold ${rankTone.name}`}>{entry.name || "Student"}</span>
                      {isCurrentUser ? (
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                          You
                        </span>
                      ) : null}
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${rankTone.badge}`}>
                        {rankInfo.rankName}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-medium text-[#8E8A9F]">
                      {entry.examsTaken || 0} exams - Score {formatNumber(entry.totalScore)} - RP {formatRankPoints(rankInfo.rankPoints)}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-white/5 bg-[#121017]/70 px-3 py-2 sm:col-span-1 sm:block sm:border-0 sm:bg-transparent sm:p-0 sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B667B] sm:block">{basis === "rp" ? "RP" : "score"}</span>
                    <span className="text-sm font-bold text-emerald-200 sm:block">{primaryValue}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </MathPanel>
    </MathPageShell>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
      <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">{label}</span>
      <span className="mt-1 block truncate text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function RankBadge({ rank }) {
  const podium = rank <= 3;
  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-xs font-black ${podium ? "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]" : "border-white/6 bg-[#121017] text-[#8E8A9F]"}`}>
      {podium ? <Trophy className="h-4 w-4" /> : rank}
    </div>
  );
}
