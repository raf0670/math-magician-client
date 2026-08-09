import LeaderboardPortal from "@/components/dashboard/LeaderboardPortal";

export default function LeaderboardPage() {
    return (
        <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-start gap-1 text-left">
                <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                    House Competition
                </h1>
                <p className="text-xs font-medium text-[#8E8A9F] sm:text-sm">
                    Track house points, master badges, champions, and exact live-exam ranks.
                </p>
            </div>

            <LeaderboardPortal />
        </div>
    );
}
