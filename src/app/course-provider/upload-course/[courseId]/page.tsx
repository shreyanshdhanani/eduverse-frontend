"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetAllCategoryService } from "@/app/service/category-service";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetTopicsBySubcategoryService } from "@/app/service/topic-service";
import { CreateCourseWithBasicInformation } from "@/app/service/course-provider-service";
import { useModal } from "@/components/ModalProvider";
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  DollarSign, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  CheckCircle2,
  Info,
  Clock
} from "lucide-react";

const UploadCourse = () => {

  const params = useParams();
  const router = useRouter();
  const { showAlert } = useModal();
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
  const [coursePrice, setCoursePrice] = useState<string>("0");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [previewVideo, setPreviewVideo] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // ✅ Data Lists
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  // ✅ Fetch Categories on Load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await GetAllCategoryService();
        setCategories(response || []);
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
          const response: any = await GetSubcategoriesByCategoryService(courseCategory);
          setSubcategories(response || []);
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
          const response: any = await GetTopicsBySubcategoryService(courseSubcategory);
          setTopics(response || []);
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
      showAlert({ message: "Authentication required. Please log in.", type: "warning" });
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
    formData.append("price", coursePrice);
    formData.append("courseProvider", courseProvider);
    
    if (thumbnailImage) formData.append("thumbnailImage", thumbnailImage);
    if (previewVideo) formData.append("previewVideo", previewVideo);

    try {
      // ✅ Submit Data to Backend API
      const response = await CreateCourseWithBasicInformation(formData, Id as string);

      console.log("Success:", response);
      showAlert({ message: "Course uploaded successfully!", type: "success" });

      // ✅ Redirect to My Courses Page
      router.push("/course-provider/courses");
    } catch (error: any) {
      console.error("Error uploading course:", error);
      showAlert({ message: error.message || "Error uploading course. Please try again.", type: "error" });
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFF] p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-950 tracking-tight">Create Your Masterpiece</h2>
              <p className="text-gray-800 font-bold uppercase tracking-widest text-[10px] mt-1">Fill in the details below to launch your professional course.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl text-purple-800 font-black border border-purple-200">
               <Info size={16} />
               <span className="text-sm">Step {currentStep} of 2</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex-1 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                <div className={`flex-1 h-1.5 rounded-full transition-all duration-700 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-100'}`} />
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
             </div>
          </div>
          <div className="flex justify-between mt-3 px-1">
             <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 1 ? 'text-purple-700' : 'text-gray-600'}`}>Course Information</span>
             <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 2 ? 'text-purple-700' : 'text-gray-600'}`}>Media & Pricing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {currentStep === 1 && (
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-900/5 border border-purple-100 space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl"><FileText size={24} /></div>
                    <h3 className="text-xl font-black text-gray-950 tracking-tight">Step 1: The Basics</h3>
                  </div>

                  <div className="space-y-6">
                    <label className="block group">
                      <span className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2 block group-focus-within:text-purple-700 transition-colors">Course Title</span>
                      <input
                        type="text"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-bold text-gray-950 placeholder:text-gray-400"
                        placeholder="e.g. Advanced Machine Learning 2024"
                        required
                      />
                    </label>

                    <label className="block group">
                      <span className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2 block group-focus-within:text-purple-700 transition-colors">Description</span>
                      <textarea
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-bold text-gray-950 placeholder:text-gray-400 min-h-[150px]"
                        placeholder="What will your students learn?"
                        required
                      />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Category</span>
                        <select
                          value={courseCategory}
                          onChange={(e) => setCourseCategory(e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Subcategory</span>
                        <select
                          value={courseSubcategory}
                          onChange={(e) => setCourseSubcategory(e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>{sub.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Topic</span>
                        <select
                          value={courseTopic}
                          onChange={(e) => setCourseTopic(e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Topic</option>
                          {topics.map((topic) => (
                            <option key={topic._id} value={topic._id}>{topic.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Level</span>
                        <select
                          value={courseLevel}
                          onChange={(e) => setCourseLevel(e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 cursor-pointer"
                          required
                        >
                          <option value="">Select Level</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Language</span>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 cursor-pointer"
                          required
                        >
                          <option value="">Select Language</option>
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                        </select>
                      </div>
                      <div className="space-y-2 text-right">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-1 block">Duration</span>
                        <input
                          type="text"
                          value={courseDuration}
                          onChange={(e) => setCourseDuration(e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-950 placeholder:text-gray-400"
                          placeholder="e.g. 10 hours"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="w-full flex items-center justify-center gap-3 bg-purple-700 text-white p-5 rounded-2xl font-black text-lg hover:bg-purple-800 transition-all shadow-xl shadow-purple-900/20 active:scale-95"
                    >
                      Continue to Price & Media
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-900/5 border border-purple-100 space-y-10 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl"><DollarSign size={24} /></div>
                    <h3 className="text-xl font-black text-gray-950 tracking-tight">Step 2: Media & Pricing</h3>
                  </div>

                  {/* Price Input */}
                  <div className="p-8 bg-gray-100 rounded-3xl border border-gray-200 shadow-inner">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4 block">Set Your Price (USD)</span>
                    <div className="flex items-center gap-4">
                       <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 text-purple-700">
                          <DollarSign size={32} />
                       </div>
                       <input
                        type="number"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(e.target.value)}
                        className="flex-1 p-6 bg-white border-2 border-transparent rounded-[2rem] shadow-sm focus:border-purple-200 transition-all outline-none font-black text-4xl text-gray-950 placeholder:text-gray-300"
                        placeholder="0.00"
                        min="0"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-800 mt-4 font-black uppercase tracking-wider flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-green-600" />
                       Students will pay this amount in USD
                    </p>
                  </div>

                  {/* Media Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <label className="block space-y-3 cursor-pointer group">
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest ml-1">Thumbnail Cover</span>
                      <div className="relative h-[200px] border-2 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-gray-100 group-hover:bg-purple-100 transition-all group-hover:border-purple-300 overflow-hidden">
                         {thumbnailPreview ? (
                            <img src={thumbnailPreview} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                         ) : (
                            <>
                              <div className="p-4 bg-white rounded-2xl shadow-sm text-purple-700"><ImageIcon size={32} /></div>
                              <span className="text-sm font-black text-gray-900">Upload Image</span>
                            </>
                         )}
                         <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleThumbnailChange(e.target.files ? e.target.files[0] : null)}
                          className="hidden"
                        />
                      </div>
                    </label>

                    <label className="block space-y-3 cursor-pointer group">
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest ml-1">Preview Video</span>
                      <div className="relative h-[200px] border-2 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-gray-100 group-hover:bg-purple-100 transition-all group-hover:border-purple-300">
                        <div className={`p-4 rounded-2xl shadow-sm ${previewVideo ? 'bg-purple-700 text-white' : 'bg-white text-purple-700'}`}>
                          <Video size={32} />
                        </div>
                        <span className="text-sm font-black text-gray-900">{previewVideo ? previewVideo.name : 'Upload Video'}</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setPreviewVideo(e.target.files ? e.target.files[0] : null)}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="p-5 bg-gray-200 text-gray-800 rounded-2xl font-black hover:bg-gray-300 transition-all flex items-center justify-center"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 flex items-center justify-center gap-3 bg-gray-950 text-white p-5 rounded-[2rem] font-black text-lg hover:bg-purple-700 transition-all shadow-xl active:scale-95"
                    >
                      Complete & Publish Course
                      <Upload size={20} />
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Sidebar / Preview (Right) */}
          <div className="hidden lg:block space-y-8">
             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 sticky top-10">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6 block underline decoration-purple-100">Course Overview</h4>
                
                {/* Course Card Preview */}
                <div className="bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-sm group">
                   <div className="h-40 bg-gray-200 relative">
                      {thumbnailPreview ? (
                        <img src={thumbnailPreview} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon size={48} className="text-gray-400" /></div>
                      )}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black tracking-widest text-purple-800 uppercase">
                         {courseLevel || 'All Levels'}
                      </div>
                   </div>
                   <div className="p-6 space-y-3">
                      <h5 className="font-black text-gray-950 line-clamp-2 min-h-[3rem] tracking-tight">{courseTitle || 'Your Course Title'}</h5>
                      <div className="flex items-center justify-between">
                         <div className="text-2xl font-black text-purple-800">${coursePrice || '0'}</div>
                         <div className="flex items-center gap-1 text-[10px] font-black text-gray-800">
                            <Clock size={12} /> {courseDuration || '0 hrs'}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                   <div className="flex items-center gap-3 text-gray-950 font-black tracking-tight">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                      <span className="text-xs uppercase tracking-widest font-black">Live Preview Enabled</span>
                   </div>
                   <p className="text-xs text-gray-900 leading-relaxed font-bold italic">
                      "Professional thumbnails significantly increase student enrollment rates."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCourse;
