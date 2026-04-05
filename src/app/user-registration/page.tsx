"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { UserRegistrationService } from "../service/auth-service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentRegistrationPage = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Check if the user is already logged in (by checking token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // If a token is found, redirect the user to the home page
      router.push('/');
    }
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let formErrors = { fullName: "", email: "", password: "" };
    let hasError = false;

    if (!fullName.trim()) {
      formErrors.fullName = "Full Name is required.";
      toast.error("⚠️ Full Name is required.", {
        onClose: () => setErrors((prev) => ({ ...prev, fullName: "" })),
      });
      hasError = true;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      formErrors.email = "Email is required.";
      toast.error("⚠️ Email is required.", {
        onClose: () => setErrors((prev) => ({ ...prev, email: "" })),
      });
      hasError = true;
    } else if (!emailRegex.test(email)) {
      formErrors.email = "Please enter a valid email address.";
      toast.error("⚠️ Please enter a valid email.", {
        onClose: () => setErrors((prev) => ({ ...prev, email: "" })),
      });
      hasError = true;
    }

    if (!password.trim()) {
      formErrors.password = "Password is required.";
      toast.error("⚠️ Password is required.", {
        onClose: () => setErrors((prev) => ({ ...prev, password: "" })),
      });
      hasError = true;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
      toast.error("⚠️ Password must be at least 6 characters.", {
        onClose: () => setErrors((prev) => ({ ...prev, password: "" })),
      });
      hasError = true;
    } else if (!/[0-9]/.test(password)) {
      formErrors.password = "Password must contain at least one number.";
      toast.error("⚠️ Password must include a number.", {
        onClose: () => setErrors((prev) => ({ ...prev, password: "" })),
      });
      hasError = true;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      formErrors.password = "Password must contain at least one special character.";
      toast.error("⚠️ Password must include a special character.", {
        onClose: () => setErrors((prev) => ({ ...prev, password: "" })),
      });
      hasError = true;
    }

    setErrors(formErrors);
    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await UserRegistrationService(fullName, email, password);
        toast.success(" Registration successful!", {
          autoClose: 3000,
          onClose: () => setErrors({ fullName: "", email: "", password: "" }),
        });
        setTimeout(() => router.push("/user-login"), 3000);
      } catch (error: any) {
        toast.error(error.message || "❌ Registration failed. Please try again.", {
          onClose: () => setErrors({ fullName: "", email: "", password: "" }),
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="w-full max-w-4xl mx-4 flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 text-center">
            <img src="/login_student.svg" alt="Registration Illustration" className="w-full max-w-xs mx-auto drop-shadow-2xl" />
            <h2 className="text-white text-2xl font-bold mt-6">Join Eduverse Today!</h2>
            <p className="text-purple-200 text-sm mt-2">Start your learning journey with the best resources and a global community.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">E</span>
              <span className="text-purple-600">duverse</span>
            </h1>
            <h2 className="text-xl font-bold text-gray-900 mt-2">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details to register as a student</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-purple-600/20 active:scale-95"
            >
              Sign Up for Free
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/user-login" className="text-purple-600 font-semibold hover:underline">
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

export default StudentRegistrationPage;
