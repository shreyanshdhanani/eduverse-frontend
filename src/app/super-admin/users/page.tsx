"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import router
import { getAllUser } from "@/app/service/user-service";
import { Eye } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUser();
        setUsers(usersData);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">All Students</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full border-collapse bg-white min-w-[480px]">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 text-sm">Name</th>
                <th className="p-3 text-sm">Email</th>
                <th className="p-3 text-center text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-sm">{user.name}</td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 flex justify-center items-center space-x-8">
                    <button
                      onClick={() => router.push(`/super-admin/users/${user._id}`)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
