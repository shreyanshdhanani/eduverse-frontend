"use client";

import React, { useRef } from "react";
import CourseGrid from "../(user-components)/(course)/course-grid";
import { Play, Rocket, GraduationCap, Users, Award } from "lucide-react";

export default function CoursePage() {
    const gridRef = useRef<HTMLDivElement>(null);

    const scrollToCourses = () => {
        gridRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <section
                className="relative text-white overflow-hidden py-24 md:py-32"
                style={{
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/hero.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative max-w-6xl mx-auto px-6 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full mb-8 border border-white/20 tracking-wider uppercase">
                        <Rocket size={14} className="text-yellow-400" /> Transform Your Career
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
                        Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Best</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
                        Join <span className="text-white font-bold">100,000+ students</span> and professionals worldwide. 
                        Master the skills that matter today with our expert-led curriculum.
                    </p>

                    <div className="flex flex-wrap gap-5 justify-center">
                        <button
                            onClick={scrollToCourses}
                            className="group px-10 py-5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-2xl shadow-purple-500/30 flex items-center gap-3 active:scale-95"
                        >
                            Get Started <Rocket size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="group px-10 py-5 bg-white/10 backdrop-blur-lg text-white font-bold rounded-2xl hover:bg-white/20 border border-white/30 transition-all flex items-center gap-3 active:scale-95"
                        >
                            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <Play size={16} fill="currentColor" />
                            </span>
                            Watch Demo
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 border-t border-white/10 pt-10">
                        <div className="text-center">
                            <p className="text-3xl font-black text-yellow-400">1,200+</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Courses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">200+</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Universities</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">4.8/5</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Top Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">500+</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Experts</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories Icons */}
            <section className="py-12 bg-gray-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-wrap items-center justify-center gap-10 opacity-60">
                       <div className="flex items-center gap-2 font-bold text-gray-600"><GraduationCap /> University Grade</div>
                       <div className="flex items-center gap-2 font-bold text-gray-600"><Users /> Experts Led</div>
                       <div className="flex items-center gap-2 font-bold text-gray-600"><Award /> Certified</div>
                    </div>
                </div>
            </section>

            {/* Main Course Listing Grid */}
            <div ref={gridRef} className="scroll-mt-10">
                <CourseGrid />
            </div>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-br from-purple-800 to-indigo-900 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-black mb-6">Ready to Master a New Skill?</h2>
                    <p className="text-purple-100 text-lg mb-10 font-medium">
                        Start your journey today and gain access to world-class education from anywhere in the world.
                    </p>
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-10 py-5 bg-yellow-400 text-gray-900 font-black rounded-2xl hover:bg-yellow-300 transition-all shadow-xl active:scale-95"
                    >
                        Browse All Categories
                    </button>
                </div>
            </section>
        </main>
    );
}
