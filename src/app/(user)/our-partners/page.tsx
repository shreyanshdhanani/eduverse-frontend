"use client";
import { useRouter } from "next/navigation";
import { ExternalLink, Globe, Star, GraduationCap, Building2 } from "lucide-react";

const partners = [
    {
        category: "University Partners",
        Icon: GraduationCap,
        color: "from-purple-500 to-indigo-600",
        items: [
            {
                name: "Stanford Online",
                country: "USA",
                flagUrl: "https://flagcdn.com/w40/us.png",
                logoUrl: "https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png",
                description: "World-renowned STEM and business programs available on Eduverse.",
                courses: 87,
                rating: 4.9,
            },
            {
                name: "Imperial College London",
                country: "United Kingdom",
                flagUrl: "https://flagcdn.com/w40/gb.png",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Imperial_College_London_crest.svg/100px-Imperial_College_London_crest.svg.png",
                description: "Top-ranked science, engineering, and business programs.",
                courses: 54,
                rating: 4.8,
            },
            {
                name: "IIT Bombay",
                country: "India",
                flagUrl: "https://flagcdn.com/w40/in.png",
                logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/IIT_Bombay_Logo.svg/100px-IIT_Bombay_Logo.svg.png",
                description: "Premier Indian technical institution offering advanced engineering courses.",
                courses: 72,
                rating: 4.9,
            },
            {
                name: "University of Toronto",
                country: "Canada",
                flagUrl: "https://flagcdn.com/w40/ca.png",
                logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/University_of_Toronto_coat_of_arms.svg/100px-University_of_Toronto_coat_of_arms.svg.png",
                description: "Canada's leading university with globally recognized certifications.",
                courses: 63,
                rating: 4.7,
            },
            {
                name: "TU Delft",
                country: "Netherlands",
                flagUrl: "https://flagcdn.com/w40/nl.png",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Delft_University_of_Technology.svg/200px-Delft_University_of_Technology.svg.png",
                description: "Europe's top technical university offering cutting-edge programs.",
                courses: 41,
                rating: 4.8,
            },
            {
                name: "NUS Singapore",
                country: "Singapore",
                flagUrl: "https://flagcdn.com/w40/sg.png",
                logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/100px-NUS_coat_of_arms.svg.png",
                description: "Asia's leading research university with world-class faculty.",
                courses: 58,
                rating: 4.9,
            },
        ],
    },
    {
        category: "Industry Partners",
        Icon: Building2,
        color: "from-violet-500 to-purple-700",
        items: [
            {
                name: "Google",
                country: "Technology",
                flagUrl: "https://flagcdn.com/w40/us.png",
                logoUrl: "https://logo.clearbit.com/google.com",
                description: "Google Career Certificates and Cloud skill programs.",
                courses: 24,
                rating: 4.9,
            },
            {
                name: "Microsoft",
                country: "Technology",
                flagUrl: "https://flagcdn.com/w40/us.png",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                description: "Azure, AI, and cybersecurity certifications from Microsoft.",
                courses: 31,
                rating: 4.8,
            },
            {
                name: "IBM",
                country: "Technology",
                flagUrl: "https://flagcdn.com/w40/us.png",
                logoUrl: "https://logo.clearbit.com/ibm.com",
                description: "Data science, AI and blockchain professional certificates.",
                courses: 19,
                rating: 4.7,
            },
            {
                name: "Tata Consultancy",
                country: "IT Services",
                flagUrl: "https://flagcdn.com/w40/in.png",
                logoUrl: "https://logo.clearbit.com/tcs.com",
                description: "Industry-aligned training programs co-created with TCS experts.",
                courses: 15,
                rating: 4.6,
            },
        ],
    },
];

export default function OurPartnersPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-violet-900 via-purple-700 to-indigo-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-violet-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
                        Global Network
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Partners Who Share Our{" "}
                        <span className="text-yellow-300">Vision</span>
                    </h1>
                    <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                        We've built a world-class ecosystem of universities, research institutions,
                        and industry leaders — all committed to delivering the best education to learners everywhere.
                    </p>

                    <div className="flex flex-wrap justify-center gap-10 mt-14">
                        {[
                            { value: "200+", label: "Universities" },
                            { value: "80+", label: "Countries" },
                            { value: "500+", label: "Industry Partners" },
                            { value: "1,200+", label: "Courses Together" },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <p className="text-4xl font-extrabold text-yellow-300">{s.value}</p>
                                <p className="text-purple-200 text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Sections */}
            {partners.map((section, si) => {
                const SectionIcon = section.Icon;
                return (
                    <section
                        key={si}
                        className={`py-20 ${si % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                        <div className="max-w-6xl mx-auto px-6">
                            <div className="flex items-center gap-4 mb-12">
                                <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                    <SectionIcon className="text-white" size={28} />
                                </div>
                                <div>
                                    <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">
                                        Featured
                                    </span>
                                    <h2 className="text-3xl font-bold text-gray-900">{section.category}</h2>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                                {section.items.map((partner, i) => (
                                    <div
                                        key={i}
                                        className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="flex items-start justify-between mb-5">
                                            {/* Partner Logo */}
                                            <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden p-1">
                                                <img
                                                    src={partner.logoUrl}
                                                    alt={partner.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=7c3aed&color=fff&size=56&bold=true`;
                                                    }}
                                                />
                                            </div>
                                            <span className="flex items-center gap-1 text-sm font-semibold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                                                <Star size={13} fill="currentColor" />
                                                {partner.rating}
                                            </span>
                                        </div>

                                        <h3 className="text-gray-900 font-bold text-lg mb-1">{partner.name}</h3>

                                        {/* Country with flag */}
                                        <div className="flex items-center gap-1.5 mb-3">
                                            <img
                                                src={partner.flagUrl}
                                                alt={partner.country}
                                                className="w-5 h-3.5 object-cover rounded-sm"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                            />
                                            <p className="text-purple-600 text-xs font-medium">{partner.country}</p>
                                        </div>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-5">{partner.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 font-medium">
                                                {partner.courses} courses available
                                            </span>
                                            <button
                                                onClick={() => router.push("/course")}
                                                className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold hover:text-purple-800 transition-colors group-hover:underline"
                                            >
                                                Browse <ExternalLink size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* Become a Partner CTA */}
            <section className="py-20 bg-gradient-to-br from-purple-700 to-indigo-800 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <Globe className="mx-auto mb-6 text-yellow-300" size={50} />
                    <h2 className="text-4xl font-bold mb-5">Want to Become a Partner?</h2>
                    <p className="text-purple-200 text-lg mb-10">
                        Join our global network of universities and businesses. Reach millions of
                        learners across 80+ countries.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => router.push("/university-registration")}
                            className="px-8 py-3.5 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg"
                        >
                            Partner as University
                        </button>
                        <button
                            onClick={() => router.push("/course-provider-registration")}
                            className="px-8 py-3.5 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 border border-white/30 transition-colors"
                        >
                            Partner as Business
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
