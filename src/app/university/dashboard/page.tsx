"use client";

import { useEffect, useState } from "react";
import { GetUniversityDashboardData } from "@/app/service/university-service";
import { PiStudent, PiCertificate, PiGlobe, PiShieldCheck } from "react-icons/pi";
import { LuTrendingUp } from "react-icons/lu";

interface DashboardData {
    totalStudents: number;
    enrolledCount: number;
    subscriptionPlan: string;
    universityName: string;
    approvalStatus: string;
    subscriptionDetails?: {
        maxStudents: number;
        maxCoursesPerStudent: number;
    } | null;
}

export default function UniversityDashboard() {
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await GetUniversityDashboardData();
                setStats(data as any);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {stats?.universityName}</h1>
                    <p className="text-gray-500">Here's what's happening with your university today.</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    stats?.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    Status: {stats?.approvalStatus}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Students" 
                    value={stats?.totalStudents || 0} 
                    icon={<PiStudent size={24} />} 
                    color="purple"
                    trend="+5% this month"
                />
                <StatCard 
                    title="Enrolled Students" 
                    value={stats?.enrolledCount || 0} 
                    icon={<PiCertificate size={24} />} 
                    color="blue"
                    trend="In courses"
                />
                {stats?.subscriptionPlan && stats.subscriptionPlan !== 'No Active Plan' && (
                    <StatCard 
                        title="Active Plan" 
                        value={stats.subscriptionPlan} 
                        icon={<PiShieldCheck size={24} />} 
                        color="pink"
                        trend={stats?.subscriptionDetails ? `Seats: ${stats.subscriptionDetails.maxStudents} • Crs/Std: ${stats.subscriptionDetails.maxCoursesPerStudent}` : null}
                        trendIcon={false}
                    />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-left group">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 mb-3 shadow-sm group-hover:scale-110 transition">
                                <PiStudent size={20} />
                            </div>
                            <span className="font-medium text-gray-800 block">Add Student</span>
                            <span className="text-xs text-gray-500">Manual or bulk upload</span>
                        </button>
                        <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-left group">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 mb-3 shadow-sm group-hover:scale-110 transition">
                                <PiCertificate size={20} />
                            </div>
                            <span className="font-medium text-gray-800 block">Certifications</span>
                            <span className="text-xs text-gray-500">View issued certificates</span>
                        </button>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                        <LuTrendingUp size={32} />
                    </div>
                    <h3 className="text-lg font-semibold">Growth Analytics</h3>
                    <p className="text-gray-500 max-w-xs mt-2">
                        Detailed student enrollment trends and course performance metrics.
                    </p>
                    <button className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition">
                        View Reports
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, trend, trendIcon = true }: any) {
    const colorMap: any = {
        purple: "bg-purple-600",
        blue: "bg-blue-600",
        pink: "bg-pink-600"
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h2 className="text-3xl font-bold mt-2 text-gray-900">{value}</h2>
                    {trend && (
                        <p className={`mt-2 text-xs font-medium flex items-center ${trendIcon ? 'text-green-600' : 'text-purple-600'}`}>
                            {trendIcon && <LuTrendingUp className="mr-1" />} {trend}
                        </p>
                    )}
                </div>
                <div className={`${colorMap[color]} text-white p-3 rounded-xl shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
