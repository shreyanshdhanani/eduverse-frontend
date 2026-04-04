"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    ChevronUp,
    MessageCircle,
    Search,
    Rocket,
    GraduationCap,
    Lightbulb,
    Building2,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface FAQ {
    q: string;
    a: string;
}

interface FAQCategory {
    category: string;
    Icon: LucideIcon;
    questions: FAQ[];
}

const faqs: FAQCategory[] = [
    {
        category: "Getting Started",
        Icon: Rocket,
        questions: [
            {
                q: "How do I create an account on Eduverse?",
                a: 'Creating an account is easy and free! Click the "Sign Up" button in the top navigation bar, fill in your basic details, verify your email, and you\'re ready to start learning. The whole process takes less than 2 minutes.',
            },
            {
                q: "Is Eduverse free to use?",
                a: "Eduverse offers both free and paid courses. You can browse and enroll in many free courses to get started. For premium courses with certificates from top universities, a one-time course fee or subscription may apply.",
            },
            {
                q: "What types of courses are available?",
                a: "We offer over 1,200 courses spanning Technology, Data Science, Business Management, Design, Finance, Cybersecurity, Language Learning, and more — all created by accredited universities and industry experts.",
            },
        ],
    },
    {
        category: "Courses & Certificates",
        Icon: GraduationCap,
        questions: [
            {
                q: "Are the certificates recognized by employers?",
                a: "Yes! All certificates on Eduverse are issued by accredited universities or verified industry partners (like Google, Microsoft, IBM). These certificates are widely recognized by employers worldwide and can be shared directly on LinkedIn.",
            },
            {
                q: "How long does it take to complete a course?",
                a: "Course duration varies. Short courses may take 4–8 hours, while full specialization programs can span 3–6 months. Since all courses are self-paced, you can complete them on your own schedule without any pressure.",
            },
            {
                q: "Can I get a refund if I'm not satisfied?",
                a: "Yes, we offer a 7-day full refund policy for paid courses. If you're not satisfied within the first 7 days of enrollment, simply contact our support team and we'll process a full refund, no questions asked.",
            },
        ],
    },
    {
        category: "Learning Experience",
        Icon: Lightbulb,
        questions: [
            {
                q: "How does the AI learning assistant work?",
                a: "The Eduverse AI Chatbot (powered by Gemini AI) is available 24/7 to answer course-related questions, explain concepts, provide study tips, and guide you through difficult topics. Just click the chat icon in the bottom-right corner of any page.",
            },
            {
                q: "Can I download course materials for offline access?",
                a: "Yes! Most course videos and materials can be downloaded for offline viewing through our mobile app. This is perfect for learners with limited internet access or those who prefer to study on the go.",
            },
            {
                q: "Are there any live sessions or it's all pre-recorded?",
                a: "Most courses consist of high-quality pre-recorded lectures so you can learn at your own pace. Some premium programs include optional live Q&A sessions with instructors and mentors.",
            },
        ],
    },
    {
        category: "For Universities & Businesses",
        Icon: Building2,
        questions: [
            {
                q: "How can my university join Eduverse as a partner?",
                a: 'Universities can apply to partner with Eduverse through our university registration page. Our partnerships team will review your application and guide you through the onboarding process. Click "For Universities" in the header to get started.',
            },
            {
                q: "What benefits do course providers get?",
                a: "Course providers get access to our 50,000+ learner base, professional content publishing tools, analytics dashboards, and revenue sharing. You set your own course pricing and keep a significant share of every enrollment.",
            },
            {
                q: "Is there any review process for courses before publishing?",
                a: "Yes, all courses go through our quality review process before going live. This ensures that every learner gets high-quality, accurate, and engaging content. Our editorial team provides detailed feedback to help creators improve their content.",
            },
        ],
    },
];

export default function FAQPage() {
    const router = useRouter();
    const [openItem, setOpenItem] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const toggle = (id: string) => setOpenItem(openItem === id ? null : id);

    const filteredFaqs = faqs
        .map((cat) => ({
            ...cat,
            questions: cat.questions.filter(
                (q) =>
                    q.q.toLowerCase().includes(search.toLowerCase()) ||
                    q.a.toLowerCase().includes(search.toLowerCase())
            ),
        }))
        .filter((cat) => cat.questions.length > 0);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
                        Help Center
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Frequently Asked{" "}
                        <span className="text-yellow-300">Questions</span>
                    </h1>
                    <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Got questions? We&apos;ve got answers. Browse below or use search to find what you need.
                    </p>
                    {/* Search */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search your question..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-20 max-w-4xl mx-auto px-6">
                {filteredFaqs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">No results found for &quot;{search}&quot;</p>
                        <button
                            onClick={() => setSearch("")}
                            className="mt-4 text-purple-600 font-semibold hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    filteredFaqs.map((category, ci) => {
                        const CatIcon = category.Icon;
                        return (
                            <div key={ci} className="mb-12">
                                {/* Category header with Lucide icon */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                        <CatIcon className="text-purple-600" size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                                </div>

                                <div className="space-y-3">
                                    {category.questions.map((item, qi) => {
                                        const id = `${ci}-${qi}`;
                                        const isOpen = openItem === id;
                                        return (
                                            <div
                                                key={qi}
                                                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen
                                                        ? "border-purple-300 shadow-md shadow-purple-50"
                                                        : "border-gray-100 hover:border-violet-200"
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggle(id)}
                                                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-purple-50 transition-colors"
                                                >
                                                    <span
                                                        className={`font-semibold text-base ${isOpen ? "text-purple-700" : "text-gray-800"
                                                            }`}
                                                    >
                                                        {item.q}
                                                    </span>
                                                    {isOpen ? (
                                                        <ChevronUp className="text-purple-600 shrink-0 ml-4" size={20} />
                                                    ) : (
                                                        <ChevronDown className="text-gray-400 shrink-0 ml-4" size={20} />
                                                    )}
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-6 bg-white">
                                                        <div className="w-full h-0.5 bg-purple-50 mb-4" />
                                                        <p className="text-gray-600 leading-relaxed">{item.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {/* Still need help? */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <MessageCircle className="text-purple-600" size={30} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        Our support team is available 24/7. You can also use our AI chatbot for
                        instant answers to any course or platform-related queries.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => router.push("/contact-us")}
                            className="px-7 py-3.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md"
                        >
                            Contact Support
                        </button>
                        <button className="px-7 py-3.5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 border-2 border-purple-200 transition-colors">
                            Use AI Chatbot
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
