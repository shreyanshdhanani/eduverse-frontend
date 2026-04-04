"use client";
import { useRouter } from "next/navigation";
import {
    Shield,
    Zap,
    Award,
    Globe,
    Clock,
    HeadphonesIcon,
    BarChart2,
    CheckCircle,
    Star,
} from "lucide-react";

const features = [
    {
        icon: Award,
        color: "bg-purple-600",
        title: "Accredited Certificates",
        description:
            "All certificates are issued by accredited universities and recognized by top employers worldwide, giving your career the boost it deserves.",
    },
    {
        icon: Globe,
        color: "bg-indigo-600",
        title: "Learn From Anywhere",
        description:
            "Access your courses on any device, anytime, anywhere. Our platform works seamlessly across mobile, tablet, and desktop.",
    },
    {
        icon: Zap,
        color: "bg-violet-600",
        title: "AI-Powered Learning",
        description:
            "Our AI assistant adapts to your learning pace, suggests relevant courses, and helps you stay on track with personalized guidance.",
    },
    {
        icon: Shield,
        color: "bg-purple-800",
        title: "Verified Course Providers",
        description:
            "Every course provider on Eduverse goes through a rigorous verification process, ensuring the highest quality of teaching.",
    },
    {
        icon: Clock,
        color: "bg-indigo-700",
        title: "Self-Paced Learning",
        description:
            "No rigid schedules. Learn at your own pace and complete courses on your own timeline — life's too busy for fixed timetables.",
    },
    {
        icon: HeadphonesIcon,
        color: "bg-violet-700",
        title: "24/7 Support",
        description:
            "Our dedicated support team and AI chatbot are always online to help you resolve any query or technical issue quickly.",
    },
    {
        icon: BarChart2,
        color: "bg-purple-600",
        title: "Progress Tracking",
        description:
            "Detailed dashboards help you track your learning progress, quiz scores, and completion rates all in one place.",
    },
    {
        icon: Star,
        color: "bg-indigo-600",
        title: "Top-Rated Courses",
        description:
            "With a review and rating system, the best courses always rise to the top. You'll always find the highest-quality content.",
    },
];

const comparisons = [
    { feature: "Accredited Certificates", us: true, others: false },
    { feature: "AI-Powered Learning Assistant", us: true, others: false },
    { feature: "University-Grade Content", us: true, others: true },
    { feature: "Self-Paced Courses", us: true, others: true },
    { feature: "24/7 Live Support", us: true, others: false },
    { feature: "Free Trial Courses", us: true, others: false },
    { feature: "Progress Analytics Dashboard", us: true, others: false },
    { feature: "Mobile App Access", us: true, others: true },
];

export default function WhyChooseUsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
                        Why Eduverse?
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                        The Smarter Way to{" "}
                        <span className="text-yellow-300">Learn & Grow</span>
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
                        Thousands of learners choose Eduverse over competitors. Here's exactly
                        what makes us different — and better.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">
                        Our Advantages
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mt-3">
                        8 Reasons to Choose Eduverse
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={i}
                                className="group p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div
                                    className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                                >
                                    <Icon className="text-white" size={22} />
                                </div>
                                <h3 className="text-gray-900 font-bold text-base mb-3">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">
                            Side by Side
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3">
                            Eduverse vs The Rest
                        </h2>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-3 bg-purple-700 text-white text-center py-5 px-6">
                            <p className="font-bold text-left text-lg">Feature</p>
                            <p className="font-bold text-xl">Eduverse ✨</p>
                            <p className="font-bold text-lg text-purple-200">Others</p>
                        </div>
                        {comparisons.map((row, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-3 items-center py-4 px-6 text-center border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                            >
                                <p className="text-gray-700 font-medium text-left text-sm">{row.feature}</p>
                                <div className="flex justify-center">
                                    {row.us ? (
                                        <CheckCircle className="text-green-500" size={22} />
                                    ) : (
                                        <span className="text-red-400 text-xl font-bold">✕</span>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    {row.others ? (
                                        <CheckCircle className="text-gray-400" size={22} />
                                    ) : (
                                        <span className="text-red-400 text-xl font-bold">✕</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-purple-700 to-indigo-800 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-5">Experience the Difference</h2>
                    <p className="text-purple-200 text-lg mb-10">
                        Start your learning journey today — completely free. No credit card required.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => router.push("/user-registration")}
                            className="px-8 py-3.5 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg"
                        >
                            Start for Free
                        </button>
                        <button
                            onClick={() => router.push("/testimonials")}
                            className="px-8 py-3.5 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 border border-white/30 transition-colors"
                        >
                            Read Reviews
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
