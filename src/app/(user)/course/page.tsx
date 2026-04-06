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
        <main className="bg-white min-h-screen pt-20">
            {/* Main Course Listing Grid */}
            <div ref={gridRef}>
                <CourseGrid />
            </div>
        </main>
    );
}
