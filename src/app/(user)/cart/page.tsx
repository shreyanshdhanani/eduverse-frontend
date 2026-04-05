"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart as CartIcon,
  Trash2,
  ArrowRight,
  Tag,
  Loader2,
  BookOpen,
  Clock,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
import {
  CreateCheckoutSessionService,
  GetAllCartCoursesService,
  RemoveFromCartService,
} from "@/app/service/cart-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  duration: string;
  level: string;
  language: string;
  courseProvider?: {
    universityName?: string;
    name?: string;
  };
  sections?: any[];
}

const ShoppingCart = () => {
  const router = useRouter();
  const [cartCourses, setCartCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCartCourses = useCallback(async () => {
    setLoading(true);
    try {
      const courses = await GetAllCartCoursesService();
      setCartCourses(Array.isArray(courses) ? courses : []);
    } catch (err: any) {
      console.error("Failed to fetch cart courses:", err);
      // If 401, redirect to login
      if (err?.response?.status === 401) {
        router.push("/user-login");
      } else {
        toast.error("Could not load your cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCartCourses();
  }, [fetchCartCourses]);

  const handleRemove = async (courseId: string) => {
    setRemovingId(courseId);
    try {
      await RemoveFromCartService(courseId);
      setCartCourses((prev) => prev.filter((course) => course._id !== courseId));
      toast.success("Course removed from cart");
    } catch {
      toast.error("Failed to remove course. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    if (cartCourses.length === 0) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.push("/user-login");
      return;
    }
    setCheckoutLoading(true);
    try {
      const response = await CreateCheckoutSessionService(cartCourses);
      // The interceptor returns the inner data, so `response` is the payload
      const url = response?.url || response?.sessionUrl;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Unable to start checkout. Please try again.");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error?.message || "Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalPrice = cartCourses.reduce(
    (acc, course) => acc + Number(course.price || 0),
    0
  );

  // ─── Loading State ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium text-sm">Loading your cart…</p>
        </div>
      </div>
    );
  }

  // ─── Empty State ──────────────────────────────────────────────────────────────
  if (cartCourses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CartIcon size={40} className="text-purple-300" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added any courses yet. Start learning something amazing!
          </p>
          <button
            onClick={() => router.push("/course")}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/25"
          >
            Browse Courses
          </button>
        </div>
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    );
  }

  // ─── Cart With Items ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/40 pb-24 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
            Shopping Cart
            <span className="text-base bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
              {cartCourses.length} {cartCourses.length === 1 ? "Course" : "Courses"}
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            Review your selected courses and proceed to secure checkout.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Cart Items ──────────────────────────────────────────────────── */}
          <div className="flex-1 space-y-5">
            {cartCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5 relative overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-44 h-32 sm:h-auto flex-shrink-0">
                  <img
                    src={getAssetUrl(`courses/${course.thumbnail}`)}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-[1.03] transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x260/f3f0ff/7c3aed?text=Course";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <h2 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {course.title}
                      </h2>
                      <p className="text-lg font-extrabold text-purple-700 whitespace-nowrap flex-shrink-0">
                        {course.price === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `₹${course.price.toLocaleString()}`
                        )}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 mb-3">
                      By {course.courseProvider?.universityName || course.courseProvider?.name || "Expert Instructor"}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-500">
                      <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                        <Clock size={10} /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md capitalize">
                        <BarChart2 size={10} /> {course.level}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md capitalize">
                        <BookOpen size={10} /> {course.language}
                      </span>
                      {course.sections && course.sections.length > 0 && (
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md">
                          {course.sections.length} {course.sections.length === 1 ? "Section" : "Sections"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => handleRemove(course._id)}
                      disabled={removingId === course._id}
                      className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {removingId === course._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary Sidebar ────────────────────────────────────────── */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              {/* Course breakdown */}
              <div className="space-y-2 mb-5 max-h-48 overflow-y-auto pr-1">
                {cartCourses.map((course) => (
                  <div key={course._id} className="flex justify-between text-sm text-gray-600">
                    <span className="line-clamp-1 flex-1 mr-2">{course.title}</span>
                    <span className="font-semibold flex-shrink-0 text-gray-800">
                      {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal ({cartCourses.length} courses)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Discount</span>
                  <span className="text-green-600">—</span>
                </div>
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className="text-base">Total</span>
                  <span className="text-2xl text-purple-700">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3.5 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm transition-all shadow-lg shadow-purple-600/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing…
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Trust signals */}
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold">
                  <ShieldCheck size={13} className="text-green-500 flex-shrink-0" />
                  30-Day Money-Back Guarantee
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold">
                  <Tag size={12} className="text-purple-400 flex-shrink-0" />
                  Secure payment via Stripe
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => router.push("/course")}
              className="mt-4 w-full text-center text-sm font-semibold text-purple-600 hover:text-purple-800 transition py-2"
            >
              ← Continue Shopping
            </button>
          </div>

        </div>
      </div>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </div>
  );
};

export default ShoppingCart;
