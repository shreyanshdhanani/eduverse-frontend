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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex w-3/5 rounded-lg overflow-hidden">
        {/* Left Side Image */}
        <div className="w-1/2 flex justify-center items-center">
          <img src="/forgot_password.svg" alt="Forgot Password Illustration" className="w-full h-auto object-cover" />
        </div>

        {/* Right Side Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Forgot Password</h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 p-3 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting} // Disable while submitting
                />
                <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full p-3 rounded font-semibold ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 text-white"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Password Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remembered your password?{" "}
              <a href="/user-login" className="text-purple-600 font-semibold">Login</a>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgotPasswordPage;
