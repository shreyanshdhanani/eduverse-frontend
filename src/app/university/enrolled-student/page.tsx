"use client";

import { useEffect, useState } from "react";
import { GetUniversityEnrolledStudents } from "@/app/service/university-service";
import { Search, User, Book, Calendar, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";

interface Enrollment {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    courseId: {
        _id: string;
        title: string;
        thumbnailImage: string;
    };
    status: string;
    progress: number;
    createdAt: string;
}

export default function UniversityEnrolledStudents() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const data = await GetUniversityEnrolledStudents();
                setEnrollments(Array.isArray(data) ? data : (data as any)?.data || []);
            } catch (error) {
                console.error("Failed to fetch enrollments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const filteredEnrollments = enrollments.filter(e => 
        e.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.courseId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Enrolled Students</h1>
                    <p className="text-gray-500 mt-1">Track student progress across different courses.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by student or course..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredEnrollments.map((enrollment) => (
                    <div key={enrollment._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                             <Image
                                src={enrollment.courseId.thumbnailImage ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api'}/upload/courses/${enrollment.courseId.thumbnailImage}` : "/hero.jpg"}
                                alt={enrollment.courseId.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 truncate">{enrollment.userId.name}</h3>
                                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded-md">Student</span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                <User size={14} /> {enrollment.userId.email}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                <span className="flex items-center gap-1"><Book size={14} /> {enrollment.courseId.title}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(enrollment.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="w-full md:w-48 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{enrollment.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                                    style={{ width: `${enrollment.progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center justify-center gap-2 px-4 border-l border-gray-50">
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                enrollment.status === 'enrolled' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                            }`}>
                                {enrollment.status === 'enrolled' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                {enrollment.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredEnrollments.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No enrollments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
