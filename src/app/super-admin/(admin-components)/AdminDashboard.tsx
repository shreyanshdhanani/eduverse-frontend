"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import {
  Users,
  DollarSign,
  PlayCircle,
  BookOpen,
  Activity,
  TrendingUp,
  CheckCircle,
  School,
} from "lucide-react";
import "chart.js/auto";
import { Dashboard } from "@/app/service/super-admin.service";

const API_URL = process.env.API_URL || "http://localhost:3020/api";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    countUser: 0,
    countCourseProviders: 0,
    countUniversity: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await Dashboard();
        setDashboardData(response.data);
        console.log('dashboardData', dashboardData)
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-500">Overview of platform performance</p>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <AnalyticsCard
          title="Total Users"
          value={dashboardData.countUser}
          icon={<School className="text-purple-600" />}
        />
        <AnalyticsCard
          title="Total Course Providers"
          value={dashboardData.countCourseProviders}
          icon={<Users className="text-blue-600" />}
        />
        <AnalyticsCard
          title="Total Universities"
          value={dashboardData.countUniversity}
          icon={<BookOpen className="text-yellow-600" />}
        />
      </div>
    </div>
  );
}

/* Analytics Card Component */
function AnalyticsCard({ title, value, icon }: any) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h4 className="text-gray-600 text-sm">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
