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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex w-3/5 rounded-lg overflow-hidden">
        <div className="w-1/2 flex justify-center items-center">
          <img src="/new_password.svg" alt="Reset Password Illustration" className="w-full h-auto object-cover" />
        </div>

        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Reset Your Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full border border-gray-300 p-3 rounded pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="button" onClick={() => togglePasswordVisibility("new")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 p-3 rounded pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded font-semibold">Reset Password</button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResetPasswordPage;
