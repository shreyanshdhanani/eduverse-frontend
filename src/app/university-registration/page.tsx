"use client";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaPhone, FaMapMarkerAlt, FaEnvelope, FaUniversity, FaGlobe } from 'react-icons/fa'; // Importing necessary icons
import { UniversityRegistration } from "../service/university-service"; // Assuming you have the function in this path
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const UniversityRegistrationPage = () => {
  const [universityName, setUniversityName] = useState(""); // University name
  const [email, setEmail] = useState(""); // University email for registration
  const [password, setPassword] = useState(""); // Password for the account
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [address, setAddress] = useState(""); // Address of the university
  const [contactNumber, setContactNumber] = useState(""); // Contact number of the university
  const [website, setWebsite] = useState(""); // Website URL of the university
  const [logo, setLogo] = useState<File | null>(null); // University logo (optional)

  const router = useRouter(); // Initialize useRouter hook to navigate programmatically

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
    let hasError = false;

    // Validate University Name
    if (!universityName.trim()) {
      toast.error("⚠️ University name is required.", { autoClose: 3000 });
      hasError = true;
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      toast.error("⚠️ Email is required.", { autoClose: 3000 });
      hasError = true;
    } else if (!emailRegex.test(email)) {
      toast.error("⚠️ Please enter a valid email address.", { autoClose: 3000 });
      hasError = true;
    }

    // Validate Password
    if (!password.trim()) {
      toast.error("⚠️ Password is required.", { autoClose: 3000 });
      hasError = true;
    } else if (password.length < 6) {
      toast.error("⚠️ Password must be at least 6 characters long.", { autoClose: 3000 });
      hasError = true;
    } else if (!/[0-9]/.test(password)) {
      toast.error("⚠️ Password must contain at least one number.", { autoClose: 3000 });
      hasError = true;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("⚠️ Password must contain at least one special character.", { autoClose: 3000 });
      hasError = true;
    }

    // Validate Address
    if (!address.trim()) {
      toast.error("⚠️ Address is required.", { autoClose: 3000 });
      hasError = true;
    }

    // Validate Contact Number
    const contactNumberRegex = /^[0-9]{10}$/; // Validates 10-digit contact number
    if (!contactNumber.trim()) {
      toast.error("⚠️ Contact number is required.", { autoClose: 3000 });
      hasError = true;
    } else if (!contactNumberRegex.test(contactNumber)) {
      toast.error("⚠️ Please enter a valid 10-digit contact number.", { autoClose: 3000 });
      hasError = true;
    }

    // Validate Website URL (optional but can be validated if provided)
    if (website && !/^https?:\/\/[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?$/.test(website)) {
      toast.error("⚠️ Please enter a valid website URL.", { autoClose: 3000 });
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Create FormData and add data to it
      const formData = new FormData();
      formData.append("universityName", universityName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("address", address);
      formData.append("contactNumber", contactNumber);
      formData.append("website", website);
      if (logo) formData.append("logo", logo);

      // Log FormData to inspect before sending
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await UniversityRegistration(formData);
        toast.success("University Registered Successfully!", { autoClose: 3000 });

        // Redirect to login page after successful registration
        router.push("/university-login"); // Redirect to login page
      } catch (error: any) {
        toast.error("❌ Registration failed. Please try again.", { autoClose: 3000 });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <div className="flex w-full max-w-screen-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side Illustration — hidden on mobile */}
        <div className="hidden md:flex w-2/5 justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-600 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <img src="/university_registration.svg" alt="University Registration Illustration" className="relative z-10 w-full max-w-xs mx-auto drop-shadow-2xl" />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">E</span>
              <span className="text-purple-600">duverse</span>
            </h1>
            <h2 className="text-xl font-bold text-gray-900 mt-2">University Registration</h2>
            <p className="text-gray-500 text-sm mt-1">Join Eduverse as a trusted academic institution.</p>
          </div>

          {/* Form grid — responsive 1 col on mobile, 2 col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* University Name Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="University Name"
                className="w-full border border-gray-200 bg-gray-50 pr-10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
              />
              <FaUniversity className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Official Email"
                className="w-full border border-gray-200 bg-gray-50 pr-10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Contact Number Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Contact Number (10 digits)"
                className="w-full border border-gray-200 bg-gray-50 pr-10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
              <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Address Input — full width */}
            <div className="relative sm:col-span-2">
              <input
                type="text"
                placeholder="Full Address"
                className="w-full border border-gray-200 bg-gray-50 pr-10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Website URL — full width */}
            <div className="relative sm:col-span-2">
              <input
                type="url"
                placeholder="Website URL (Optional)"
                className="w-full border border-gray-200 bg-gray-50 pr-10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <FaGlobe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Logo Upload — full width */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">University Logo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
                className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold"
              />
              {logo && <p className="text-xs text-green-600 mt-1 font-medium">✓ Logo selected: {logo.name}</p>}
            </div>

            {/* Submit Button — full width */}
            <div className="sm:col-span-2">
              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl font-bold transition shadow-lg shadow-purple-200"
              >
                Register University
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/university-login" className="text-purple-600 font-semibold hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UniversityRegistrationPage;

