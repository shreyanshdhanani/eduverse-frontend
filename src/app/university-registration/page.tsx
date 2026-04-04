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
    <div className="flex justify-center items-center min-h-screen bg-white p-2">
      <div className="flex w-full max-w-screen-lg rounded-lg overflow-hidden">
        {/* Left Side Illustration */}
        <div className="w-2/5 flex justify-center items-center">
          <img src="/university_registration.svg" alt="University Registration Illustration" className="w-full h-auto object-cover" />
        </div>

        {/* Right Side Form */}
        <div className="w-3/5 p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">University Registration</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Division: University Information */}
            <div className="space-y-4">
              {/* University Name Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="University Name"
                  className="w-full border border-gray-300 pr-10 p-3 rounded"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                />
                <FaUniversity className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>

              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 pr-10 p-3 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>

              {/* Address Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border border-gray-300 pr-10 p-3 rounded"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>

              {/* Contact Number Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="w-full border border-gray-300 pr-10 p-3 rounded"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
                <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Right Division: Additional Information */}
            <div className="space-y-4">
              {/* Password Input */}
              <div className="relative">
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

              {/* Website URL Input (optional) */}
              <div className="relative">
                <input
                  type="url"
                  placeholder="Website URL (Optional)"
                  className="w-full border border-gray-300 pr-10 p-3 rounded"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <FaGlobe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>

              {/* Logo Upload Input (optional) */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
                  className="w-full border border-gray-300 p-3 rounded"
                />
                {logo && <p className="text-sm mt-1">Logo uploaded</p>}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 text-white p-3 rounded font-semibold"
              >
                Register University
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-300 pt-4 text-center">
            <p className="text-gray-600">
              Already have an account? <a href="/university-login" className="text-purple-600 font-semibold">Log in</a>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UniversityRegistrationPage;
