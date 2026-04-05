"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaPhone, FaMapMarkerAlt, FaEnvelope, FaUser } from 'react-icons/fa';
import { CourseProviderRegistrationService } from "../service/course-provider-service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseProviderRegistrationPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    contactNumber: "",
  });

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        router.push("/");
      }
    }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let formErrors = { name: "", email: "", password: "", address: "", contactNumber: "" };

    if (!name.trim()) formErrors.name = "Name is required.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) formErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) formErrors.email = "Please enter a valid email address.";
    if (!password.trim()) formErrors.password = "Password is required.";
    else if (password.length < 6) formErrors.password = "Password must be at least 6 characters long.";
    else if (!/[0-9]/.test(password)) formErrors.password = "Password must contain at least one number.";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) formErrors.password = "Password must contain at least one special character.";
    if (!address.trim()) formErrors.address = "Address is required.";
    const contactNumberRegex = /^[0-9]{10}$/;
    if (!contactNumber.trim()) formErrors.contactNumber = "Contact number is required.";
    else if (!contactNumberRegex.test(contactNumber)) formErrors.contactNumber = "Please enter a valid 10-digit contact number.";

    setErrors(formErrors);
    return !Object.values(formErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true); // Disable button after first click

    try {
      await CourseProviderRegistrationService(name, email, password, contactNumber, address);
      
      toast.success("Registration successful! You will be notified when your account is approved.", { position: "top-right" });

      setTimeout(() => {
        router.push("/user-login"); // Redirect after success
      }, 2000);

    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again later.", { position: "top-right" });
      setIsSubmitting(false); // Re-enable button on failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 text-center text-white">
            <img src="/course_provider.svg" alt="Course Provider Illustration" className="w-full max-w-xs mx-auto drop-shadow-2xl" />
            <h2 className="text-2xl font-bold mt-8">Join Our Community</h2>
            <p className="text-purple-100 text-sm mt-3 leading-relaxed">
              Become a verified course provider and help millions of students achieve their goals.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          {/* Logo */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">E</span>
              <span className="text-purple-600">duverse</span>
            </h1>
            <h2 className="text-xl font-bold text-gray-900 mt-2">Provider Registration</h2>
            <p className="text-gray-500 text-sm mt-1">Start your journey as an educator</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full border ${errors.name ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
                <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full border ${errors.email ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{errors.email}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="10-digit number"
                  className={`w-full border ${errors.contactNumber ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={isSubmitting}
                />
                <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.contactNumber && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{errors.contactNumber}</p>}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  className={`w-full border ${errors.password ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{errors.password}</p>}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Office Address</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="City, State, Country"
                  className={`w-full border ${errors.address ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isSubmitting}
                />
                <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wide">{errors.address}</p>}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed text-white shadow-none" 
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Register as Course Provider"
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center border-t border-gray-50 pt-8">
            <p className="text-gray-500 text-sm">
              Already have a provider account?{" "}
              <a href="/course-provider-login" className="text-purple-600 font-bold hover:underline transition-all">
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default CourseProviderRegistrationPage;
