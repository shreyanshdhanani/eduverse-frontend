"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetEnrolledCoursesService } from "@/app/service/enrolled-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { BookOpen, Clock, ChevronRight, PlayCircle } from "lucide-react";

export default function EnrolledCoursesPage() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrolledCourses = async () => {
    try {
      const courses = await GetEnrolledCoursesService();
      setEnrolledCourses(courses || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 inline-block">
          <p className="font-semibold text-lg mb-2">Oops! Something went wrong</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 mb-8 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Learning</h1>
              <p className="text-gray-500 mt-2">Track your progress and continue where you left off.</p>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-100">
               <BookOpen className="text-purple-600" size={20} />
               <span className="font-bold text-purple-700">{enrolledCourses.length} Courses Enrolled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={36} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No courses yet</h2>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              You haven't enrolled in any courses yet. Start your learning journey today!
            </p>
            <button 
              onClick={() => router.push('/course')}
              className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-600/20 active:scale-95"
            >
              Browse All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {enrolledCourses.map((course: any) => (
              <div
                key={course._id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getAssetUrl(`courses/${course.thumbnail}`)}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600">
                      <PlayCircle size={28} />
                    </div>
                  </div>
                  {/* Progress Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                    {course.progress || 0}% Done
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                      <span className="text-xs font-bold text-purple-600">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-1000 ease-out" 
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => router.push(`/enrolled-courses/${course._id}`)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-md shadow-purple-600/10"
                  >
                    Continue Learning
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
