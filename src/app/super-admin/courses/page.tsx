"use client";

import React, { useState, useEffect } from "react";
import { Eye, BookOpen, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { GetAllCourse, CourseStatusService } from "@/app/service/super-admin.service";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { getAssetUrl } from "@/app/utils/asset-url";

interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  approvalStatus: string;
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Approved: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  Rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  Pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
};

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await GetAllCourse();
        setCourses(Array.isArray(coursesData) ? coursesData : (coursesData as any)?.data || []);
      } catch (err) {
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      setUpdating(courseId);
      await CourseStatusService(courseId, newStatus);
      setCourses((prev) => prev.map((c) => c._id === courseId ? { ...c, approvalStatus: newStatus } : c));
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusStyle = (status: string) => statusStyles[status] || statusStyles["Pending"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Manage Courses</h1>
            <p className="text-xs text-gray-400">{courses.length} courses uploaded</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {!loading && courses.length === 0 && !error && (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
          <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No courses found.</p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && courses.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Change Status</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">View</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const style = getStatusStyle(course.approvalStatus);
                    return (
                      <tr key={course._id} className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {course.thumbnail ? (
                              <img
                                src={getAssetUrl(course.thumbnail)}
                                alt={course.title}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <BookOpen size={20} className="text-purple-300" />
                              </div>
                            )}
                            <p className="font-bold text-gray-900 text-sm line-clamp-2 max-w-[200px]">{course.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <p className="text-sm text-gray-500 line-clamp-2 max-w-[250px]">{course.description}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {course.approvalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="relative inline-block">
                            <select
                              className="appearance-none border border-gray-200 bg-white pl-3 pr-8 py-2 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 cursor-pointer shadow-sm"
                              value={course.approvalStatus}
                              onChange={(e) => handleStatusChange(course._id, e.target.value)}
                              disabled={updating === course._id}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          {updating === course._id && <p className="text-[10px] text-purple-500 mt-1">Updating...</p>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => router.push(`/super-admin/courses/${course._id}`)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {courses.map((course) => {
              const style = getStatusStyle(course.approvalStatus);
              return (
                <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {course.thumbnail ? (
                      <img
                        src={getAssetUrl(course.thumbnail)}
                        alt={course.title}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={20} className="text-purple-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm line-clamp-2">{course.title}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ml-1 ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {course.approvalStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    <div className="relative flex-1">
                      <select
                        className="appearance-none w-full border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
                        value={course.approvalStatus}
                        onChange={(e) => handleStatusChange(course._id, e.target.value)}
                        disabled={updating === course._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => router.push(`/super-admin/courses/${course._id}`)}
                      className="flex items-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex-shrink-0"
                    >
                      <Eye size={14} /> View
                    </button>
                    {updating === course._id && <span className="text-[10px] text-purple-500">Saving...</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
