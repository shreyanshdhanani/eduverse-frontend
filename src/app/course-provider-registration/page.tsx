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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex w-3/5 rounded-lg overflow-hidden">
        {/* Left Side Illustration */}
        <div className="w-1/2 flex justify-center items-center">
          <img src="/course_provider.svg" alt="Course Provider Illustration" className="w-full h-auto object-cover" />
        </div>

        {/* Right Side Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Provider Registration</h2>

          {/* Name Input */}
          <div className="mb-4">
            <div className="relative">
              <input type="text" placeholder="Full Name" className="w-full border border-gray-300 pr-10 p-3 rounded"
                value={name} onChange={(e) => setName(e.target.value)} />
              <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <div className="relative">
              <input type="email" placeholder="Email" className="w-full border border-gray-300 pr-10 p-3 rounded"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="relative mb-4">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full border border-gray-300 p-3 rounded pr-10"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Contact Number Input */}
          <div className="mb-4">
            <div className="relative">
              <input type="text" placeholder="Contact Number" className="w-full border border-gray-300 pr-10 p-3 rounded"
                value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
          </div>

          {/* Address Input */}
          <div className="mb-4">
            <div className="relative">
              <input type="text" placeholder="Address" className="w-full border border-gray-300 pr-10 p-3 rounded"
                value={address} onChange={(e) => setAddress(e.target.value)} />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit}
            className={`w-full p-3 rounded font-semibold flex justify-center items-center
              ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 text-white"}
            `}
            disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register as course provider"}
          </button>

          <div className="mt-6 border-t border-gray-300 pt-4 text-center">
            <p className="text-gray-600">
              Already have an account? <a href="/course-provider-login" className="text-purple-600 font-semibold">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProviderRegistrationPage;
