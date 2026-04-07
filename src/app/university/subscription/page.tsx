"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CreditCard, 
  Users, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { 
  GetActiveSubscriptionService, 
  GetSubscriptionUsageService, 
  GetAllSubscriptionPlansService, 
  CreateSubscriptionCheckoutSessionService,
  VerifySubscriptionSessionService
} from "@/app/service/university-service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubscriptionContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      verifyAndFetch(sessionId);
    } else {
      fetchData();
    }
  }, [searchParams]);

  const verifyAndFetch = async (sessionId: string) => {
    setVerifying(true);
    try {
      toast.info("Verifying your payment...", { autoClose: false, toastId: "verifying" });
      await VerifySubscriptionSessionService(sessionId);
      toast.dismiss("verifying");
      toast.success("Subscription activated successfully!");
      // Remove session_id from URL
      router.replace("/university/subscription");
      await fetchData();
    } catch (err: any) {
      toast.dismiss("verifying");
      toast.error(err.message || "Failed to verify session");
      fetchData();
    } finally {
      setVerifying(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, usageRes, plansRes] = await Promise.all([
        GetActiveSubscriptionService(),
        GetSubscriptionUsageService(),
        GetAllSubscriptionPlansService()
      ]);
      
      setSubscription(subRes?.data || subRes);
      setUsage(usageRes?.data || usageRes);
      setPlans(Array.isArray(plansRes) ? plansRes : (plansRes as any)?.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch subscription details");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    try {
      setPurchaseLoading(planId);
      const res = await CreateSubscriptionCheckoutSessionService(planId);
      if ((res as any)?.url) {
        window.location.href = (res as any).url;
      } else {
        throw new Error("Could not generate checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate purchase");
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading || verifying) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse">
           <Loader2 className="text-indigo-600 animate-spin mb-4" size={48} />
           <p className="text-gray-500 font-black uppercase tracking-widest text-xs">
             {verifying ? "Configuring Your Subscription..." : "Loading Dashboard..."}
           </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const hasSubscription = subscription?.hasSubscription;

  return (
    <div className="space-y-8 pb-20">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">University Subscription</h1>
              <div className="flex items-center gap-2 mt-1.5">
                {hasSubscription && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-700 text-xs font-black rounded-full border border-green-100 uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Active: {subscription.planName}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {hasSubscription && (
            <div className="flex items-center gap-4 bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Clock className="text-orange-500" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Days Remaining</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{subscription.daysRemaining ?? "∞"}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] opacity-40 -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-50 rounded-full blur-[60px] opacity-30 -ml-16 -mb-16 pointer-events-none" />
      </div>

      {hasSubscription ? (
        <div className="bg-indigo-50 rounded-[2rem] p-10 border border-indigo-100 flex flex-col md:flex-row items-center gap-8 shadow-sm shadow-indigo-50">
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-md shrink-0">
            <ShieldCheck className="text-indigo-500" size={40} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-black text-indigo-900 mb-2">Active Plan: {subscription.planName}</h2>
            <p className="text-indigo-700/80 text-sm leading-relaxed max-w-2xl font-medium">
              Your institution is currently on the <strong>{subscription.planName}</strong> plan. You have full access to student enrollments and premium course features until {new Date(subscription.endDate).toLocaleDateString()}.
            </p>
          </div>
          <div className="shrink-0">
             <div className="px-6 py-4 bg-indigo-100/50 border border-indigo-200 rounded-2xl text-indigo-900 text-sm font-black flex items-center gap-3">
                <CheckCircle2 size={18} /> Subscribed
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 rounded-[2rem] p-10 border border-amber-100 flex flex-col md:flex-row items-center gap-8 shadow-sm shadow-amber-50">
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-md shrink-0">
            <ShieldAlert className="text-amber-500" size={40} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-black text-amber-900 mb-2">Enrollment Disabled</h2>
            <p className="text-amber-700/80 text-sm leading-relaxed max-w-2xl font-medium">
              To allow your students to enroll in courses for free as part of your institution, you must first purchase a subscription plan. Your current usage is limited to student management only.
            </p>
          </div>
          <div className="shrink-0">
             <div className="px-6 py-4 bg-amber-100/50 border border-amber-200 rounded-2xl text-amber-900 text-sm font-black flex items-center gap-3">
                <Zap size={18} /> Choose a Plan Below
             </div>
          </div>
        </div>
      )}

      {hasSubscription && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Users size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seats Used</p>
                <p className="text-3xl font-black text-gray-900">{usage?.studentsAdded} / {usage?.maxStudents}</p>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden mb-3 border border-gray-100">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                style={{ width: `${Math.min(100, (usage?.studentsAdded / usage?.maxStudents) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{usage?.seatsRemaining} available</p>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">{Math.round((usage?.studentsAdded / usage?.maxStudents) * 100)}% Used</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <BookOpen size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Per-Student Limit</p>
                <p className="text-3xl font-black text-gray-900">{usage?.maxCoursesPerStudent}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Each student can enroll in up to <span className="font-bold text-gray-900">{usage?.maxCoursesPerStudent} premium courses</span> at no cost to them.</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100 tracking-wider">
              <Zap size={10} /> AUTO-REFILLED
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-sm">
                <TrendingUp size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Enrollments</p>
                <p className="text-3xl font-black text-gray-900">{usage?.totalEnrollments}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">You have provided a total of <span className="font-bold text-gray-900">{usage?.totalEnrollments} enrollment slots</span> to your student body this term.</p>
            <div className="mt-4 flex items-center gap-1.5 text-violet-600">
              <ArrowUpRight size={16} className="font-black" />
              <span className="text-[10px] font-black uppercase tracking-widest">Increasing Engagement</span>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans Section */}
      <div>
        <div className="flex items-center justify-between mb-8 px-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Available Subscription Plans</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Choose a plan that fits your university's scale</p>
          </div>
          <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-400">
             Templates Managed by Super Admin
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan._id} 
              className={`relative overflow-hidden bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 flex flex-col h-full ${
                subscription?.planId === plan._id 
                  ? 'border-indigo-600 shadow-xl shadow-indigo-100 ring-8 ring-indigo-50/30' 
                  : 'border-gray-100 hover:border-indigo-200 hover:shadow-lg shadow-sm'
              }`}
            >
              {subscription?.planId === plan._id && (
                <div className="absolute top-0 right-0 py-2 px-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl">
                  Current
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">{plan.planName}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                  <span className="text-sm text-gray-400 font-bold">/ Year</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-700 font-bold">{plan.maxStudents.toLocaleString()} Seats</p>
                        <p className="text-[10px] text-gray-400 font-medium">Total student capacity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-700 font-bold">{plan.maxCoursesPerStudent} Courses Limit</p>
                        <p className="text-[10px] text-gray-400 font-medium">Per student enrollment cap</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-indigo-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{plan.description || "Standard institutional access with bulk registration support."}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(plan._id)}
                disabled={purchaseLoading !== null || hasSubscription}
                className={`w-full py-5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-[0.97] ${
                  subscription?.planId === plan._id
                    ? 'bg-indigo-100 text-indigo-700 cursor-default'
                    : hasSubscription
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100'
                }`}
              >
                {purchaseLoading === plan._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : subscription?.planId === plan._id ? (
                  <>
                    <CheckCircle2 size={16} />
                    Current Plan
                  </>
                ) : hasSubscription ? (
                  <>
                    <ShieldCheck size={16} />
                    Subscription Active
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Buy Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {hasSubscription && (
         <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h2 className="text-2xl font-black mb-4 tracking-tight">Need Enterprise Customization?</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">Our Enterprise solution offers unlimited seats, custom white-labeling, and dedicated support for large-scale institutions.</p>
                    <button className="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl text-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                        Contact Sales <ChevronRight size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        "Custom Billing", "LMS Integration", "Custom Domain", "Priority SLA"
                    ].map((f, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                            <CheckCircle2 size={14} className="text-indigo-400" />
                            <span className="text-xs font-black uppercase tracking-widest">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
         </div>
      )}
    </div>
  );
};

const UniversitySubscriptionPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubscriptionContent />
        </Suspense>
    );
};

export default UniversitySubscriptionPage;
