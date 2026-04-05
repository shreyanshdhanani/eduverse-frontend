"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GetAllCategoryService } from "@/app/service/category-service";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetCoursesByCategoryService } from "@/app/service/course-provider-service";
import { useRouter } from "next/navigation";
import { GetAllCoursesService } from "@/app/service/course-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { Search, Filter, BookOpen, Clock, Globe } from "lucide-react";

const CourseGrid = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch all courses initially
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [courseData, categoryData] = await Promise.all([
                    GetAllCoursesService(),
                    GetAllCategoryService()
                ]);
                
                // Defensive extraction in case axios interceptor is bypassed or returns raw response
                const coursesArray = Array.isArray(courseData) ? courseData : (courseData as any)?.data || [];
                const categoriesArray = Array.isArray(categoryData) ? categoryData : (categoryData as any)?.data || [];
                
                setCourses(coursesArray);
                setCategories(categoriesArray);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch subcategories when category changes
    const handleCategoryClick = async (categoryId: string | null) => {
        setActiveCategory(categoryId);
        setActiveSubcategory(null);
        setIsLoading(true);
        try {
            if (categoryId) {
                const subData = await GetSubcategoriesByCategoryService(categoryId);
                setSubcategories(Array.isArray(subData) ? subData : (subData as any)?.data || []);
                const courseData = await GetCoursesByCategoryService(categoryId);
                setCourses(Array.isArray(courseData) ? courseData : (courseData as any)?.data || []);
            } else {
                setSubcategories([]);
                const courseData = await GetAllCoursesService();
                setCourses(Array.isArray(courseData) ? courseData : (courseData as any)?.data || []);
            }
        } catch (error) {
            console.error("Error updating category:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubcategoryClick = async (subId: string | null) => {
        setActiveSubcategory(subId);
        setIsLoading(true);
        try {
            const courseData = await GetCoursesByCategoryService(activeCategory!, subId || undefined);
            setCourses(Array.isArray(courseData) ? courseData : (courseData as any)?.data || []);
        } catch (error) {
            console.error("Error updating subcategory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course => 
        course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="course-listing" className="py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Search and Filters Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Explore Courses</h2>
                        <p className="text-gray-500 mt-1">Find the perfect course to advance your career.</p>
                    </div>
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses by title or description..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${!activeCategory ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat._id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat._id ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Subcategories (Dynamic) */}
                {subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10 p-4 bg-purple-50 rounded-2xl">
                        <span className="text-purple-700 text-sm font-bold flex items-center gap-2 mr-2">
                            <Filter size={14} /> Subcategories:
                        </span>
                        <button
                            onClick={() => handleSubcategoryClick(null)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!activeSubcategory ? "bg-white text-purple-600 shadow-sm" : "text-purple-400 hover:text-purple-600"}`}
                        >
                            All
                        </button>
                        {subcategories.map((sub) => (
                            <button
                                key={sub._id}
                                onClick={() => handleSubcategoryClick(sub._id)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubcategory === sub._id ? "bg-white text-purple-600 shadow-sm" : "text-purple-400 hover:text-purple-600"}`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Course Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
                        ))}
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCourses.map((course) => (
                            <div 
                                key={course._id} 
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={getAssetUrl(course.thumbnail)}
                                        alt={course.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-purple-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mb-5">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} /> {course.duration} hrs
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Globe size={12} /> {course.language}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen size={12} /> {course.sections?.length || 0} sections
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => router.push(`/course/${course._id}`)}
                                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-all shadow-md active:scale-95"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900">No courses found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => handleCategoryClick(null)}
                            className="mt-6 text-purple-600 font-bold hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseGrid;
