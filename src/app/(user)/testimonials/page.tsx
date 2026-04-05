"use client";
import { useRouter } from "next/navigation";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

const reviews = [
    {
        name: "Aisha Patel",
        role: "Data Scientist at Google",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        course: "Machine Learning Specialization",
        review:
            "Eduverse completely changed my career trajectory. The Machine Learning course from IIT Bombay was hands-on, current, and incredibly well-structured. Within 3 months of completing it, I landed my dream role at Google. The AI chatbot assistant was a game-changer!",
        date: "January 2026",
    },
    {
        name: "Marcus Johnson",
        role: "Software Engineer at Microsoft",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        course: "Azure Cloud Developer Path",
        review:
            "I was skeptical about online learning, but Eduverse proved me wrong. The Microsoft Azure certification path was thorough and the project-based approach helped me build a real portfolio. My instructor feedback was detailed and professional.",
        date: "February 2026",
    },
    {
        name: "Priya Sharma",
        role: "UX Designer at Flipkart",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        course: "UI/UX Design Bootcamp",
        review:
            "The UI/UX bootcamp exceeded all my expectations. Everything from wireframing to usability testing was covered in depth. The community support and peer reviews were incredibly valuable. I got my first design job within weeks of completing the course!",
        date: "December 2025",
    },
    {
        name: "Chen Wei",
        role: "Financial Analyst at HSBC",
        avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
        rating: 4,
        course: "Financial Modeling & Valuation",
        review:
            "A solid platform for professional development. The financial modeling course from University of Toronto was comprehensive and practical. The certificate added real credibility to my resume. Would love to see more advanced finance courses added.",
        date: "November 2025",
    },
    {
        name: "Rahul Verma",
        role: "Cybersecurity Lead at TCS",
        avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
        rating: 5,
        course: "Ethical Hacking & Security",
        review:
            "Best investment I've made in my career. The cybersecurity courses are incredibly relevant and up-to-date with current threats. Being able to learn from industry experts while working full-time made this platform perfect for me.",
        date: "January 2026",
    },
    {
        name: "Sophie Dubois",
        role: "Product Manager at Shopify",
        avatarUrl: "https://randomuser.me/api/portraits/women/26.jpg",
        rating: 5,
        course: "Product Management Mastery",
        review:
            "Transitioned from marketing to product management using Eduverse's PM courses. The curriculum is industry-aligned and includes real case studies from top companies. The self-paced format worked perfectly with my busy schedule. Highly recommended!",
        date: "February 2026",
    },
];

const ratings = [
    { stars: 5, percent: 78 },
    { stars: 4, percent: 16 },
    { stars: 3, percent: 4 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 1 },
];

export default function TestimonialsPage() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState("All");
    const filters = ["All", "Technology", "Design", "Business", "Finance"];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section 
                className="relative text-white overflow-hidden"
                style={{ 
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center' 
                }}
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
                        Learner Stories
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Real People,{" "}
                        <span className="text-yellow-300">Real Transformations</span>
                    </h1>
                    <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                        Don't just take our word for it. Thousands of learners have transformed
                        their careers with Eduverse. Here are some of their stories.
                    </p>
                </div>
            </section>

            {/* Overall Rating */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-lg p-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="text-center md:text-left shrink-0">
                            <p className="text-8xl font-extrabold text-purple-700">4.8</p>
                            <div className="flex gap-1 justify-center md:justify-start mt-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="text-yellow-400 fill-yellow-400" size={22} />
                                ))}
                            </div>
                            <p className="text-gray-500 text-sm mt-2">Based on 12,400+ reviews</p>
                        </div>
                        <div className="flex-1 w-full space-y-3">
                            {ratings.map((r) => (
                                <div key={r.stars} className="flex items-center gap-3">
                                    <div className="flex gap-0.5 shrink-0">
                                        {Array.from({ length: r.stars }).map((_, i) => (
                                            <Star key={i} className="text-yellow-400 fill-yellow-400" size={13} />
                                        ))}
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full h-2.5"
                                            style={{ width: `${r.percent}%` }}
                                        />
                                    </div>
                                    <span className="text-gray-500 text-xs w-8 shrink-0">{r.percent}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="pt-12 pb-4 max-w-6xl mx-auto px-6">
                <div className="flex flex-wrap gap-3 justify-center">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === f
                                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="py-10 max-w-6xl mx-auto px-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {reviews.map((review, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                        >
                            <Quote className="text-purple-200 mb-4" size={32} fill="currentColor" />
                            <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                                "{review.review}"
                            </p>
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <p className="text-xs text-purple-600 font-semibold mb-3 bg-purple-50 inline-block px-3 py-1 rounded-full">
                                    {review.course}
                                </p>
                                <div className="flex items-center gap-3">
                                    {/* Real avatar photo */}
                                    <img
                                        src={review.avatarUrl}
                                        alt={review.name}
                                        className="w-11 h-11 rounded-full object-cover border-2 border-purple-100 shrink-0"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=7c3aed&color=fff&size=44&bold=true`;
                                        }}
                                    />
                                    <div>
                                        <p className="text-gray-900 font-bold text-sm">{review.name}</p>
                                        <p className="text-gray-400 text-xs">{review.role}</p>
                                    </div>
                                    <div className="ml-auto flex gap-0.5">
                                        {Array.from({ length: review.rating }).map((_, j) => (
                                            <Star key={j} className="text-yellow-400 fill-yellow-400" size={13} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-xs mt-3">{review.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-purple-700 to-indigo-800 text-white text-center mt-10">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-5">Write Your Own Success Story</h2>
                    <p className="text-purple-200 text-lg mb-10">
                        Join over 50,000 learners who are already building the future they deserve.
                    </p>
                    <button
                        onClick={() => router.push("/user-registration")}
                        className="px-8 py-3.5 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg"
                    >
                        Start Learning Today
                    </button>
                </div>
            </section>
        </div>
    );
}
