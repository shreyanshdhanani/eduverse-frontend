"use client";

import { useEffect, useState } from "react";
import { GetEnrolledStudentsService } from "@/app/service/course-provider-service";
import { useParams, useRouter } from "next/navigation";

interface Student {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  courseId: {
    title: string;
  };
  progress: number;
  certificateIssued: boolean;
  status: string;
  createdAt: string;
}

export default function EnrolledStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter()
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/user-login");
          return;
        }
  
        console.log('token', token)
        const data = await GetEnrolledStudentsService(token);
        setStudents(data || []);
      } catch (err) {
        console.error("Failed to fetch enrolled students", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, []); // ✅ Important: empty array means run only once
  
  if (loading) return <p className="text-center py-10">Loading enrolled students...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Enrolled Students</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((student) => (
          <div key={student._id} className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold">{student.userId.name}</h2>
            <p className="text-sm text-gray-500">{student.userId.email}</p>
            <p className="mt-2 font-medium text-purple-700">{student.courseId.title}</p>
            <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${student.progress}%` }}
                />
            </div>
                <p className="text-sm mt-1">Progress: {student.progress}%</p>
                </div>

            <div className="mt-2 text-sm text-gray-600">
              <p>Status: <span className="font-medium">{student.status}</span></p>
              <p>Certificate: {student.certificateIssued ? '✅ Issued' : '❌ Not Issued'}</p>
              <p>Enrolled At: {new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
