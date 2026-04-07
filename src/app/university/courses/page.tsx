"use client";

import { useEffect, useState } from "react";
import { GetAllCoursesService } from "@/app/service/course-service";
import { Search, BookOpen, Clock, Users, Star } from "lucide-react";
import Image from "next/image";

import { getAssetUrl } from "@/app/utils/asset-url";

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    duration: string;
    instructor?: string;
}

export default function UniversityCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await GetAllCoursesService();
                setCourses(Array.isArray(data) ? data : (data as any)?.data || []);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Available Courses</h1>
                    <p className="text-gray-500 mt-1">Explore and provide courses to your students.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses by title or description..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No courses found matching your search.</p>
                </div>
            )}
        </div>
    );
}

function CourseCard({ course }: { course: Course }) {
    const imageUrl = getAssetUrl(course.thumbnail);

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    ${course.price}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
                    <BookOpen size={14} />
                    Academic
                </div>
                
                <h3 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-purple-600 transition">
                    {course.title}
                </h3>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {course.duration || "Self-paced"}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        4.8 (120)
                    </div>
                </div>

                <button className="mt-4 w-full py-2.5 bg-gray-50 text-gray-900 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200">
                    Course Details
                </button>
            </div>
        </div>
    );
}
