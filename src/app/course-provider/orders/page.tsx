"use client";

import React, { useEffect, useState } from "react";
import {
  GetProviderOrdersService,
  GetProviderEarningsAnalyticsService,
} from "@/app/service/course-provider-service";
import { CreditCard, TrendingUp, BookOpen, AlertCircle } from "lucide-react";

export default function EarningsAndOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersRes, analyticsRes] = await Promise.all([
        GetProviderOrdersService(),
        GetProviderEarningsAnalyticsService(),
      ]);

      if (ordersRes?.data) setOrders(ordersRes.data);
      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                ₹{analytics?.totalEarnings?.toLocaleString() || 0}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {analytics?.totalOrders || 0}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Courses Sold</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {analytics?.coursesBreakdown?.length || 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Breakdown */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Sales Breakdown</h2>
          {analytics?.coursesBreakdown?.length === 0 ? (
            <p className="text-gray-500 text-sm">No sales data available yet.</p>
          ) : (
            <div className="space-y-4">
              {analytics?.coursesBreakdown?.map((course: any) => (
                <div key={course.courseId} className="flex justify-between items-center">
                  <div className="border-l-2 pl-2 border-purple-300">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500">{course.count} enrollments</p>
                  </div>
                  <p className="font-bold text-green-600">₹{course.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 10).map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{order.userId?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">{order.userId?.email || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 max-w-[200px] truncate" title={order.courseId?.title}>
                          {order.courseId?.title || "Unknown Course"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ₹{order.amount?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length > 10 && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">Showing 10 most recent orders</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
