"use client";

import React from "react";
import CourseCarousel from "../(user-components)/(course)/course";

export default function CoursePage() {
  return (
    <main className="bg-white min-h-screen py-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-500 mt-2">Discover our wide range of learning opportunities</p>
        </div>
        <CourseCarousel />
      </div>
    </main>
  );
}
