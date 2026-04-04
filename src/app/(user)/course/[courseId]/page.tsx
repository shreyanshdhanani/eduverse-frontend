"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { EnrollCourseService, GetCourseDetailsService } from "@/app/service/course-service";
import { AddToCartService } from "@/app/service/cart-service";

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const courseData = await GetCourseDetailsService(courseId);
        setCourse(courseData);
      } catch (err) {
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleEnroll = async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/user-login");
      return;
    }

    try {
      const response = await EnrollCourseService(token, id);
      alert(response.message || "Successfully enrolled.");
    } catch (err: any) {
      alert(err.message || "Enrollment failed.");
    }
  };

  const handleAddToCart = async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/user-login");
      return;
    }

    try {
      const response = await AddToCartService(token, id);
      switch (response.data.status) {
        case "university_student":
        alert("You're a university student. No need to purchase. Just enrolled!");
        break;
        case "added_to_cart":
          alert("Course added to cart successfully!");
          break;
        case "already_in_cart":
          alert("Course is already in your cart.");
          break;
        default:
          alert("Something unexpected happened.");
      }
    } catch (err: any) {
      alert(err.message || "Error adding course to cart.");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <img
          src={`http://localhost:3020/api/upload/courses/${course.thumbnail}`}
          alt={course.title}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl">{course.title}</h1>
          <p className="max-w-3xl text-lg md:text-xl mb-6">{course.description}</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => handleEnroll(course._id)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
            >
              Enroll Now
            </button>
            <button
              onClick={() => handleAddToCart(course._id)}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <div className="border rounded-xl p-6 shadow-md bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Course Highlights</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Level:</strong> {course.level}</li>
                <li><strong>Language:</strong> {course.language}</li>
                <li><strong>Duration:</strong> {course.duration} hrs</li>
                <li><strong>Certificate:</strong> {course.certificateAvailable ? "Available" : "Not Available"}</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4 text-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Course Provider:</p>
                  <p>{course.courseProvider?.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Category:</p>
                  <p>{course.category?.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Subcategory:</p>
                  <p>{course.subcategory?.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Topic:</p>
                  <p>{course.topic?.name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Created At: {new Date(course.createdAt).toLocaleDateString()} | Updated At: {new Date(course.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
          <div className="text-xl font-semibold text-gray-800">
            Price: <span className="text-green-600">₹{course.price || 'Free'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
