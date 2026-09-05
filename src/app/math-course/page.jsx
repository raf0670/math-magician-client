import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, BookOpen, Layers, Radio, Sigma, Trophy } from 'lucide-react';
import Footer from '@/components/shared/Footer';

export const metadata = { title: "Math Course | Magician's School", description: 'Build your math foundation with basic recordings, archive classes, live special classes, and 15 math exams. Optional Slytherin membership.' };
const features = [
  { count: '12', title: 'Basic Recorded Classes', icon: BookOpen, description: 'Learn math from the very basic and build your foundation properly. Know how math works.' },
  { count: '12', title: 'Archive Classes', icon: Layers, description: 'Build a layer on top of the foundation. After doing the basic class, do the archive class.' },
  { count: '12', title: 'Live Special Classes', icon: Radio, description: 'Ready for a new challenge? Join the live classes and learn how to approach difficult math smartly and efficiently.' },
  { count: '12', title: 'Daily Math Mocks', icon: Sigma, description: 'Put your learning into practice with exams exclusively for the math course.' },
  { count: '03', title: 'Online Full-Length Math Exams', icon: Trophy, description: 'Bring everything together in three full-length math papers.' },
];

export default function MathCoursePage() {
  return <div className="bg-[#0A090F] text-white">
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-300/15 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.16),transparent_65%)] p-7 sm:p-14">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">The Math Course</p>
        <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Understand the basics.<br /><span className="text-[#DFB15B]">Take on the difficult.</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#AAA5B8]">A dedicated math course that takes you from a strong foundation to smarter problem solving. Learn, practice, and compete with your math batch.</p>
        <p className="mt-8 text-3xl font-bold">BDT 5,999 <span className="text-sm font-normal text-[#AAA5B8]">/ full math course</span></p>
      </section>
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="What the math course includes">
        {features.map(({ count, title, description, icon: Icon }) => <article key={title} className="rounded-3xl border border-white/8 bg-[#121017] p-7">
          <div className="flex items-center justify-between text-emerald-200"><Icon size={26} /><span className="font-serif text-4xl text-[#DFB15B]">{count}</span></div>
          <h2 className="mt-6 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-[#AAA5B8]">{description}</p>
        </article>)}
        <article className="flex flex-col justify-center rounded-3xl border border-[#DFB15B]/20 bg-[#DFB15B]/5 p-7"><h2 className="text-xl font-semibold">Already in a house?</h2><p className="mt-3 text-sm leading-7 text-[#AAA5B8]">Approved Gryffindor, Hufflepuff, and Ravenclaw students receive 25% off Math. Keep your existing house and website access.</p><p className="mt-4 text-xl font-bold text-[#DFB15B]">BDT 4,499.25</p></article>
      </section>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/payment/details?plan=math" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#DFB15B] px-7 py-4 font-bold text-black">Enroll in Math <ArrowUpRight size={18} /></Link>
        <a href="#slytherin" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-300/25 px-7 py-4 font-semibold text-emerald-200">Explore Slytherin <ArrowDown size={18} /></a>
      </div>
      <section id="slytherin" className="mt-20 scroll-mt-28 rounded-3xl border border-emerald-300/20 bg-[#0E1A17] p-7 sm:p-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center"><Image src="/slytherin.jpg" alt="Slytherin house crest" width={140} height={160} className="rounded-2xl object-cover" /><div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">An optional next step</p><h2 className="mt-3 font-serif text-4xl">Math + Slytherin</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#BBBFC0]">Everything in the Math Course, plus full access to the website enjoyed by approved students in the other three houses: regular live classes, recordings, resources, practice, quizzes, assignments, exams, and the full leaderboard with house positions.</p>
          <p className="mt-4 text-sm leading-7 text-[#BBBFC0]">Your regular exams contribute to Slytherin. Math-course exams have their own leaderboard and never contribute to house points.</p>
          <p className="mt-6 text-3xl font-bold text-emerald-100">BDT 11,998</p><p className="mt-1 text-sm text-[#BBBFC0]">BDT 5,999 for Math + BDT 5,999 for Slytherin</p>
          <Link href="/payment/details?plan=mathSlytherin" className="mt-6 inline-flex rounded-2xl bg-emerald-300 px-6 py-4 font-bold text-black">Enroll in Math + Slytherin</Link>
          <p className="mt-4 text-xs leading-6 text-[#BBBFC0]">You can also start with Math and add Slytherin later for BDT 5,999.</p>
        </div></div>
      </section>
    </main><Footer />
  </div>;
}
