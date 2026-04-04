"use client";

import React from "react";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  PlayCircle,
  Globe,
  Zap,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

interface LandingData {
  hero?: any;
  stats?: any[];
  features?: any[];
  testimonials?: any[];
  partners?: any[];
}

export default function LandingPro({ data, featuredCourse }: { data: LandingData, featuredCourse?: any }) {
  const { hero, stats, features, testimonials, partners } = data;

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <Zap size={14} /> Start your learning journey today
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1]">
                {hero?.title || "Unlock Your Potential with Expert-Led Courses"}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                {hero?.subtitle || "Learn from industry experts, master new skills, and advance your career with our professional e-learning platform."}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href={hero?.ctaLink || "/registration"}>
                  <button className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-200 flex items-center gap-2 group">
                    {hero?.ctaText || "Get Started for Free"}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                  </button>
                </Link>
                <button className="px-8 py-4 text-gray-700 font-bold text-lg hover:text-purple-600 transition flex items-center gap-2">
                  <PlayCircle size={24} /> Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-yellow-400 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-500 font-medium">Trusted by 10,000+ students</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 animate-pulse" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse" />
              
              <div className="relative">
                {/* 🔹 Principal Hero Image (image3.jpg - Professional Learning) */}
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl rotate-2 z-10 transition-transform hover:rotate-0 duration-500">
                  <img 
                    src="/image3.jpg" 
                    alt="Professional Learning" 
                    className="rounded-2xl w-full object-cover aspect-[4/3]"
                  />
                </div>

                {/* 🔹 Featured Course Spotlight (Dynamic from API) */}
                {featuredCourse && (
                  <div className="absolute -bottom-10 -right-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-purple-100 max-w-xs z-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase">Featured Course</span>
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={10} fill="currentColor" />)}
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{featuredCourse.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-1">
                         <BookOpen size={14} /> {featuredCourse.level}
                      </div>
                      <div className="flex items-center gap-1">
                         <Trophy size={14} /> Certificated
                      </div>
                    </div>
                    <Link href={`/course/${featuredCourse._id}`}>
                      <button className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2">
                        View Details <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                )}

                {/* 🔹 Verified Badge */}
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 z-20">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Verified Content</p>
                    <p className="text-sm font-bold text-gray-900">100% Industry Standard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-gray-50 py-12 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {(stats?.length ? stats : [
              { label: "Active Students", value: "15k+", icon: "Users" },
              { label: "Expert Mentors", value: "250+", icon: "Users" },
              { label: "Courses Available", value: "1.2k+", icon: "BookOpen" },
              { label: "Success Rate", value: "98%", icon: "Trophy" }
            ]).map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PARTNERS LOGO CLOUD */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">
            Trusted by top companies and universities
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {(partners?.length ? partners : [
              { name: "Google" }, { name: "Microsoft" }, { name: "Stanford" }, { name: "Harvard" }, { name: "Amazon" }
            ]).map((p, idx) => (
              <div key={idx} className="text-2xl font-black text-gray-300 italic tracking-tighter">
                {p.logoUrl ? <img src={p.logoUrl} alt={p.name} className="h-8 w-auto" /> : p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Why Students Love Learning with Us
            </h2>
            <p className="text-gray-600">
              We provide the most flexible and comprehensive learning experience designed for professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-100 group overflow-hidden relative">
              <img src="/image1.jpg" alt="Community" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborative Learning</h3>
                <p className="text-gray-600 leading-relaxed">Join a vibrant community of students and learn together through shared experiences.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-100 group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Globe size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Learn at Your Own Pace</h3>
                <p className="text-gray-600 leading-relaxed">Our on-demand courses are designed to fit into your busy schedule perfectly.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-100 group overflow-hidden relative">
              <img src="/image2.jpg" alt="Professional" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Trophy size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Certificate</h3>
                <p className="text-gray-600 leading-relaxed">Earn recognized certifications to boost your career prospects worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3 space-y-6">
              <div className="w-16 h-1 w-20 bg-purple-600 rounded-full" />
              <h2 className="text-4xl font-bold text-gray-900">What Our Graduates Say</h2>
              <p className="text-gray-600 text-lg">
                Check out the success stories of thousands of students who transformed their careers.
              </p>
              <div className="pt-4">
                <button className="text-purple-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Read all success stories <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {(testimonials?.length ? testimonials : [
                { name: "John Doe", role: "Software Engineer at TechCorp", feedback: "The courses here are extremely high quality. I was able to transition from marketing to engineering in just 6 months!" },
                { name: "Jane Smith", role: "Product Designer at Design studio", feedback: "Best platform I’ve used so far. Practical knowledge, great community, and recognized certifications." }
              ]).map((t, idx) => (
                <div key={idx} className="bg-gray-50 p-8 rounded-3xl relative">
                  <div className="flex text-yellow-500 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-700 italic mb-8 leading-relaxed">"{t.feedback}"</p>
                  <div className="flex items-center gap-4 border-t pt-6 border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-purple-200" />
                    <div>
                      <h4 className="font-bold text-gray-900">{t.name}</h4>
                      <p className="text-xs text-gray-500 font-medium uppercase">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full -ml-40 -mb-40 blur-3xl" />
            
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Accelerate Your Career Today?
              </h2>
              <p className="text-purple-100 text-lg lg:text-xl">
                Join the platform trusted by thousands of ambitious professionals. Unrestricted access to all courses starting from today.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Link href="/registration">
                   <button className="px-10 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                    Get Started Free
                  </button>
                </Link>
                <Link href="/courses">
                   <button className="px-10 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition">
                    Browse All Courses
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
