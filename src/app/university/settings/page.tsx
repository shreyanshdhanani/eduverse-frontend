"use client";

import { useEffect, useState } from "react";
import { GetUniversityProfile, UpdateUniversityProfile } from "@/app/service/university-service";
import { Camera, Save, Globe, Mail, Phone, MapPin, Building, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { getAssetUrl } from "@/app/utils/asset-url";

export default function UniversitySettings() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await GetUniversityProfile();
                setProfile(data as any);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append("universityName", profile.universityName);
        formData.append("address", profile.address);
        formData.append("contactNumber", profile.contactNumber);
        formData.append("website", profile.website || "");
        if (logoFile) {
            formData.append("logo", logoFile);
        }

        try {
            await UpdateUniversityProfile(formData);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const currentLogo = profile?.logo ? getAssetUrl(profile.logo) : "/default_user.png";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">University Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your university branding and contact details.</p>
                </div>
                <div className="flex items-center gap-3">
                   {message.text && (
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {message.text}
                        </div>
                   )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Logo Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Camera size={20} className="text-purple-600" />
                        Branding & Logo
                    </h3>
                    <div className="flex items-center gap-8">
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 group">
                            <Image
                                src={previewImage || currentLogo}
                                alt="University Logo"
                                fill
                                className="object-cover"
                            />
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <span className="text-sm font-medium">Change</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800">University Logo</h4>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                Recommended size: 512x512px. Supported formats: JPG, PNG, WEBP.
                            </p>
                            <label className="mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 cursor-pointer transition">
                                Choose File
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Info Fields */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Building size={20} className="text-purple-600" />
                            General Information
                        </h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Building size={14} /> University Name
                        </label>
                        <input
                            type="text"
                            name="universityName"
                            value={profile?.universityName || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Mail size={14} /> Official Email
                        </label>
                        <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Phone size={14} /> Contact Number
                        </label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={profile?.contactNumber || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <LinkIcon size={14} /> Website URL
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={profile?.website || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin size={14} /> Full Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={profile?.address || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="flex justify-end p-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Profile Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
