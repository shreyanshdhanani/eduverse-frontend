"use client";

import { useState, useEffect } from "react";
import { GetAllCategoryService } from "@/app/service/category-service";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetTopicsBySubcategoryService } from "@/app/service/topic-service";
import { FaCamera } from "react-icons/fa";
import { getProfile, ProfileService } from "@/app/service/course-provider-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { useModal } from "@/components/ModalProvider";

const CourseProviderSettings = () => {
  const { showAlert } = useModal();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    bio: "",
    certifications: "",
    experience: "",
    specialization: "",
    languages: "",
    expertiseCategory: "",
    expertiseSubcategory: "",
    expertiseTopic: "",
    profilePicture: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile();
  
        if (userProfile) {
          const profileData = userProfile as any;
          setProfile((prev) => ({
            ...prev,
            ...profileData,
            name: profileData.courseProvider?.name || "",
            email: profileData.courseProvider?.email || "",
            phone: profileData.courseProvider?.phone || profileData.phone || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategoryService();
        setCategories(Array.isArray(response) ? response : (response as any)?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (profile.expertiseCategory) {
      const fetchSubcategories = async () => {
        try {
          const response = await GetSubcategoriesByCategoryService(profile.expertiseCategory);
          setSubcategories(Array.isArray(response) ? response : (response as any)?.data || []);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubcategories();
    }
  }, [profile.expertiseCategory]);

  useEffect(() => {
    if (profile.expertiseSubcategory) {
      const fetchTopics = async () => {
        try {
          const response = await GetTopicsBySubcategoryService(profile.expertiseSubcategory);
          setTopics(Array.isArray(response) ? response : (response as any)?.data || []);
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      };
      fetchTopics();
    }
  }, [profile.expertiseSubcategory]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      await ProfileService(formData);
      showAlert({ message: "Profile updated successfully!", type: "success" });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showAlert({ message: error.message || "Profile update failed.", type: "error" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Course Provider Settings</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <img
            src={profile.profilePicture ? getAssetUrl(profile.profilePicture as string) : "/default_user.png"} 
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer">
            <FaCamera className="text-white text-sm" />
            <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-5">
  {[
    "name",
    "email",
    "phone",
    "website",
    "linkedin",
    "bio",
    "certifications",
    "experience",
    "specialization",
    "languages",
  ].map((field) => (
    <div key={field}>
      <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
      <input
        type="text"
        name={field}
        value={(profile as any)[field] || ""}
        onChange={handleChange}
        disabled={["email", "name", "phone"].includes(field)} // Disable these fields
        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 transition ${
          ["email", "name", "phone"].includes(field) ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
      />
    </div>
  ))}
</div>


      <div className="grid grid-cols-3 gap-4 mt-6">
        <select name="expertiseCategory" value={profile.expertiseCategory} onChange={handleChange} className="w-full p-3 border rounded-lg shadow-sm focus:ring-purple-500">
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        <select name="expertiseSubcategory" value={profile.expertiseSubcategory} onChange={handleChange} className="w-full p-3 border rounded-lg shadow-sm focus:ring-purple-500">
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>
        <select name="expertiseTopic" value={profile.expertiseTopic} onChange={handleChange} className="w-full p-3 border rounded-lg shadow-sm focus:ring-purple-500">
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic._id} value={topic._id}>{topic.name}</option>
          ))}
        </select>
      </div>

      <button onClick={handleSave} className="w-full mt-6 p-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
        Save Changes
      </button>
    </div>
  );
};

export default CourseProviderSettings;
