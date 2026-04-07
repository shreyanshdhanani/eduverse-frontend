"use client";

import { useState, useEffect } from "react";
import { GetAllCategoryService } from "@/app/service/category-service";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetTopicsBySubcategoryService } from "@/app/service/topic-service";
import { FaCamera } from "react-icons/fa";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  FileText, 
  Award, 
  Briefcase, 
  Languages, 
  Settings, 
  Camera,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Building,
  Target,
  Image as ImageIcon,
  MapPin
} from "lucide-react";
import { getProfile, ProfileService } from "@/app/service/course-provider-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { useModal } from "@/components/ModalProvider";

const CourseProviderSettings = () => {
  const { showAlert } = useModal();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
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
    profilePicture: "" as any,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  const fetchProfileData = async () => {
    try {
      const userProfile = await getProfile();

      if (userProfile) {
        const profileData = userProfile as any;
        setProfile((prev) => ({
          ...prev,
          ...profileData,
          name: profileData.courseProvider?.name || profileData.name || "",
          email: profileData.courseProvider?.email || "",
          phone: profileData.courseProvider?.phone || profileData.phone || "",
          address: profileData.courseProvider?.address || profileData.address || "",
          profilePicture: profileData.courseProvider?.profilePicture || profileData.profilePicture || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    fetchProfileData();
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
        // Only append if value is not null/undefined
        if (value !== null && value !== undefined) {
           formData.append(key, value as string | Blob);
        }
      });

      await ProfileService(formData);
      await fetchProfileData(); // Refresh data from server
      showAlert({ message: "Profile updated successfully!", type: "success" });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showAlert({ message: error.message || "Profile update failed.", type: "error" });
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { id: 1, name: "Account Details", icon: User },
    { id: 2, name: "Professional Bio", icon: Briefcase },
    { id: 3, name: "Media & Expertise", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-transparent py-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Widget */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-900/5 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-purple-100 shadow-inner bg-gray-50 flex items-center justify-center">
                    {profile.profilePicture ? (
                       <img src={profile.profilePicture instanceof File ? URL.createObjectURL(profile.profilePicture) : getAssetUrl(profile.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <div className="text-purple-300"><Building size={48} /></div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-purple-700 p-2.5 rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white">
                    <Camera size={18} className="text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                  </label>
               </div>
               <div>
                  <h2 className="text-3xl font-black text-gray-950 tracking-tight">{profile.name || "Course Provider Profile"}</h2>
                  <p className="text-purple-700 font-black uppercase tracking-[0.2em] text-[10px] mt-1 flex items-center gap-2">
                     <CheckCircle2 size={12} /> Account Identity Verified
                  </p>
               </div>
            </div>
            
            <div className="grid grid-cols-3 md:flex items-center gap-2">
               {steps.map((step) => {
                 const StepIcon = step.icon;
                 return (
                    <button 
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex flex-col md:flex-row items-center gap-3 px-6 py-4 rounded-3xl transition-all ${
                        currentStep === step.id 
                        ? "bg-gray-950 text-white shadow-xl shadow-gray-900/20" 
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 font-bold"
                      }`}
                    >
                      <StepIcon size={20} />
                      <span className="text-xs uppercase tracking-widest font-black hidden lg:block">{step.name}</span>
                    </button>
                 );
               })}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Area */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-900/5 border border-purple-100 min-h-[500px] flex flex-col">
                
                {/* Step 1: Account Info */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl"><User size={24} /></div>
                      <div>
                        <h3 className="text-xl font-black text-gray-950 tracking-tight">Account Identity</h3>
                        <p className="text-xs text-gray-800 font-bold">These details are synced with your registration.</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 items-start pb-6">
                        {/* Static Image Preview Card */}
                        <div className="w-full md:w-64 space-y-3">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Current Identity Seal</span>
                           <div className="aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center relative group">
                              {profile.profilePicture ? (
                                <img 
                                  src={profile.profilePicture instanceof File ? URL.createObjectURL(profile.profilePicture) : getAssetUrl(profile.profilePicture)} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="text-gray-200"><Building size={64} /></div>
                              )}
                              <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                 <ImageIcon className="text-white" size={32} />
                              </div>
                           </div>
                           <p className="text-[9px] text-gray-500 font-bold text-center italic">Brand logo as seen by students</p>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Business Name</span>
                              <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:border-purple-200 transition-all">
                                 <User size={18} className="text-gray-400" />
                                 <input type="text" name="name" value={profile.name} onChange={handleChange} className="bg-transparent w-full outline-none font-black text-gray-950" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Official Email</span>
                              <div className="p-4 bg-gray-100 border-2 border-transparent rounded-2xl font-black text-gray-400 cursor-not-allowed flex items-center gap-3">
                                 <Mail size={18} /> {profile.email}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Contact Phone</span>
                              <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:border-purple-200 transition-all">
                                 <Phone size={18} className="text-gray-400" />
                                 <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="bg-transparent w-full outline-none font-black text-gray-950" />
                              </div>
                            </div>
                            <div className="space-y-2">
                               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Business Address</span>
                               <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:border-purple-200 transition-all">
                                  <MapPin size={18} className="text-gray-400" />
                                  <input type="text" name="address" value={profile.address} onChange={handleChange} placeholder="e.g. NJ, America" className="bg-transparent w-full outline-none font-black text-gray-950" />
                               </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Market Specialization</span>
                              <input
                                 type="text"
                                 name="specialization"
                                 value={profile.specialization}
                                 onChange={handleChange}
                                 placeholder="e.g. Data Science & AI"
                                 className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-950 placeholder:text-gray-400"
                              />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-100 flex justify-end">
                       <button onClick={nextStep} className="flex items-center gap-3 bg-purple-700 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-purple-800 transition-all shadow-xl shadow-purple-900/20 active:scale-95">
                          Professional Bio <ChevronRight size={18} />
                       </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Bio */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl"><Briefcase size={24} /></div>
                      <div>
                        <h3 className="text-xl font-black text-gray-950 tracking-tight">Company & Expertise</h3>
                        <p className="text-xs text-gray-800 font-bold">Tell your students about your experience and reach.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Website URL</span>
                          <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:border-purple-200 transition-all">
                             <Globe size={18} className="text-gray-400" />
                             <input type="text" name="website" value={profile.website} onChange={handleChange} placeholder="https://example.com" className="bg-transparent w-full outline-none font-black text-gray-950" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">LinkedIn Profile</span>
                          <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus-within:border-purple-200 transition-all">
                             <Linkedin size={18} className="text-gray-400" />
                             <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="linkedin.com/in/you" className="bg-transparent w-full outline-none font-black text-gray-950" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Professional Bio</span>
                       <textarea 
                          name="bio" 
                          value={profile.bio} 
                          onChange={handleChange} 
                          placeholder="Write a compelling background about your business or professional career..."
                          className="w-full p-6 bg-gray-50 border-2 border-gray-200 rounded-[2rem] focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-950 placeholder:text-gray-400 min-h-[160px]"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Years of Experience</span>
                          <input type="text" name="experience" value={profile.experience} onChange={handleChange} placeholder="e.g. 10+ Years" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-950 placeholder:text-gray-400" />
                       </div>
                       <div className="space-y-2">
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Languages Supported</span>
                          <input type="text" name="languages" value={profile.languages} onChange={handleChange} placeholder="e.g. English, Spanish" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-950 placeholder:text-gray-400" />
                       </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-100 flex justify-between">
                       <button onClick={prevStep} className="flex items-center gap-3 bg-gray-100 text-gray-800 px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">
                          <ChevronLeft size={18} /> Back
                       </button>
                       <button onClick={nextStep} className="flex items-center gap-3 bg-purple-700 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-purple-800 transition-all shadow-xl shadow-purple-900/20 active:scale-95">
                          Expertise & Media <ChevronRight size={18} />
                       </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Expertise & Media */}
                {currentStep === 3 && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-100 text-green-700 rounded-2xl"><Target size={24} /></div>
                        <div>
                          <h3 className="text-xl font-black text-gray-950 tracking-tight">Market Expertise</h3>
                          <p className="text-xs text-gray-800 font-bold">Select your primary area of teaching.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-2">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Primary Category</span>
                           <select 
                              name="expertiseCategory" 
                              value={profile.expertiseCategory} 
                              onChange={handleChange} 
                              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 appearance-none cursor-pointer"
                           >
                             <option value="">Select Category</option>
                             {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                           </select>
                         </div>
                         <div className="space-y-2">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Subcategory</span>
                           <select 
                              name="expertiseSubcategory" 
                              value={profile.expertiseSubcategory} 
                              onChange={handleChange} 
                              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 appearance-none cursor-pointer"
                           >
                             <option value="">Select Subcategory</option>
                             {subcategories.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                           </select>
                         </div>
                         <div className="space-y-2">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Main Topic</span>
                           <select 
                              name="expertiseTopic" 
                              value={profile.expertiseTopic} 
                              onChange={handleChange} 
                              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-200 transition-all outline-none font-black text-gray-900 appearance-none cursor-pointer"
                           >
                             <option value="">Select Topic</option>
                             {topics.map((topic) => <option key={topic._id} value={topic._id}>{topic.name}</option>)}
                           </select>
                         </div>
                      </div>

                      <div className="p-8 bg-gray-100 rounded-3xl border border-gray-200 shadow-inner">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-purple-700 text-white rounded-lg"><ImageIcon size={16} /></div>
                            <span className="text-xs font-black text-gray-800 uppercase tracking-widest block">Home Page Partner Preview</span>
                         </div>
                         <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                             <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center grayscale opacity-60">
                                {profile.profilePicture ? (
                                   <img src={profile.profilePicture instanceof File ? URL.createObjectURL(profile.profilePicture) : getAssetUrl(profile.profilePicture)} className="w-full h-full object-cover" />
                                ) : (
                                   <Building size={32} className="text-gray-300" />
                                )}
                             </div>
                             <div>
                                <h4 className="font-black text-gray-950 uppercase italic tracking-tighter text-xl">{profile.name || "Provider Name"}</h4>
                                <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest">{profile.specialization || "Professional Partner"}</p>
                             </div>
                             <div className="ml-auto hidden md:block">
                                <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">Partner</div>
                             </div>
                         </div>
                         <p className="text-[10px] text-gray-700 mt-4 font-black uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-600" />
                            This preview shows how your brand will appear to students on the home page.
                         </p>
                      </div>

                      <div className="mt-auto pt-8 border-t border-gray-100 flex justify-between">
                         <button onClick={prevStep} className="flex items-center gap-3 bg-gray-100 text-gray-800 px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">
                            <ChevronLeft size={18} /> Back
                         </button>
                         <button onClick={handleSave} className="flex items-center gap-3 bg-gray-950 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-purple-700 transition-all shadow-xl active:scale-95 ring-4 ring-gray-900/10">
                            Save Profile Changes <Save size={18} />
                         </button>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProviderSettings;
