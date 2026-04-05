"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import { CreateCheckoutSessionService, GetAllCartCoursesService } from "@/app/service/cart-service";
import { getAssetUrl } from "@/app/utils/asset-url";

const ShoppingCart = () => {
  const router = useRouter();
  const [cartCourses, setCartCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartCourses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/user-login");
      return;
    }

    try {
      const data = await GetAllCartCoursesService(token);
      setCartCourses(data.courses || []);
    } catch (err) {
      console.error("Failed to fetch cart courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCourses();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  const totalPrice = cartCourses.reduce(
    (acc, course) => acc + Number(course.price || 0),
    0
  );

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/user-login");
      return;
    }
  
    try {
      const response = await CreateCheckoutSessionService(token, cartCourses)

      const { url } = await response.data;
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Error redirecting to Stripe Checkout:", error);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex gap-8">
      <div className="w-2/3">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <div className="mt-4 border-b pb-2">
          <p className="text-lg font-semibold">{cartCourses.length} Courses in Cart</p>
        </div>

        {cartCourses.map((course) => (
          <div
            key={course._id}
            className="flex items-start border-b py-4 justify-between"
          >
            <div className="flex gap-4">
              <img
                src={getAssetUrl(`courses/${course.thumbnail}`)}
                alt={course.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-900">{course.instructor}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {course.badge || "Popular"}
                  </span>
                  <span className="text-sm font-semibold">{course.rating || 4.5}</span>
                  <span className="text-xs text-gray-500">(4k ratings)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {course.duration} hours • {course.level}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-right mr-7">
              <button className="text-sm text-purple-600 hover:bg-purple-100 rounded-sm p-1">Remove</button><br />
              <button className="text-sm text-purple-600 hover:bg-purple-100 rounded-sm p-1">Save for Later</button>
              <button className="text-sm text-purple-600 hover:bg-purple-100 rounded-sm p-1">Move to Wishlist</button>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-lg font-semibold text-purple-700 flex items-center mb-2">
                ₹{course.price} <Tag className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-1/3 bg-gray-100 p-6 rounded-lg self-start">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Total:</h2>
          <p className="text-2xl font-bold text-purple-700">₹{totalPrice}</p>
          <p className="text-sm text-gray-500">You won't be charged yet</p>
        </div>
        <button onClick={handleCheckout} className="bg-purple-600 text-white w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold mt-4">
          Proceed to Checkout <Tag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
