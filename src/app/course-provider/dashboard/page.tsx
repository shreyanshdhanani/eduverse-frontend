"use client";
import React, { useState, useEffect } from "react";
import { Users, FilePlus, PlayCircle, BookOpen } from "lucide-react";
import { CourseProviderDashboardService } from "@/app/service/course-provider-service";
import { MdPending } from "react-icons/md";
import { FaCheck, FaClock, FaTimesCircle } from "react-icons/fa";

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalApprovedCourses: 0,
    totalPendingCourses: 0,
    totalRejectedCourses: 0,
    totalEnrolledStudents: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authToken = localStorage.getItem("authToken"); // or get from props/context
        const response = await CourseProviderDashboardService(authToken)

        if (response) {
          console.log('response', response)
          const data = response;
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <BookOpen className="text-blue-600 w-8 h-8 mx-auto" />
        <h3 className="text-lg font-semibold mt-4">Total Courses</h3>
        <p className="text-2xl font-bold">{dashboardData.totalCourses}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <FaCheck className="text-green-600 w-8 h-8 mx-auto" />
        <h3 className="text-lg font-semibold mt-4">Approved Courses</h3>
        <p className="text-2xl font-bold">{dashboardData.totalApprovedCourses}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <FaClock className="text-blue-600 w-8 h-8 mx-auto" />
        <h3 className="text-lg font-semibold mt-4">Pending Courses</h3>
        <p className="text-2xl font-bold">{dashboardData.totalPendingCourses}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <FaTimesCircle className="text-red-600 w-8 h-8 mx-auto" />
        <h3 className="text-lg font-semibold mt-4">Rejected Courses</h3>
        <p className="text-2xl font-bold">{dashboardData.totalRejectedCourses}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center col-span-full sm:col-span-2 md:col-span-2 lg:col-span-1">
        <Users className="text-purple-600 w-8 h-8 mx-auto" />
        <h3 className="text-lg font-semibold mt-4">Enrolled Students</h3>
        <p className="text-2xl font-bold">{dashboardData.totalEnrolledStudents}</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
