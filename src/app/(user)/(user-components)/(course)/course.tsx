"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { GetAllCategoryService } from "@/app/service/category-service";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetCoursesByCategoryService } from "@/app/service/course-provider-service";
import { useRouter } from "next/navigation";
import { GetAllCoursesService } from "@/app/service/course-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { ChevronLeft, ChevronRight, Clock, Globe, BookOpen } from "lucide-react";

// Custom arrows for the Slider
const PrevArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white shadow-lg border border-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:text-purple-600 hover:border-purple-300 transition-all"
  >
    <ChevronLeft size={18} />
  </button>
);

const NextArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white shadow-lg border border-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:text-purple-600 hover:border-purple-300 transition-all"
  >
    <ChevronRight size={18} />
  </button>
);

const settings = {
  dots: false,
  infinite: false,
  speed: 400,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const CoursePage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllCourses = async () => {
      setIsLoading(true);
      try {
        const courseData = await GetAllCoursesService();
        setCourses(Array.isArray(courseData) ? courseData : (courseData as any)?.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCourses();
  }, []);

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

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const subcategoryData = await GetSubcategoriesByCategoryService(categoryId);
      setSubcategories(Array.isArray(subcategoryData) ? subcategoryData : (subcategoryData as any)?.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchCourses = async (categoryId?: string, subcategoryId?: string) => {
    setIsLoading(true);
    try {
      let courseData;
      if (categoryId) {
        courseData = await GetCoursesByCategoryService(categoryId, subcategoryId);
      } else {
        courseData = await GetAllCoursesService();
      }
      setCourses(Array.isArray(courseData) ? courseData : (courseData as any)?.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
    if (categoryId) {
      fetchSubcategories(categoryId);
      fetchCourses(categoryId);
    } else {
      setSubcategories([]);
      fetchCourses();
    }
  };

  return (
    <div className="py-4">
      {/* Category Tab Bar — horizontal scroll on mobile */}
      <div className="mb-4">
        <div
          ref={categoryScrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all border ${
              !activeCategory
                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all border whitespace-nowrap ${
                activeCategory === category._id
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
              }`}
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Subcategory Row */}
        {subcategories.length > 0 && activeCategory && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 mt-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subcategories.map((sub) => (
              <button
                key={sub._id}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeSubcategory === sub._id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveSubcategory(sub._id);
                  fetchCourses(activeCategory, sub._id);
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Course Carousel */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="relative px-4 sm:px-6">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="px-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={getAssetUrl(`courses/${course.thumbnail}`)}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/90 backdrop-blur-sm text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">{course.description}</p>

                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium mb-3">
                      <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}h</span>
                      <span className="flex items-center gap-1"><Globe size={10} /> {course.language}</span>
                      <span className="flex items-center gap-1"><BookOpen size={10} /> {course.sections?.length || 0} sec.</span>
                    </div>

                    <button
                      onClick={() => router.push(`/course/${course._id}`)}
                      className="w-full py-2.5 bg-gray-900 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-95"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <p className="font-medium">No courses available in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
