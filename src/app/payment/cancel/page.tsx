"use client";

import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, HelpCircle, ArrowLeft, Home } from 'lucide-react';

export default function PaymentCancel() {
    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gray-50/50 p-6 text-center">
            <div className="max-w-xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-red-100/50 border border-red-50 overflow-hidden p-8 sm:p-12 relative">
                    {/* Background Decorative Blob */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />

                    <div className="relative z-10">
                        {/* Error Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-100 rounded-full scale-110 animate-pulse" />
                                <div className="bg-red-500 rounded-full p-6 relative shadow-lg shadow-red-200">
                                    <XCircle size={48} className="text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                            Payment Cancelled
                        </h1>
                        <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                            Don't worry, your account hasn't been charged. You can try again or check your cart.
                        </p>

                        {/* Help Box */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10 text-left">
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm shrink-0">
                                    <HelpCircle className="text-gray-400" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Having trouble?</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Common issues include insufficient funds, invalid card details, or bank restrictions. Try a different payment method if the problem persists.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <Link 
                                href="/cart" 
                                className="group flex items-center justify-center gap-3 bg-gray-900 hover:bg-red-600 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-gray-200 active:scale-95"
                            >
                                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                Try Payment Again
                            </Link>

                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/home" 
                                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-3.5 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95"
                                >
                                    <Home size={18} />
                                    Home
                                </Link>
                                <Link 
                                    href="/explore"
                                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-3.5 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95"
                                >
                                    <ArrowLeft size={18} />
                                    Explore Courses
                                </Link>
                            </div>
                        </div>

                        <p className="mt-8 text-xs text-gray-400 font-medium">
                            Need help? Contact our support team for assistance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
  