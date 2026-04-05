"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { GetAllCategoryService } from "@/app/service/category-service";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetCoursesByCategoryService } from "@/app/service/course-provider-service";
import { useRouter } from "next/navigation";
import { GetAllCoursesService } from "@/app/service/course-service";
import { getAssetUrl } from "@/app/utils/asset-url";

// ** Carousel Settings **
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const CoursePage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter(); // Router for navigation
  

  // Fetch all courses initially
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const courseData = await GetAllCoursesService();
        setCourses(Array.isArray(courseData) ? courseData : (courseData as any)?.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchAllCourses();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await GetAllCategoryService();
        const categoriesArray = Array.isArray(categoryData) ? categoryData : (categoryData as any)?.data || [];
        setCategories(categoriesArray);

        if (categoriesArray.length > 0) {
          setActiveCategory(categoriesArray[0]._id);
          fetchSubcategories(categoriesArray[0]._id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  const fetchSubcategories = async (categoryId: string) => {
    try {
      const subcategoryData = await GetSubcategoriesByCategoryService(categoryId);
      setSubcategories(Array.isArray(subcategoryData) ? subcategoryData : (subcategoryData as any)?.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Fetch courses when category or subcategory changes
  const fetchCourses = async (categoryId?: string, subcategoryId?: string) => {
    try {
      let courseData;
      if (categoryId) {
        courseData = await GetCoursesByCategoryService(categoryId, subcategoryId);
      } else {
        courseData = await GetAllCoursesService(); // If no category, fetch all courses
      }
      setCourses(Array.isArray(courseData) ? courseData : (courseData as any)?.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* 🔹 Top Navigation Menu */}
      <div className="flex space-x-6 border-b pb-3">
        <button
          className={`text-lg font-semibold ${!activeCategory ? "text-black border-b-2 border-black pb-1" : "text-gray-500"}`}
          onClick={() => {
            setActiveCategory(null);
            setActiveSubcategory(null);
            fetchCourses(); // Fetch all courses
          }}
        >
          All Courses
        </button>
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category._id}
              className={`text-lg font-semibold ${activeCategory === category._id ? "text-black border-b-2 border-black pb-1" : "text-gray-500"}`}
              onClick={() => {
                setActiveCategory(category._id);
                setActiveSubcategory(null);
                fetchSubcategories(category._id);
                fetchCourses(category._id);
              }}
            >
              {category.name}
            </button>
          ))
        ) : (
          <span>Loading categories...</span>
        )}
      </div>

      {/* 🔹 Subcategory Menu */}
      <div className="flex space-x-4 my-4">
        {subcategories.length > 0 && activeCategory ? (
          subcategories.map((sub) => (
            <button
              key={sub._id}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${activeSubcategory === sub._id ? "bg-black text-white font-semibold" : "bg-gray-200 text-gray-700"}`}
              onClick={() => {
                setActiveSubcategory(sub._id);
                fetchCourses(activeCategory, sub._id);
              }}
            >
              {sub.name}
            </button>
          ))
        ) : (
          <span>No subcategories available</span>
        )}
      </div>

      {/* 🔹 Course Carousel */}
      <Slider {...settings}>
  {courses.length > 0 ? (
    courses.map((course) => (
      <div key={course._id} className="p-4">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4">
          {/* Course Thumbnail */}
          <div className="relative w-full h-40">
            <Image
              src={getAssetUrl(`courses/${course.thumbnail}`)}
              alt={course.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Course Details */}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-gray-900 truncate">{course.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

            {/* Additional Info */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs font-semibold text-purple-600">
                {course.level} | {course.language}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {course.duration} hrs
              </span>
            </div>

            {/* CTA Button */}
            <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-all" onClick={() => router.push(`/course/${course._id}`)}>
            View Course
          </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No courses available.</p>
  )}
</Slider>

    </div>
  );
};

export default CoursePage;
