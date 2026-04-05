"use client";

import { useEffect, useState } from "react";
import { Dashboard } from "@/app/service/super-admin.service";
import { PiStudent } from "react-icons/pi";
import { LiaChalkboardTeacherSolid, LiaUniversitySolid } from "react-icons/lia";
import { Folders, GalleryHorizontalEnd, List, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    countUser: 0,
    countCourseProviders: 0,
    countPendingCourseProviders: 0,
    countApprovedCourseProviders: 0,
    countRejectedCourseProviders: 0,
    countUniversity: 0,
    countPendingUniversities: 0,
    countApprovedUniversities: 0,
    countRejectedUniversities: 0,
    countCategories: 0,
    countSubcategories: 0,
    countTopics: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await Dashboard();
        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening on Eduverse today.</p>
      </div>

      {/* Top-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Total Students"
          value={dashboardData.countUser}
          icon={<PiStudent size={22} />}
          color="purple"
          trend="+12% this month"
        />
        <StatCard
          title="Course Providers"
          value={dashboardData.countCourseProviders}
          icon={<LiaChalkboardTeacherSolid size={22} />}
          color="indigo"
          trend={`${dashboardData.countApprovedCourseProviders} approved`}
        />
        <StatCard
          title="Universities"
          value={dashboardData.countUniversity}
          icon={<LiaUniversitySolid size={22} />}
          color="violet"
          trend={`${dashboardData.countApprovedUniversities} approved`}
        />
      </div>

      {/* Course Providers Section */}
      <SectionHeader title="Course Providers" subtitle="Approval status breakdown" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatusCard
          title="Approved"
          value={dashboardData.countApprovedCourseProviders}
          icon={<LiaChalkboardTeacherSolid size={20} />}
          status="success"
        />
        <StatusCard
          title="Pending Review"
          value={dashboardData.countPendingCourseProviders}
          icon={<LiaChalkboardTeacherSolid size={20} />}
          status="warning"
        />
        <StatusCard
          title="Rejected"
          value={dashboardData.countRejectedCourseProviders}
          icon={<LiaChalkboardTeacherSolid size={20} />}
          status="danger"
        />
      </div>

      {/* Universities Section */}
      <SectionHeader title="Universities" subtitle="Approval status breakdown" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatusCard
          title="Approved"
          value={dashboardData.countApprovedUniversities}
          icon={<LiaUniversitySolid size={20} />}
          status="success"
        />
        <StatusCard
          title="Pending Review"
          value={dashboardData.countPendingUniversities}
          icon={<LiaUniversitySolid size={20} />}
          status="warning"
        />
        <StatusCard
          title="Rejected"
          value={dashboardData.countRejectedUniversities}
          icon={<LiaUniversitySolid size={20} />}
          status="danger"
        />
      </div>

      {/* Content Hierarchy */}
      <SectionHeader title="Content Structure" subtitle="Categories, subcategories & topics" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Categories"
          value={dashboardData.countCategories}
          icon={<Folders size={20} />}
          color="purple"
        />
        <StatCard
          title="Subcategories"
          value={dashboardData.countSubcategories}
          icon={<GalleryHorizontalEnd size={20} />}
          color="indigo"
        />
        <StatCard
          title="Topics"
          value={dashboardData.countTopics}
          icon={<List size={20} />}
          color="violet"
        />
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div>
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <div className="flex-1 h-px bg-gray-100 ml-2" />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color = "purple",
  trend,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
}) {
  const colors: Record<string, string> = {
    purple: "from-purple-500 to-purple-700",
    indigo: "from-indigo-500 to-indigo-700",
    violet: "from-violet-500 to-violet-700",
  };

  const bg: Record<string, string> = {
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${bg[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
            <TrendingUp size={10} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}

function StatusCard({
  title,
  value,
  icon,
  status,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  status: "success" | "warning" | "danger";
}) {
  const styles = {
    success: { bg: "bg-green-50", text: "text-green-600", badge: "bg-green-100 text-green-700", dot: "bg-green-500" },
    warning: { bg: "bg-yellow-50", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
    danger: { bg: "bg-red-50", text: "text-red-600", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  };
  const s = styles[status];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-2.5 rounded-xl ${s.bg} ${s.text}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{title}</p>
      </div>
      <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
    </div>
  );
}
