"use client";

import React, { useState, useEffect } from "react";
import { Eye, Plus, PlusCircle, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GetCoursesListByCourseProviderService } from "@/app/service/course-provider-service";

interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await GetCoursesListByCourseProviderService();
        setCourses(coursesData);
      } catch (err) {
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">All Courses</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div>
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Thumbnail</th>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    {course.thumbnail && (
                      <img
                        src={`http://localhost:3020/api/upload/courses/${course.thumbnail}`}
                        alt={course.title}
                        className="w-20 h-20 rounded-md shadow"
                      />
                    )}
                  </td>
                  <td className="p-3">{course.title}</td>
                  <td className="p-3">{course.description}</td>
                  <td className="p-3 flex justify-center items-center space-x-8">
                    {/* Navigate to course details page */}
                    <button
                      onClick={() => router.push(`/course-provider/courses/${course._id}`)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <Eye />
                    </button>

                    <button
                      onClick={() => router.push(`/course-provider/add-section/${course._id}`)}
                      className="text-green-500 hover:text-green-700 transition"
                    >
                      <PlusCircleIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
