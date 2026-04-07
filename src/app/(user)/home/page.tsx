"use client";

import React, { useEffect, useState } from "react";
import LandingPro from "../(user-components)/LandingPro";
import CourseCarousel from "../(user-components)/(course)/course";
import { GetLandingPageService } from "@/app/service/cms-service";
import { GetAllCoursesService } from "@/app/service/course-service";
import { GetPartnersService } from "@/app/service/course-provider-service";

export default function Home() {
  const [cmsData, setCmsData] = useState<any>(null);
  const [featuredCourse, setFeaturedCourse] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landingRes, coursesRes, partnersRes] = await Promise.all([
          GetLandingPageService(),
          GetAllCoursesService(),
          GetPartnersService()
        ]);
        setCmsData(landingRes);
        setPartners(Array.isArray(partnersRes) ? partnersRes : (partnersRes as any)?.data || []);
        const courses = (coursesRes as any) as any[];
        if (courses && courses.length > 0) {
          setFeaturedCourse(courses[0]);
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="bg-white">
      {/* 1. Dynamic Landing Pro Section (Hero, Stats, Features, Testimonials, Partners) */}
      <LandingPro data={{ ...cmsData, partners: partners.length > 0 ? partners : cmsData?.partners }} featuredCourse={featuredCourse} />

      {/* 2. Existing Course Selection / Categories */}
      <div className="bg-gray-50/50 py-12 sm:py-16 lg:py-20">
         <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
               <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Our Featured Courses</h2>
               <p className="text-gray-500 mt-2 text-sm sm:text-base">Find the perfect course to kickstart your next career move</p>
            </div>
            <CourseCarousel />
         </div>
      </div>
    </main>
  );
}
