import FlashyLoader from "@/components/shared/FlashyLoader";

export default function DashboardLoading() {
  return (
    <FlashyLoader
      eyebrow="Dashboard Portal"
      title="Loading your command center"
      message="Your performance cards, schedule, and practice shortcuts are coming online."
      iconName="dashboard"
      skeleton="dashboard"
    />
  );
}
