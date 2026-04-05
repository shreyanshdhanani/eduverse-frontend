"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { ResetPasswordService } from "../service/auth-service";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Invalid or missing token.", {
        onClose: () => setToken(""),
      });
    }
  }, []);

  const togglePasswordVisibility = (type: string) => {
    if (type === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (type === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required.", {
        onClose: () => {
          setNewPassword("");
          setConfirmPassword("");
        },
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", {
        onClose: () => setConfirmPassword(""),
      });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.", {
        onClose: () => setNewPassword(""),
      });
      return;
    }

    if (token) {
      try {
        const response = await ResetPasswordService(token, newPassword);
        toast.success(response.message, {
          onClose: () => router.push("/user-login"),
        });
      } catch (error: any) {
        toast.error(error.message || "Error resetting password.", {
          onClose: () => setNewPassword(""),
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="w-full max-w-4xl mx-4 flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 text-center">
            <img src="/new_password.svg" alt="Reset Password Illustration" className="w-full max-w-xs mx-auto drop-shadow-2xl" />
            <h2 className="text-white text-2xl font-bold mt-6">Set New Password</h2>
            <p className="text-purple-200 text-sm mt-2">Create a secure password to protect your Eduverse account.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">E</span>
              <span className="text-purple-600">duverse</span>
            </h1>
            <h2 className="text-xl font-bold text-gray-900 mt-2">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-1">Please enter and confirm your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility("new")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility("confirm")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-purple-600/20 active:scale-95"
            >
              Update Password
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-10 text-center border-t border-gray-50 pt-8">
            <p className="text-gray-500 text-sm">
              <a href="/user-login" className="text-purple-600 font-bold hover:underline">
                Back to Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResetPasswordPage;
