"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { GetAllUniversitiesService, UpdateUniversityStatusService } from "@/app/service/university-service";
import { GeneratePdfService } from "@/app/service/university-service";

const UniversityManagement = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  // Fetch Universities from API
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const data = await GetAllUniversitiesService();
      setUniversities(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch universities.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update Approval Status API Call
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdating(id);
      await UpdateUniversityStatusService(id, newStatus);
      setUniversities((prev) =>
        prev.map((university) =>
          university._id === id ? { ...university, approvalStatus: newStatus } : university
        )
      );
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };
// ✅ Generate & Download PDF
const handleDownloadPDF = async () => {
    try {
      const response = await GeneratePdfService();
  
      // Create a Blob and generate a URL
      const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
  
      // Create a download link
      const a = document.createElement("a");
      a.href = url;
      a.download = "universities.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Free up memory by revoking the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to generate PDF. Try again.");
    }
  };
  

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">University Management</h2>

      {/* Download PDF Button */}
      <button
        onClick={handleDownloadPDF}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2 hover:bg-red-700 transition"
      >
        <FaFilePdf />
        Download PDF
      </button>

      {loading && <p className="text-center text-gray-500">Loading universities...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left">University</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((university) => (
                <tr key={university._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    
                      <img 
                          src={university.logo ? `http://localhost:3020/api/upload/${university.logo}` : "/default_user.png"} 
                        className="w-20 h-auto shadow" 
                      />
                    <span className="text-gray-800 font-medium">{university.universityName}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{university.email}</td>
                  <td className="px-6 py-4 text-gray-600">{university.contactNumber}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white font-semibold text-sm transition ${
                        university.approvalStatus === "Approved"
                          ? "bg-green-500"
                          : university.approvalStatus === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {university.approvalStatus === "Approved" && <FaCheckCircle className="mr-2" />}
                      {university.approvalStatus === "Rejected" && <FaTimesCircle className="mr-2" />}
                      {university.approvalStatus === "Pending" && <FaClock className="mr-2" />}
                      {university.approvalStatus.charAt(0).toUpperCase() + university.approvalStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      className="border px-4 py-2 rounded-md text-gray-700 shadow-sm focus:ring focus:ring-indigo-300 disabled:opacity-50"
                      value={university.approvalStatus}
                      onChange={(e) => handleStatusChange(university._id, e.target.value)}
                      disabled={updating === university._id}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {updating === university._id && <p className="text-sm text-gray-500">Updating...</p>}
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

export default UniversityManagement;
