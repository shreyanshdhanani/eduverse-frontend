"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import axios from "axios";
import { GetAllCourseProviderService, CourseProviderStatusService } from "@/app/service/course-provider-service";
import { Mail, Phone, ChevronDown, Users } from "lucide-react";

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Approved: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  Rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  Pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
};

const CourseProviderManagement = () => {
  const [courseProviders, setCourseProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseProviders();
  }, []);

  const fetchCourseProviders = async () => {
    try {
      setLoading(true);
      const data = await GetAllCourseProviderService();
      setCourseProviders(Array.isArray(data) ? data : (data as any)?.data || []);
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdating(id);
      await CourseProviderStatusService(id, newStatus);
      setCourseProviders((prev) =>
        prev.map((provider) => provider._id === id ? { ...provider, status: newStatus } : provider)
      );
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
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Course Provider Management</h1>
            <p className="text-xs text-gray-400">{courseProviders.length} providers registered</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">{error}</div>
      )}

      {/* Providers List */}
      {!loading && !error && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courseProviders.map((provider) => {
                    const style = getStatusStyle(provider.status);
                    return (
                      <tr key={provider._id} className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-sm">{provider.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Mail size={11} />{provider.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 flex items-center gap-1.5"><Phone size={12} />{provider.phone || "N/A"}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {provider.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="relative inline-block">
                            <select
                              className="appearance-none border border-gray-200 bg-white pl-3 pr-8 py-2 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 cursor-pointer shadow-sm"
                              value={provider.status}
                              onChange={(e) => handleStatusChange(provider._id, e.target.value)}
                              disabled={updating === provider._id}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          {updating === provider._id && (
                            <p className="text-[10px] text-purple-500 mt-1 font-medium">Updating...</p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {courseProviders.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No course providers found.</div>
              )}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {courseProviders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100 text-sm">
                No course providers found.
              </div>
            ) : courseProviders.map((provider) => {
              const style = getStatusStyle(provider.status);
              return (
                <div key={provider._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  {/* Provider Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">{provider.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                        <Mail size={11} />{provider.email}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone size={11} />{provider.phone || "N/A"}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ml-2 ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {provider.status}
                    </span>
                  </div>
                  
                  {/* Status Update */}
                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50">
                    <span className="text-xs font-semibold text-gray-500 shrink-0">Change Status:</span>
                    <div className="relative flex-1">
                      <select
                        className="appearance-none w-full border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
                        value={provider.status}
                        onChange={(e) => handleStatusChange(provider._id, e.target.value)}
                        disabled={updating === provider._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {updating === provider._id && (
                      <span className="text-[10px] text-purple-500 font-medium shrink-0">Saving...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseProviderManagement;
