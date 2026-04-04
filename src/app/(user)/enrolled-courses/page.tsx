"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetEnrolledCoursesService } from "@/app/service/enrolled-service";

const API_URL = process.env.API_URL || "http://localhost:3020/api";

export default function EnrolledCoursesPage() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrolledCourses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/user-login");
      return;
    }

    try {
      const courses = await GetEnrolledCoursesService(token);
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

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>
      {enrolledCourses.length === 0 ? (
        <p>You haven't enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course: any) => (
            <div
              key={course._id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <img
                src={`${API_URL}/upload/courses/${course.thumbnail}`}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-3">{course.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{course.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Progress: {course.progress || 0}%
              </p>
              <button
                onClick={() => router.push(`/enrolled-courses/${course._id}`)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Go to Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
