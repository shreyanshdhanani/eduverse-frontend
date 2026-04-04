"use client";

import React, { useState, useEffect } from "react";
import { Eye, Upload } from "lucide-react";
import axios from "axios"; // Import axios
import { GetAllStudentByUniversity, UploadCSVService } from "@/app/service/university-service";
import { FaUpload } from "react-icons/fa";


const StudentManagement = () => {
  const [students, setStudents] = useState<any[]>([]); // Set initial state to an empty array
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentData = await GetAllStudentByUniversity();
        setStudents(studentData); // Set the student data from API response
      } catch (err: any) {
        setError("Failed to load student data.");
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to handle file upload
  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploaded file:", file.name);
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Authentication required. Please log in.");
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("universityId", authToken); // Pass the university ID here

      try {
        // Call the uploadCSVService to handle the backend file processing
        const response = await UploadCSVService(formData);

        alert("CSV uploaded and students invited successfully!");
        console.log(response.data); // For debugging

        // Optionally, you could refetch student data after successful upload
        const studentData = await GetAllStudentByUniversity();
        setStudents(studentData);

      } catch (err: any) {
        console.error("Error uploading file:", err);
        setError("Failed to upload the CSV file.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Student Management
        </h2>
        {/* Upload Button */}
        <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition flex items-center gap-2">
          <FaUpload size={18} /> Upload CSV
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {loading && <p>Loading student data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-center">
                  <button onClick={() => "green"} className="text-blue-500">
                          <Eye />
                        </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
