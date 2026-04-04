"use client";
import { useRouter } from "next/navigation";
import {
    Users,
    Target,
    Award,
    Globe,
    BookOpen,
    Lightbulb,
    Heart,
    TrendingUp,
} from "lucide-react";

const stats = [
    { label: "Active Learners", value: "50,000+", icon: Users },
    { label: "Courses Available", value: "1,200+", icon: BookOpen },
    { label: "Partner Universities", value: "200+", icon: Globe },
    { label: "Course Providers", value: "500+", icon: Award },
];

const values = [
    {
        icon: Lightbulb,
        title: "Innovation",
        description:
            "We continuously evolve our platform with the latest technologies to deliver cutting-edge learning experiences.",
    },
    {
        icon: Heart,
        title: "Learner-First",
        description:
            "Every decision we make is designed around the success and satisfaction of our learners worldwide.",
    },
    {
        icon: Target,
        title: "Excellence",
        description:
            "We partner only with top-tier universities and educators to ensure the highest quality of education.",
    },
    {
        icon: TrendingUp,
        title: "Growth",
        description:
            "We believe in continuous growth — for our learners, our partners, and our platform.",
    },
];

const team = [
    {
        name: "Dr. Arjun Mehta",
        role: "Founder & CEO",
        initials: "AM",
        color: "bg-purple-600",
    },
    {
        name: "Priya Sharma",
        role: "Chief Learning Officer",
        initials: "PS",
        color: "bg-indigo-600",
    },
    {
        name: "James Wilson",
        role: "CTO",
        initials: "JW",
        color: "bg-violet-600",
    },
    {
        name: "Neha Patel",
        role: "Head of Partnerships",
        initials: "NP",
        color: "bg-purple-800",
    },
];

export default function AboutUsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Transforming Education,{" "}
                        <span className="text-yellow-300">One Course at a Time</span>
                    </h1>
                    <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                        Eduverse was born from a simple belief — quality education should be
                        accessible to everyone, everywhere. We bridge the gap between world-class
                        universities and ambitious learners.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={i}
                                    className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-purple-50"
                                >
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="text-purple-600" size={24} />
                                    </div>
                                    <p className="text-3xl font-extrabold text-purple-700 mb-1">{stat.value}</p>
                                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">
                            Our Mission
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
                            Empowering Learners to Achieve More
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            At Eduverse, our mission is to democratize access to world-class education.
                            We connect motivated learners with premier universities and expert course
                            providers to create meaningful career transformations.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Founded in 2022, we've grown from a small startup to a global platform
                            serving over 50,000 learners across 80+ countries. Every day, we work
                            to make education smarter, more accessible, and deeply impactful.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-10 text-center shadow-inner">
                            <div className="text-8xl mb-6">🎓</div>
                            <p className="text-purple-800 font-bold text-2xl">
                                "Education is the most powerful tool you can use to change the world."
                            </p>
                            <p className="text-purple-500 mt-4 font-medium">— Nelson Mandela</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">
                            Our Foundation
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3">
                            The Values That Drive Us
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((val, i) => {
                            const Icon = val.icon;
                            return (
                                <div
                                    key={i}
                                    className="group p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Icon className="text-white" size={22} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{val.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">
                        The Team
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mt-3">
                        Meet the People Behind Eduverse
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, i) => (
                        <div
                            key={i}
                            className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50"
                        >
                            <div
                                className={`w-20 h-20 ${member.color} rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-5`}
                            >
                                {member.initials}
                            </div>
                            <h3 className="text-gray-900 font-bold text-lg">{member.name}</h3>
                            <p className="text-purple-600 text-sm font-medium mt-1">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-purple-700 to-indigo-800 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-5">Ready to Start Learning?</h2>
                    <p className="text-purple-200 text-lg mb-10">
                        Join thousands of learners who are already transforming their careers with Eduverse.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => router.push("/user-registration")}
                            className="px-8 py-3.5 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => router.push("/our-partners")}
                            className="px-8 py-3.5 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 border border-white/30 transition-colors"
                        >
                            Meet Our Partners
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
