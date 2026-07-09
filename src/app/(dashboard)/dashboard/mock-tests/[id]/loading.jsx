import FlashyLoader from "@/components/shared/FlashyLoader";

export default function ExamLoading() {
  return (
    <FlashyLoader
      eyebrow="Exam Arena"
      title="Preparing the question field"
      message="The paper, answer choices, and scoring context are being loaded."
      iconName="brain"
      skeleton="exam"
      surface="screen"
    />
  );
}
