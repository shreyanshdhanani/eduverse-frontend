"use client";

import React, { useState, useEffect } from "react";
import { Eye, Upload, Plus, X, UserPlus, Mail, Lock, User, ShieldCheck, CheckCircle2, Download } from "lucide-react";
import { GetAllStudentByUniversity, UploadCSVService, AddStudentManualService } from "@/app/service/university-service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentManagement = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Manual student form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentData = await GetAllStudentByUniversity();
      setStudents(Array.isArray(studentData) ? studentData : (studentData as any).data || []);
    } catch (err: any) {
      setError("Failed to load student data.");
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("universityId", localStorage.getItem("authToken") || "");

    try {
      await UploadCSVService(formData);
      toast.success("CSV uploaded and students registered successfully!");
      fetchStudents();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload CSV.");
    } finally {
      setLoading(false);
      event.target.value = null; // Clear input
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.warn("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await AddStudentManualService(formData);
      toast.success("Student added successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "" });
      fetchStudents();
    } catch (err: any) {
      toast.error(err.message || "Failed to add student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Management</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium italic">Manage your university's student body and course access</p>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href="/sample_students.csv" 
            download="sample_students.csv"
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 text-sm font-black rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-all active:scale-95 group"
            title="Download CSV Template"
          >
            <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
            Template
          </a>
          
          <label className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 text-sm font-black rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all active:scale-95 group">
            <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
            Upload CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            Add Student
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Courses Used</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Security</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                 [1,2,3,4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6 h-16 bg-gray-50/20" />
                  </tr>
                 ))
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                          {student.name.substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">{student.email}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-violet-50 text-violet-700 text-[10px] font-black rounded-full border border-violet-100">
                          {student.freeCoursesUsed || 0} ENROLLED
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       {student.mustChangePassword ? (
                         <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-wider">
                           <Lock size={12} /> Pending Setup
                         </span>
                       ) : (
                         <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                           <CheckCircle2 size={12} /> Verified
                         </span>
                       )}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <User size={32} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-sm font-medium">No students registered yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Add New Student</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manual Registration</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
              >
                <X size={20} className="text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            
            <form onSubmit={handleManualSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Student Full Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Institutional Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Temporary Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                  />
                </div>
                <p className="text-[10px] text-amber-600 font-bold leading-relaxed px-1">
                  * Student will be forced to update this password on their first login.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-indigo-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Register Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
