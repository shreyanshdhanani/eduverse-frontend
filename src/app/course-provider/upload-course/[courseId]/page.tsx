"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetAllCategoryService } from "@/app/service/category-service";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetTopicsBySubcategoryService } from "@/app/service/topic-service";
import { CreateCourseWithBasicInformation } from "@/app/service/course-provider-service";

const UploadCourse = () => {

  const params = useParams();
  const router = useRouter();
  const Id = params?.courseId;

  // ✅ Form States
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [courseCategory, setCourseCategory] = useState<string>("");
  const [courseSubcategory, setCourseSubcategory] = useState<string>("");
  const [courseTopic, setCourseTopic] = useState<string>("");
  const [courseLevel, setCourseLevel] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [courseProvider, setCourseProvider] = useState<string>("");
  const [courseDuration, setCourseDuration] = useState<string>("");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [previewVideo, setPreviewVideo] = useState<File | null>(null);

  // ✅ Data Lists
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  // ✅ Fetch Categories on Load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategoryService();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch Subcategories on Category Change
  useEffect(() => {
    if (courseCategory) {
      const fetchSubcategories = async () => {
        try {
          const response = await GetSubcategoriesByCategoryService(courseCategory);
          setSubcategories(response);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubcategories();
    }
  }, [courseCategory]);

  // ✅ Fetch Topics on Subcategory Change
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setCourseProvider(authToken);
    }
    if (courseSubcategory) {
      const fetchTopics = async () => {
        try {
          const response = await GetTopicsBySubcategoryService(courseSubcategory);
          setTopics(response);
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      };
      fetchTopics();
    }
  }, [courseSubcategory]);

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Get Auth Token from Local Storage
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authentication required. Please log in.");
      return;
    }

    // ✅ Create FormData for API Submission
    const formData = new FormData();
    formData.append("title", courseTitle);
    formData.append("description", courseDescription);
    formData.append("category", courseCategory);
    formData.append("subcategory", courseSubcategory);
    formData.append("topic", courseTopic);
    formData.append("level", courseLevel);
    formData.append("language", language);
    formData.append("duration", courseDuration);
    formData.append("courseProvider", courseProvider);
    if(Id)
    {
        console.log(Id);
    }
    if (thumbnailImage) formData.append("thumbnailImage", thumbnailImage);
    if (previewVideo) formData.append("previewVideo", previewVideo);

    try {
      // ✅ Submit Data to Backend API
      const response = await CreateCourseWithBasicInformation(formData, Id);

      if (!response || response.error) {
        throw new Error("Course upload failed.");
      }

      console.log("Success:", response);
      alert("Course uploaded successfully!");

      // ✅ Redirect to My Courses Page
      router.push("/course-provider/courses");
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Error uploading course. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-purple-600 mb-6">Upload Your Course</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🔹 Course Title & Description */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Course Title</span>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
              placeholder="Enter course title"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Course Description</span>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Enter a brief description"
              required
            />
          </label>
        </div>

        {/* 🔹 Course Category, Subcategory & Topic */}
        <div className="grid grid-cols-3 gap-4">
          <select
            value={courseCategory}
            onChange={(e) => setCourseCategory(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-purple-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={courseSubcategory}
            onChange={(e) => setCourseSubcategory(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-purple-500"
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={courseTopic}
            onChange={(e) => setCourseTopic(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-purple-500"
            required
          >
            <option value="">Select Topic</option>
            {topics.map((topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Course Level, Language, Duration */}
        <div className="grid grid-cols-3 gap-4">
          <select
            value={courseLevel}
            onChange={(e) => setCourseLevel(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-purple-500"
            required
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-purple-500"
            required
          >
            <option value="">Select Language</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>

          <input
            type="text"
            value={courseDuration}
            onChange={(e) => setCourseDuration(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-purple-500"
            placeholder="Duration (e.g., 10 hours)"
            required
          />
        </div>

        {/* 🔹 File Upload */}
{/* 🔹 File Upload */}
<div className="space-y-6">
  <div>
    <label htmlFor="thumbnailImage" className="block text-sm font-medium text-gray-700">
      Thumbnail Image
    </label>
    <input
      id="thumbnailImage"
      type="file"
      accept="image/*"
      onChange={(e) => setThumbnailImage(e.target.files ? e.target.files[0] : null)}
      className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm bg-white file:bg-purple-600 file:text-white file:px-4 file:py-2 file:border-none file:rounded-md hover:file:bg-purple-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  <div>
    <label htmlFor="previewVideo" className="block text-sm font-medium text-gray-700">
      Preview Video
    </label>
    <input
      id="previewVideo"
      type="file"
      accept="video/*"
      onChange={(e) => setPreviewVideo(e.target.files ? e.target.files[0] : null)}
      className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm bg-white file:bg-purple-600 file:text-white file:px-4 file:py-2 file:border-none file:rounded-md hover:file:bg-purple-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
</div>

        {/* 🔹 Submit Button */}
        <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Save and Next
        </button>
      </form>
    </div>
  );
};

export default UploadCourse;
