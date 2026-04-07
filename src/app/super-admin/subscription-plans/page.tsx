"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle, XCircle, CreditCard, Users, BookOpen, AlertCircle } from "lucide-react";
import { 
  GetAllSubscriptionPlansService, 
  CreateSubscriptionPlanService, 
  UpdateSubscriptionPlanService, 
  DeleteSubscriptionPlanService 
} from "@/app/service/university-service";
import axios from "axios";
import { useModal } from "@/components/ModalProvider";

const SubscriptionPlansPage = () => {
  const { showAlert, showConfirm } = useModal();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    planName: "",
    price: 0,
    maxStudents: 0,
    maxCoursesPerStudent: 0,
    description: "",
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await GetAllSubscriptionPlansService();
      setPlans(Array.isArray(data) ? data : (data as any)?.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      planName: "",
      price: 0,
      maxStudents: 0,
      maxCoursesPerStudent: 0,
      description: "",
      isActive: true
    });
    setEditingPlan(null);
  };

  const handleOpenModal = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        planName: plan.planName,
        price: plan.price,
        maxStudents: plan.maxStudents,
        maxCoursesPerStudent: plan.maxCoursesPerStudent,
        description: plan.description || "",
        isActive: plan.isActive
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingPlan) {
        await UpdateSubscriptionPlanService(editingPlan._id, formData);
        showAlert({ message: "Plan updated successfully!", type: "success" });
      } else {
        await CreateSubscriptionPlanService(formData);
        showAlert({ message: "Plan created successfully!", type: "success" });
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      showAlert({ message: err.message || "Operation failed", type: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Delete Plan",
      message: "Are you sure you want to delete this plan? This action cannot be undone.",
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel"
    });
    
    if (!confirmed) return;
    
    try {
      await DeleteSubscriptionPlanService(id);
      fetchPlans();
      showAlert({ message: "Plan deleted successfully!", type: "success" });
    } catch (err: any) {
      showAlert({ message: err.message || "Delete failed", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <CreditCard className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-sm text-gray-500">Manage plan templates for universities</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95"
        >
          <Plus size={18} />
          Create New Plan
        </button>
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative group">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="p-2 bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors border border-gray-100"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="p-2 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {plan.isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{plan.planName}</h3>
                <p className="text-2xl font-black text-purple-600 mt-1">${plan.price}<span className="text-xs font-normal text-gray-400">/plan</span></p>
              </div>

              <div className="space-y-3 flex-1 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-50">
                  <Users className="text-gray-400" size={16} />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Max Students</p>
                    <p className="text-sm font-bold text-gray-700 mt-1">{plan.maxStudents} Students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-50">
                  <BookOpen className="text-gray-400" size={16} />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Free Courses</p>
                    <p className="text-sm font-bold text-gray-700 mt-1">{plan.maxCoursesPerStudent} per student</p>
                  </div>
                </div>
              </div>

              {plan.description && (
                <p className="text-xs text-gray-500 mb-6 italic">"{plan.description}"</p>
              )}
              
              <button 
                onClick={() => handleOpenModal(plan)}
                className="w-full py-2.5 bg-gray-50 hover:bg-purple-600 text-gray-700 hover:text-white text-xs font-bold rounded-xl transition-all border border-gray-100 hover:border-purple-600"
              >
                Edit Details
              </button>
            </div>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
              <CreditCard size={48} className="mb-4 opacity-20" />
              <p className="font-medium">No subscription plans found</p>
              <button onClick={() => handleOpenModal()} className="text-purple-600 text-sm font-bold mt-2 hover:underline">
                Create your first plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">{editingPlan ? "Edit Plan" : "Create New Plan"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <XCircle size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Plan Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Enterprise Pro"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all text-sm outline-none"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Price ($)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all text-sm outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Max Students</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all text-sm outline-none"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Free Courses per Student</label>
                <input
                  required
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all text-sm outline-none"
                  value={formData.maxCoursesPerStudent}
                  onChange={(e) => setFormData({ ...formData, maxCoursesPerStudent: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-600 transition-all text-sm outline-none resize-none"
                  placeholder="Tell us about the plan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer">Active Plan</label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : (editingPlan ? "Update Plan" : "Create Plan")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlansPage;
