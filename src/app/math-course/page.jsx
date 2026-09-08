import MathCourseLanding from '@/components/math/MathCourseLanding';
import Footer from '@/components/shared/Footer';

export const metadata = { title: "Math Course | Magician's School", description: 'Build your math foundation with basic recordings, archive classes, live special classes, and 15 math exams. Optional Slytherin membership.' };

export default function MathCoursePage() {
  return <div className="bg-[#0A090F] text-white">
    <MathCourseLanding />
    <Footer />
  </div>;
}
