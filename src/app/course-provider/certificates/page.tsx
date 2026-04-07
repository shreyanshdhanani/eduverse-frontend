"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/service/axiosInstance";
import { Award, BookOpen, User, Calendar, Search, Download } from "lucide-react";

interface Certificate {
  _id: string;
  courseTitle: string;
  studentName: string;
  providerName: string;
  issuedAt: string;
  courseId?: { title: string };
  studentId?: { name: string; email: string };
}

export default function ProviderCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res: any = await axiosInstance.get("/course-provider/certificates");
        setCertificates(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const filtered = certificates.filter((cert) => {
    const q = search.toLowerCase();
    const studentName = cert.studentId?.name || cert.studentName || "";
    const courseTitle = cert.courseId?.title || cert.courseTitle || "";
    return studentName.toLowerCase().includes(q) || courseTitle.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">Certificates Issued</h1>
          <p className="text-gray-500 font-bold mt-1">All completion certificates earned by your students</p>
        </div>
        <div className="px-6 py-4 bg-purple-50 border border-purple-100 rounded-2xl text-center">
          <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Total Issued</p>
          <p className="text-3xl font-black text-gray-950">{certificates.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-purple-300 transition-all font-bold text-gray-950 placeholder:text-gray-400"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-amber-50 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={36} />
          </div>
          <h3 className="text-xl font-black text-gray-950">No Certificates Yet</h3>
          <p className="text-gray-500 font-bold mt-2 max-w-xs mx-auto">
            {search ? "No results for your search." : "Once students pass the final exam, their certificates will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-8 py-5 bg-gray-50 border-b border-gray-100">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Student</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Course</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Date Issued</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Certificate ID</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {filtered.map((cert) => {
              const studentName = cert.studentId?.name || cert.studentName;
              const studentEmail = cert.studentId?.email || "";
              const courseTitle = cert.courseId?.title || cert.courseTitle;
              const date = new Date(cert.issuedAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              });

              return (
                <div key={cert._id} className="grid grid-cols-4 gap-4 px-8 py-6 items-center hover:bg-purple-50/30 transition-colors">
                  {/* Student */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-950 truncate text-sm">{studentName}</p>
                      <p className="text-[10px] text-gray-500 font-bold truncate">{studentEmail}</p>
                    </div>
                  </div>

                  {/* Course */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} className="text-purple-600" />
                    </div>
                    <p className="font-black text-gray-800 truncate text-sm">{courseTitle}</p>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="font-black text-gray-700 text-sm">{date}</span>
                  </div>

                  {/* ID */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
                      <Award size={12} className="text-amber-600" />
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
                        {cert._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
