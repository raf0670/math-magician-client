"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(-1);

    const faqItems = [
        {
            question: "What is IBA? Is it the name of an institution or a degree?",
            answer: (
                <p>
                    IBA stands for <strong>Institute of Business Administration</strong>. It is an autonomous institute under the{" "}
                    <strong>University of Dhaka</strong> that offers degree programs in business administration, including{" "}
                    <strong>BBA, MBA, EMBA, and DBA</strong>.
                </p>
            )
        },
        {
            question: "Why is IBA, University of Dhaka, considered so prestigious?",
            answer: (
                <>
                    <p>
                        IBA was established in <strong>1966</strong> with the goal of developing future business leaders through
                        institutional education in business administration. It was founded in collaboration with{" "}
                        <strong>Indiana University Bloomington (USA)</strong>, with financial support from the{" "}
                        <strong>Ford Foundation</strong>.
                    </p>
                    <p>
                        IBA&apos;s academic curriculum, co-curricular activities, and extracurricular opportunities help prepare students for
                        leadership roles in Bangladesh. Today, many IBA alumni hold prominent positions across the country&apos;s business
                        sector. Some notable alumni include:
                    </p>
                    <ul>
                        <li>
                            <strong>Nazmul Hassan Papon, MP</strong> &ndash; Managing Director, Beximco Pharma
                        </li>
                        <li>
                            <strong>Javed Akhtar</strong> &ndash; CEO, Unilever Bangladesh
                        </li>
                        <li>
                            <strong>Shehzad Munim</strong> &ndash; CEO, British American Tobacco Bangladesh
                        </li>
                        <li>
                            <strong>Yasir Azman</strong> &ndash; CEO, Grameenphone
                        </li>
                        <li>
                            <strong>Naser Ezaz Bijoy</strong> &ndash; CEO, Standard Chartered Bank Bangladesh
                        </li>
                        <li>
                            <strong>Rupali Chowdhury</strong> &ndash; Managing Director, Berger Paints Bangladesh
                        </li>
                        <li>
                            <strong>Ayman Sadiq</strong> &ndash; Founder & CEO, 10 Minute School
                        </li>
                        <li>
                            <strong>Tahsan Khan</strong> &ndash; Singer and Actor
                        </li>
                    </ul>
                </>
            )
        },
        {
            question: "Who is eligible to sit for the IBA admission test?",
            answer: (
                <>
                    <p>
                        Students from <strong>Science, Commerce, or Arts/Humanities</strong> backgrounds can apply for the{" "}
                        <strong>BBA admission test</strong> after completing their <strong>HSC or equivalent</strong> examination.
                    </p>
                    <p>
                        For the <strong>MBA admission test</strong>, applicants must have completed a <strong>Bachelor&apos;s degree</strong>{" "}
                        in any discipline.
                    </p>
                </>
            )
        },
        {
            question: "What are the eligibility criteria for the IBA BBA admission test?",
            answer: (
                <>
                    <p>To be eligible, applicants must have:</p>
                    <ul>
                        <li>
                            A combined <strong>SSC and HSC GPA of at least 8.00</strong> (including the fourth subject).
                        </li>
                        <li>
                            A minimum <strong>GPA of 3.50</strong> in both SSC and HSC individually.
                        </li>
                    </ul>
                </>
            )
        },
        {
            question: "Is it true that most IBA students come from English-medium backgrounds?",
            answer: (
                <>
                    <p>No. This is a common misconception.</p>
                    <p>
                        Currently, <strong>80&ndash;90% of IBA students come from the NCTB curriculum</strong>, including both{" "}
                        <strong>Bangla Version</strong> and <strong>English Version</strong> schools.
                    </p>
                </>
            )
        },
        {
            question: "How many seats are available at IBA?",
            answer: (
                <>
                    <p>
                        There are <strong>120 seats</strong> available for the BBA program.
                    </p>
                    <ul>
                        <li>
                            Approximately <strong>180 candidates</strong> are selected after the written examination.
                        </li>
                        <li>
                            After the viva (oral interview), <strong>120 students</strong> receive final admission offers.
                        </li>
                    </ul>
                </>
            )
        },
        {
            question: "I didn't study at a well-known college. Will it be harder for me to get into IBA?",
            answer: (
                <>
                    <p>Not at all.</p>
                    <p>
                        The IBA admission test is <strong>the same for everyone</strong>, and there is{" "}
                        <strong>no quota system</strong> that provides additional advantages to any applicant.
                    </p>
                    <p>
                        If you have strong English skills, can solve mathematical problems, think critically, and communicate
                        effectively, you have an equal opportunity to gain admission regardless of your educational institution.
                    </p>
                </>
            )
        },
        {
            question: "What is the IBA admission test pattern? What types of questions are asked?",
            answer: (
                <>
                    <p>
                        The admission process consists of <strong>three stages</strong>:
                    </p>
                    <ol>
                        <li>
                            <strong>MCQ Test</strong>
                        </li>
                        <li>
                            <strong>Written Test</strong>
                        </li>
                        <li>
                            <strong>Viva (Oral Interview)</strong>
                        </li>
                    </ol>
                    <p>
                        The MCQ and Written tests are held on the <strong>same day</strong>. Candidates who qualify in both are invited
                        for the viva. After the viva, <strong>120 candidates</strong> are selected for admission.
                    </p>
                    <p>
                        <strong>MCQ (70 marks)</strong>
                    </p>
                    <ul>
                        <li>English: 25 marks</li>
                        <li>Mathematics: 25 marks</li>
                        <li>Analytical Ability: 20 marks</li>
                    </ul>
                    <p>
                        <strong>Written (30 marks)</strong>
                    </p>
                    <ul>
                        <li>Essay</li>
                        <li>Translation</li>
                        <li>Paragraph Writing</li>
                    </ul>
                    <p>
                        <strong>Viva</strong>
                    </p>
                    <ul>
                        <li>15 marks</li>
                    </ul>
                </>
            )
        },
        {
            question: "What is the minimum passing score for each section?",
            answer: (
                <>
                    <p>The cutoff varies every year depending on the difficulty level of the exam.</p>
                    <p>
                        Generally, the sectional cutoff is <strong>above 50%</strong>, but in years with particularly difficult questions,
                        it may drop to <strong>below 45%</strong>. The passing score is determined by the overall standard of the exam.
                    </p>
                </>
            )
        },
        {
            question: "Are calculators allowed in the exam?",
            answer: (
                <p>
                    <strong>N/A</strong>
                </p>
            )
        },
        {
            question: "Is there negative marking?",
            answer: (
                <>
                    <p>Yes.</p>
                    <p>
                        <strong>0.25 marks are deducted for every incorrect MCQ answer.</strong>
                    </p>
                </>
            )
        },
        {
            question: "How competitive is the IBA admission test?",
            answer: (
                <>
                    <p>
                        Every year, approximately <strong>11,000&ndash;12,000 applicants</strong> sit for the IBA admission test, while
                        only <strong>120 students</strong> are admitted.
                    </p>
                    <p>
                        The IBA admission test follows a unique question pattern that differs significantly from school exams and other
                        university admission tests in Bangladesh. However, students who prepare consistently for{" "}
                        <strong>3&ndash;4 months</strong> have a strong chance of becoming competitive candidates.
                    </p>
                </>
            )
        },
        {
            question: "Are second-time applicants allowed?",
            answer: (
                <>
                    <p>No.</p>
                    <p>
                        The <strong>University of Dhaka does not allow second-time applicants</strong> for undergraduate admission.
                    </p>
                    <p>
                        If a student does not sit for the University of Dhaka admission test in the same year they complete HSC, they
                        cannot apply the following year either.
                    </p>
                    <p>
                        However, students who <strong>retake their HSC examination (take an HSC drop)</strong> become eligible to apply in
                        the admission cycle following their new HSC result.
                    </p>
                </>
            )
        },
        {
            question: "What career opportunities are available after graduating from IBA?",
            answer: (
                <>
                    <p>Very few IBA graduates remain unemployed after graduation.</p>
                    <p>
                        Many students receive <strong>full-time job offers before completing their internships</strong>. IBA graduates are
                        recruited by leading multinational companies such as:
                    </p>
                    <ul>
                        <li>Unilever</li>
                        <li>British American Tobacco</li>
                        <li>Marico</li>
                        <li>Nestl&eacute;</li>
                    </ul>
                    <p>They also work in leading local companies, banks, startups, and various government organizations.</p>
                </>
            )
        },
        {
            question: "I'm weak in Mathematics, English, and Analytical Ability. Can I still get into IBA?",
            answer: (
                <>
                    <p>Absolutely.</p>
                    <p>
                        Many successful IBA students were once weak in one or more of these areas. They improved through consistent
                        practice and focused preparation.
                    </p>
                    <p>
                        If you dedicate time every day, follow a structured study plan, and work on your weaknesses consistently, you can
                        significantly improve your chances of gaining admission to IBA.
                    </p>
                </>
            )
        }
    ];

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        // 🪄 Strict matching base background color applied here to keep everything uniform
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 CONSTRAINED LIGHT FIELD — Safely nested inside the FAQ bounds */}
            <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 w-[50vw] h-[50vw] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto max-w-4xl relative z-10">

                <div className="w-full flex flex-col items-center text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#DFB15B]/5 border border-[#DFB15B]/15 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                        FAQ
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white">
                        Questions from Aspiring Magicians
                    </h2>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {faqItems.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className={`bg-[#121017] rounded-2xl border transition-all duration-300 relative overflow-hidden
                                    ${isOpen ? "border-[#DFB15B]/25 shadow-[0_4px_25px_rgba(213,175,55,0.03)]" : "border-white/3 hover:border-white/10"}`}
                            >
                                <button
                                    onClick={() => handleToggle(index)}
                                    className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-6 text-left"
                                >
                                    <span className="text-white text-xs md:text-sm font-semibold tracking-wide transition-colors duration-200">
                                        {item.question}
                                    </span>

                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300
                                            ${isOpen ? "bg-[#DFB15B]/10 border-[#DFB15B]/20 text-[#DFB15B]" : "bg-white/2 border-white/6 text-[#8E8A9F]"}`}
                                    >
                                        {isOpen ? (
                                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        ) : (
                                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                                transition: {
                                                    height: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
                                                    opacity: { duration: 0.25, delay: 0.05 }
                                                }
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                                transition: {
                                                    height: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
                                                    opacity: { duration: 0.15 }
                                                }
                                            }}
                                        >
                                            <div className="px-6 pb-6 pt-4 md:px-8 md:pb-7 text-[#8E8A9F] text-xs leading-relaxed font-medium max-w-3xl border-t border-white/2 space-y-3 [&_strong]:text-[#D4CEDF] [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
