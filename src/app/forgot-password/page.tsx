"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";
import { ToastContainer, toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ForgotPasswordService } from "../service/auth-service";
import { useRouter } from "next/navigation"; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastId = useRef<Id | null>(null); // Store toast ID to prevent duplicates
  const router = useRouter(); // Initialize Next.js router

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        router.push("/");
      }
    }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email.trim()) {
      if (!toastId.current) {
        toastId.current = toast.error("⚠️ Email is required.", { 
          onClose: () => (toastId.current = null) 
        });
      }
      setIsSubmitting(false);
      return;
    }

    if (!emailRegex.test(email)) {
      if (!toastId.current) {
        toastId.current = toast.error("⚠️ Please enter a valid email address.", { 
          onClose: () => (toastId.current = null) 
        });
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await ForgotPasswordService(email);
      toast.success(response.message || "Password reset link sent!", { 
        autoClose: 3000, 
        onClose: () => {
          setEmail(""); // Reset email field
          router.push("/user-login"); // Redirect to login after success
        }
      });
      toastId.current = null; // Reset toast ID after success
    } catch (error: any) {
      if (!toastId.current) {
        toastId.current = toast.error(error.message || "❌ An error occurred. Please try again.", { 
          onClose: () => (toastId.current = null) 
        });
      }
    } finally {
      setIsSubmitting(false);
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
            <img src="/forgot_password.svg" alt="Forgot Password Illustration" className="w-full max-w-xs mx-auto drop-shadow-2xl" />
            <h2 className="text-white text-2xl font-bold mt-6">Forgot your password?</h2>
            <p className="text-purple-200 text-sm mt-2">Don't worry! Enter your email and we'll send you a link to reset it.</p>
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
            <h2 className="text-xl font-bold text-gray-900 mt-2">Recover Password</h2>
            <p className="text-gray-500 text-sm mt-1">We'll send you instructions to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed text-white shadow-none" 
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-10 text-center border-t border-gray-50 pt-8">
            <p className="text-gray-500 text-sm">
              Remembered your password?{" "}
              <a href="/user-login" className="text-purple-600 font-bold hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgotPasswordPage;
