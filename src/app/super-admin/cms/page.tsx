"use client";

import React, { useState, useEffect } from "react";
import { GetLandingPageService, UpdateLandingPageService } from "@/app/service/cms-service";
import { 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon, 
  BarChart3, 
  Star, 
  Users, 
  Layout, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function CMSPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await GetLandingPageService();
      setData(res);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      const { _id, updatedAt, createdAt, ...payload } = data;
      await UpdateLandingPageService(payload);
      setMessage({ type: "success", text: "Content updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: string, defaultValue: any) => {
    setData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
  };

  const removeItem = (field: string, index: number) => {
    setData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const updateItem = (field: string, index: number, key: string, value: any) => {
    setData((prev: any) => {
      const newList = [...(prev[field] || [])];
      newList[index] = { ...newList[index], [key]: value };
      return { ...prev, [field]: newList };
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
        activeTab === id
          ? "bg-purple-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Landing Page Content Management</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 transition shadow-sm"
        >
          {saving ? <div className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <TabButton id="hero" label="Hero Section" icon={Layout} />
        <TabButton id="stats" label="Statistics" icon={BarChart3} />
        <TabButton id="features" label="Features" icon={Star} />
        <TabButton id="testimonials" label="Testimonials" icon={Users} />
        <TabButton id="partners" label="Partners" icon={ImageIcon} />
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {/* HERO TAB */}
        {activeTab === "hero" && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Type size={14} className="text-purple-500" /> Hero Title
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={data.hero?.title || ""}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Type size={14} className="text-purple-500" /> Hero Subtitle
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                value={data.hero?.subtitle || ""}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon size={14} className="text-purple-500" /> Hero Image URL
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  value={data.hero?.imageUrl || ""}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, imageUrl: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <LinkIcon size={14} className="text-purple-500" /> CTA Link
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  value={data.hero?.ctaLink || ""}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaLink: e.target.value } })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500 italic">Manage counter cards (e.g., 100k+ Students)</p>
              <button 
                onClick={() => addItem("stats", { label: "Students", value: "100k+", icon: "Users" })}
                className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1"
              >
                <Plus size={16} /> Add Stat
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.stats?.map((stat: any, index: number) => (
                <div key={index} className="p-4 border rounded-xl relative bg-gray-50 flex flex-col gap-2 group">
                  <button 
                    onClick={() => removeItem("stats", index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                  <input
                    placeholder="Value (e.g. 50+)"
                    className="bg-transparent font-bold text-lg outline-none border-b border-transparent focus:border-purple-300"
                    value={stat.value}
                    onChange={(e) => updateItem("stats", index, "value", e.target.value)}
                  />
                  <input
                    placeholder="Label (e.g. Mentors)"
                    className="bg-transparent text-sm text-gray-600 outline-none border-b border-transparent focus:border-purple-300"
                    value={stat.label}
                    onChange={(e) => updateItem("stats", index, "label", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div className="space-y-4">
            <button 
              onClick={() => addItem("features", { title: "New Feature", description: "Details...", icon: "Zap" })}
              className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1"
            >
              <Plus size={16} /> Add Feature
            </button>
            <div className="space-y-3">
              {data.features?.map((f: any, index: number) => (
                <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-2 relative group">
                   <button 
                    onClick={() => removeItem("features", index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                  <input
                    placeholder="Title"
                    className="w-full font-bold outline-none bg-transparent"
                    value={f.title}
                    onChange={(e) => updateItem("features", index, "title", e.target.value)}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full text-sm text-gray-600 outline-none bg-transparent resize-none h-16"
                    value={f.description}
                    onChange={(e) => updateItem("features", index, "description", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === "testimonials" && (
          <div className="space-y-4">
            <button 
              onClick={() => addItem("testimonials", { name: "Name", role: "Student", feedback: "Awesome...", avatar: "" })}
              className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1"
            >
              <Plus size={16} /> Add Testimonial
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.testimonials?.map((t: any, index: number) => (
                <div key={index} className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-2 relative group">
                  <button 
                    onClick={() => removeItem("testimonials", index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                  <input
                    placeholder="Name"
                    className="font-bold outline-none bg-transparent"
                    value={t.name}
                    onChange={(e) => updateItem("testimonials", index, "name", e.target.value)}
                  />
                  <input
                    placeholder="Role"
                    className="text-xs text-purple-600 font-medium outline-none bg-transparent"
                    value={t.role}
                    onChange={(e) => updateItem("testimonials", index, "role", e.target.value)}
                  />
                  <textarea
                    placeholder="Feedback"
                    className="text-sm text-gray-600 outline-none bg-transparent resize-none h-20"
                    value={t.feedback}
                    onChange={(e) => updateItem("testimonials", index, "feedback", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PARTNERS TAB */}
        {activeTab === "partners" && (
          <div className="space-y-4">
            <button 
              onClick={() => addItem("partners", { name: "Google", logoUrl: "" })}
              className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1"
            >
              <Plus size={16} /> Add Partner
            </button>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.partners?.map((p: any, index: number) => (
                <div key={index} className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-2 relative group items-center text-center">
                  <button 
                    onClick={() => removeItem("partners", index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Partner Name</label>
                  <input
                    className="text-xs font-bold outline-none bg-transparent w-full text-center"
                    value={p.name}
                    onChange={(e) => updateItem("partners", index, "name", e.target.value)}
                  />
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-2">Logo URL</label>
                  <input
                    className="text-[10px] bg-white border px-2 py-1 rounded w-full outline-none"
                    value={p.logoUrl}
                    onChange={(e) => updateItem("partners", index, "logoUrl", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
