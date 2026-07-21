import FlashyLoader from "@/components/shared/FlashyLoader";

export default function MockTestsLoading() {
  return (
    <FlashyLoader
      eyebrow="Practice"
      title="Assembling practice papers"
      message="Subjects, sub-topics, and saved mock papers are being prepared."
      iconName="clipboard"
      skeleton="topics"
    />
  );
}
