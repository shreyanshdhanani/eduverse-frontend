"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { ChangePasswordService } from "@/app/service/auth-service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await ChangePasswordService(formData.currentPassword, formData.newPassword);
      toast.success("Password changed successfully! Please log in with your new credentials.");
      
      // Clear storage and redirect to login after a short delay
      setTimeout(() => {
        localStorage.clear();
        router.push("/user-login");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="w-full max-w-lg">
        {/* Decorative Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-200 mb-6 animate-bounce-subtle">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Secure Your Account</h1>
          <p className="text-gray-500 font-medium tracking-tight">University students are required to update their temporary password on first login.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600 opacity-10 group-hover:opacity-100 transition-opacity duration-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Current Temporary Password</label>
              <div className="relative group/input">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors">
                  <KeyRound size={20} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="The password provided to you"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="py-2 flex items-center gap-4">
              <div className="h-px bg-gray-100 flex-1" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Set New Password</span>
              <div className="h-px bg-gray-100 flex-1" />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">New Personal Password</label>
              <div className="relative group/input">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Confirm New Password</label>
              <div className="relative group/input">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors">
                  <CheckCircle2 size={20} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Repeat your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* Security Tip */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 font-bold leading-relaxed tracking-tight italic">
                EduVerse Tip: A strong password should include a mix of uppercase, lowercase, numbers, and symbols to ensure maximum account security.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white text-sm font-black rounded-3xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Update Security Credentials
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">
          Powered by EduVerse Security Architecture
        </p>
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;
