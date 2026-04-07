"use client";

import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { 
  GetAllUniversitiesService, 
  UpdateUniversityStatusService, 
  GeneratePdfService, 
  GetAllSubscriptionPlansService, 
  AssignSubscriptionPlanService 
} from "@/app/service/university-service";
import { Mail, Phone, Globe, ChevronDown, Building2, CreditCard, Calendar, X } from "lucide-react";
import { getAssetUrl } from "@/app/utils/asset-url";

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Approved: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  Rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  Pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
};

const UniversityManagement = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Subscription Assignment State
  const [plans, setPlans] = useState<any[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [assignData, setAssignData] = useState({ planId: "", durationDays: 365 });
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    fetchUniversities();
    fetchPlans();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const data = await GetAllUniversitiesService();
      setUniversities(Array.isArray(data) ? data : (data as any)?.data || []);
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

  const fetchPlans = async () => {
    try {
      const data = await GetAllSubscriptionPlansService();
      setPlans(Array.isArray(data) ? data : (data as any)?.data || []);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdating(id);
      await UpdateUniversityStatusService(id, newStatus);
      setUniversities((prev) =>
        prev.map((u) => u._id === id ? { ...u, approvalStatus: newStatus } : u)
      );
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleAssignPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignData.planId) return alert("Please select a plan");
    setAssignLoading(true);
    try {
      await AssignSubscriptionPlanService({
        universityId: selectedUniversity._id,
        planId: assignData.planId,
        durationDays: assignData.durationDays
      });
      alert("Plan assigned successfully!");
      setIsAssignModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to assign plan");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await GeneratePdfService();
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "universities.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate PDF. Try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const getStatusStyle = (status: string) => statusStyles[status] || statusStyles["Pending"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 size={20} className="text-violet-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">University Management</h1>
              <p className="text-xs text-gray-400">{universities.length} universities registered</p>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 shadow-sm shadow-red-200 active:scale-95 w-full sm:w-auto"
          >
            <FaFilePdf size={14} />
            {pdfLoading ? "Generating..." : "Export PDF"}
          </button>
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

      {/* Universities List */}
      {!loading && !error && (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">University</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Website</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Subscription</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((university) => {
                    const style = getStatusStyle(university.approvalStatus);
                    return (
                      <tr key={university._id} className="border-b border-gray-50 hover:bg-violet-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getAssetUrl(university.logo)}
                              className="w-10 h-10 rounded-lg object-contain border border-gray-100 bg-gray-50 flex-shrink-0"
                              alt={university.universityName}
                            />
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{university.universityName}</p>
                              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Mail size={10} />{university.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 flex items-center gap-1.5"><Phone size={12} />{university.contactNumber || "N/A"}</p>
                        </td>
                        <td className="px-6 py-4">
                          {university.website ? (
                            <a href={university.website} target="_blank" rel="noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                              <Globe size={12} /> Visit
                            </a>
                          ) : <span className="text-sm text-gray-400">N/A</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {university.approvalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedUniversity(university);
                              setIsAssignModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-purple-100"
                          >
                            <CreditCard size={12} />
                            Assign Plan
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="relative inline-block">
                            <select
                              className="appearance-none border border-gray-200 bg-white pl-3 pr-8 py-2 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 cursor-pointer shadow-sm"
                              value={university.approvalStatus}
                              onChange={(e) => handleStatusChange(university._id, e.target.value)}
                              disabled={updating === university._id}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          {updating === university._id && <p className="text-[10px] text-purple-500 mt-1">Updating...</p>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {universities.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No universities found.</div>
              )}
            </div>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="lg:hidden space-y-3">
            {universities.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100 text-sm">
                No universities found.
              </div>
            ) : universities.map((university) => {
              const style = getStatusStyle(university.approvalStatus);
              return (
                <div key={university._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={getAssetUrl(university.logo)}
                      className="w-12 h-12 rounded-xl object-contain border border-gray-100 bg-gray-50 flex-shrink-0"
                      alt={university.universityName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-gray-900 text-sm truncate">{university.universityName}</p>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${style.bg} ${style.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {university.approvalStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate"><Mail size={10} />{university.email}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone size={10} />{university.contactNumber || "N/A"}</p>
                    </div>
                  </div>

                  {university.website && (
                    <a href={university.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-600 hover:underline mb-3">
                      <Globe size={11} /> Visit Website
                    </a>
                  )}

                  <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => {
                        setSelectedUniversity(university);
                        setIsAssignModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-purple-100 active:scale-[0.98] transition-transform"
                    >
                      <CreditCard size={14} />
                      Assign Subscription Plan
                    </button>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-gray-500 shrink-0">Status:</span>
                      <div className="relative flex-1">
                        <select
                          className="appearance-none w-full border border-gray-200 bg-white pl-3 pr-8 py-2 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 cursor-pointer"
                          value={university.approvalStatus}
                          onChange={(e) => handleStatusChange(university._id, e.target.value)}
                          disabled={updating === university._id}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {updating === university._id && <span className="text-[10px] text-purple-500 shrink-0">Saving...</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Assign Plan Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Assign Subscription</h2>
                <p className="text-xs text-gray-400 mt-1">For {selectedUniversity?.universityName}</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAssignPlan} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Plan</label>
                <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {plans.map((plan) => (
                    <label 
                      key={plan._id} 
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        assignData.planId === plan._id 
                          ? 'border-purple-600 bg-purple-50/5 ring-2 ring-purple-100' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-600"
                          checked={assignData.planId === plan._id}
                          onChange={() => setAssignData({ ...assignData, planId: plan._id })}
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{plan.planName}</p>
                          <p className="text-[10px] text-gray-500">{plan.maxStudents} Students • {plan.maxCoursesPerStudent} Courses</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-purple-600">${plan.price}</p>
                    </label>
                  ))}
                  {plans.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                       <CreditCard size={24} className="mx-auto text-gray-300 mb-2" />
                       <p className="text-xs text-gray-400">No active plans found.<br/>Please create plans first.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Duration (Days)</label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all text-sm outline-none"
                    value={assignData.durationDays}
                    onChange={(e) => setAssignData({ ...assignData, durationDays: Number(e.target.value) })}
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignLoading || !assignData.planId}
                  className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-50"
                >
                  {assignLoading ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityManagement;
