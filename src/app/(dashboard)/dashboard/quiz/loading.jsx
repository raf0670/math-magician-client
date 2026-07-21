import FlashyLoader from "@/components/shared/FlashyLoader";

export default function QuizLoading() {
  return (
    <FlashyLoader
      eyebrow="Quiz"
      title="Assembling your timed quiz"
      message="The exam balance, difficulty level, and timer setup are being prepared."
      iconName="brain"
      skeleton="exam"
    />
  );
}
