"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart as CartIcon, Trash2, ArrowRight, Tag, Bookmark, Heart, Loader2 } from "lucide-react";
import { CreateCheckoutSessionService, GetAllCartCoursesService, RemoveFromCartService } from "@/app/service/cart-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShoppingCart = () => {
  const router = useRouter();
  const [cartCourses, setCartCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCartCourses = async () => {
    try {
      const data = await GetAllCartCoursesService();
      // Handle array or object return from axiosInstance
      setCartCourses(Array.isArray(data) ? data : (data.courses || []));
    } catch (err) {
      console.error("Failed to fetch cart courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCourses();
  }, []);

  const handleRemove = async (courseId: string) => {
    try {
      await RemoveFromCartService(courseId);
      setCartCourses((prev) => prev.filter((course) => course._id !== courseId));
      toast.success("Course removed from cart");
    } catch (error) {
      toast.error("Failed to remove course");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalPrice = cartCourses.reduce(
    (acc, course) => acc + Number(course.price || 0),
    0
  );

  const handleCheckout = async () => {
    if (cartCourses.length === 0) return;
    setCheckoutLoading(true);
    try {
      const response = await CreateCheckoutSessionService(cartCourses);
      const { url } = response as any;
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Error redirecting to Stripe Checkout:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-4">
             Shopping Cart
             <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
               {cartCourses.length} Courses
             </span>
          </h1>
          <p className="text-gray-500 mt-2">Manage your selected courses and proceed to secure checkout.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cartCourses.length === 0 ? (
               <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CartIcon size={36} className="text-gray-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                  <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                    Looks like you haven't added any courses to your cart yet.
                  </p>
                  <button 
                    onClick={() => router.push('/course')}
                    className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-600/20 active:scale-95"
                  >
                    Start Shopping
                  </button>
               </div>
            ) : (
              cartCourses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 relative overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-40 aspect-video sm:aspect-square flex-shrink-0 relative">
                    <img
                      src={getAssetUrl(`courses/${course.thumbnail}`)}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {course.title}
                        </h2>
                        <div className="text-xl font-bold text-purple-700 whitespace-nowrap">
                          ₹{course.price}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">By {course.courseProvider?.universityName || "Leading Expert"}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
                          Best Seller
                        </span>
                        <span>{course.duration} Total Hours</span>
                        <span>{course.level} Level</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-6">
                      <button 
                        onClick={() => handleRemove(course._id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                      <button className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1.5 transition">
                        <Heart size={14} /> Wishlist
                      </button>
                      <button className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition">
                        <Bookmark size={14} /> Save for Later
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Sidebar */}
          {cartCourses.length > 0 && (
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl lg:sticky lg:top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Discount</span>
                    <span className="text-green-600">- ₹0</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Total Price:</span>
                    <div className="text-right">
                       <span className="block text-3xl font-black text-purple-700 tracking-tight">₹{totalPrice}</span>
                       <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Taxes Included</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleCheckout} 
                    disabled={checkoutLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg shadow-purple-600/30 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                  >
                    {checkoutLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>Checkout Now <ArrowRight size={20} /></>
                    )}
                  </button>
                  
                  <div className="pt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                    <Tag size={12} className="text-purple-400" />
                    30-Day Money-Back Guarantee
                  </div>
                </div>
              </div>

              {/* Promotions */}
              <div className="mt-6 bg-purple-50 rounded-2xl p-6 border border-purple-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Have a coupon?</p>
                  <p className="text-xs text-purple-600 font-semibold cursor-pointer hover:underline">Apply it at next step</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default ShoppingCart;
