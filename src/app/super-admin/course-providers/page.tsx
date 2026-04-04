"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import axios from "axios";
import { GetAllCourseProviderService } from "@/app/service/course-provider-service";
import { CourseProviderStatusService } from "@/app/service/course-provider-service";

const CourseProviderManagement = () => {
  const [courseProviders, setCourseProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null); // Track updating provider

  useEffect(() => {
    fetchCourseProviders();
  }, []);

  // Fetch Course Providers from API
  const fetchCourseProviders = async () => {
    try {
      setLoading(true);
      const data = await GetAllCourseProviderService();
      setCourseProviders(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch course providers.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update provider status via API
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdating(id); // Show loading state for specific row
      await CourseProviderStatusService(id, newStatus);
      setCourseProviders((prev) =>
        prev.map((provider) =>
          provider._id === id ? { ...provider, status: newStatus } : provider
        )
      );
    } catch (error) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Course Provider Management</h2>

      {loading && <p className="text-center text-gray-500">Loading course providers...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courseProviders.map((provider) => (
                <tr key={provider._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{provider.name}</td>
                  <td className="px-6 py-4 text-gray-600">{provider.email}</td>
                  <td className="px-6 py-4 text-gray-600">{provider.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white font-semibold text-sm transition ${
                        provider.status === "Approved"
                          ? "bg-green-500"
                          : provider.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {provider.status === "Approved" && <FaCheckCircle className="mr-2" />}
                      {provider.status === "Rejected" && <FaTimesCircle className="mr-2" />}
                      {provider.status === "pending" && <FaClock className="mr-2" />}
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      className="border px-4 py-2 rounded-md text-gray-700 shadow-sm focus:ring focus:ring-indigo-300 disabled:opacity-50"
                      value={provider.status}
                      onChange={(e) => handleStatusChange(provider._id, e.target.value)}
                      disabled={updating === provider._id} // Disable when updating
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {updating === provider._id && <p className="text-sm text-gray-500">Updating...</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseProviderManagement;
