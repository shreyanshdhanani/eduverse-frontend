"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { CheckCircle, ArrowRight, Download, Home, BookOpen, Loader2, AlertCircle } from 'lucide-react';

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setIsVerifying(false);
                return;
            }

            try {
                // Call backend to verify the Stripe session and update database
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';
                const token = localStorage.getItem('authToken');
                
                await axios.post(`${API_URL}/stripe/verify-session`, 
                    { sessionId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setIsVerifying(false);
            } catch (err: any) {
                console.error("Verification failed:", err);
                setError("We couldn't verify your payment automatically. Please check your dashboard in a few minutes.");
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gray-50/50 p-6">
            <div className="max-w-xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-purple-100/50 border border-purple-50 overflow-hidden text-center p-8 sm:p-12 relative">
                    {/* Background Decorative Blob */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />

                    <div className="relative z-10">
                        {isVerifying ? (
                            <div className="py-10 flex flex-col items-center">
                                <Loader2 size={48} className="text-purple-600 animate-spin mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
                                <p className="text-gray-500">Please don't close this window.</p>
                            </div>
                        ) : error ? (
                            <div className="py-10 flex flex-col items-center">
                                <div className="bg-amber-50 rounded-full p-6 mb-6">
                                    <AlertCircle size={48} className="text-amber-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Notice</h2>
                                <p className="text-gray-500 mb-8 max-w-sm">{error}</p>
                                <Link 
                                    href="/enrolled-courses" 
                                    className="bg-gray-900 text-white py-4 px-8 rounded-2xl font-bold transition-all hover:bg-purple-600"
                                >
                                    Go to My Courses
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Success Icon */}
                                <div className="mb-8 flex justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-100 rounded-full scale-110 animate-pulse" />
                                        <div className="bg-green-500 rounded-full p-6 relative shadow-lg shadow-green-200">
                                            <CheckCircle size={48} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                                    Payment Confirmed!
                                </h1>
                                <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                                    Thank you for your purchase. Your learning journey begins now!
                                </p>

                                {/* Info Boxes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                                            Completed
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">#ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-4">
                                    <Link 
                                        href="/enrolled-courses" 
                                        className="group flex items-center justify-center gap-3 bg-gray-900 hover:bg-purple-600 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-gray-200 active:scale-95"
                                    >
                                        <BookOpen size={20} />
                                        Start Learning Now
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <div className="flex items-center gap-3">
                                        <Link 
                                            href="/home" 
                                            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-3.5 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95"
                                        >
                                            <Home size={18} />
                                            Home
                                        </Link>
                                        <button 
                                            onClick={() => window.print()}
                                            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-400 border border-gray-200 py-3.5 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95"
                                        >
                                            <Download size={18} />
                                            Receipt
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-8 text-xs text-gray-400 font-medium">
                                    A confirmation email has been sent to your registered email address.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
  