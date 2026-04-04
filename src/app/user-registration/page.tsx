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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex w-3/5 rounded-lg overflow-hidden">
        <div className="w-1/2 flex justify-center items-center">
          <img src="/login_student.svg" alt="Login Illustration" className="w-full h-auto object-cover" />
        </div>

        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign up with email</h2>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 rounded"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 pr-10 p-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white p-3 rounded font-semibold flex justify-center items-center"
          >
            Sign up with email
          </button>

          <div className="mt-6 border-t border-gray-300 pt-4 text-center">
            <p className="text-gray-600">
              Already have an account? <a href="/user-login" className="text-purple-600 font-semibold">Log in</a>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentRegistrationPage;
