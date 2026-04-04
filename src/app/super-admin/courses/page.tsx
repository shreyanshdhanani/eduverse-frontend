"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { GetAllCourse, CourseStatusService } from "@/app/service/super-admin.service"; // Ensure you have the appropriate service
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  approvalStatus: string; // Add approvalStatus field here
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null); // Track updating course status
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await GetAllCourse();
        setCourses(coursesData);
      } catch (err) {
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Function to handle status change
  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      setUpdating(courseId); // Show loading state for specific row
      await CourseStatusService(courseId, newStatus); // Call service to update status
      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId ? { ...course, approvalStatus: newStatus } : course
        )
      );
    } catch (error) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle size={32} className="text-green-500 items-center" />;
      case "Rejected":
        return <FaTimesCircle size={32} className="text-red-500 items-center" />;
      case "Pending":
        return <FaClock size={32} className="text-yellow-500 items-center" />;
      default:
        return null;
    }
  };

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
                <th className="p-3 text-center">Status</th>
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
                  <td className="p-3 text-center">
                    <span className="flex items-center justify-center space-x-2">
                      {getStatusIcon(course.approvalStatus)}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center items-center space-x-4">
  {/* Change status dropdown */}
  <div className="flex justify-center items-center">
    <select
      className="border px-5 py-2 rounded-md text-gray-700 shadow-sm focus:ring focus:ring-indigo-300 disabled:opacity-50"
      value={course.approvalStatus}
      onChange={(e) => handleStatusChange(course._id, e.target.value)}
      disabled={updating === course._id} // Disable when updating
    >
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </select>
    {updating === course._id && <p className="text-sm text-gray-500 ml-2">Updating...</p>}
  </div>

  {/* Navigate to course details page */}
  <button
    onClick={() => router.push(`/super-admin/courses/${course._id}`)}
    className="text-blue-500 hover:text-blue-700 transition ml-4"
  >
    <Eye />
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
