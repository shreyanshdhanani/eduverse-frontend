"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CreateTopicService, 
  GetSubcategoryByIdService, 
  GetTopicsBySubcategoryService, 
  DeleteTopicService, 
  UpdateTopicService 
} from "@/app/service/topic-service";
import { 
  Pencil, 
  Trash2, 
  Save, 
  XCircle, 
  Plus, 
  FolderOpen, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

interface Topic {
  _id: string;
  name: string;
  description: string;
}

interface SubCategory {
  _id: string;
  name: string;
  description: string;
}

export default function TopicPage() {
  const [subcategory, setSubCategory] = useState<SubCategory | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newTopicName, setNewTopicName] = useState<string>("");
  const [newTopicDescription, setNewTopicDescription] = useState<string>("");

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [originalTopicData, setOriginalTopicData] = useState<Topic | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const subcategoryId = params?.subcategoryId as string;
  const categoryId = params?.categoryId as string;

  useEffect(() => {
    if (subcategoryId) {
      fetchData();
    }
  }, [subcategoryId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const subcategoryData = await GetSubcategoryByIdService(subcategoryId);
      setSubCategory(subcategoryData as any);
      
      const topicsData = await GetTopicsBySubcategoryService(subcategoryId);
      setTopics(Array.isArray(topicsData) ? topicsData : (topicsData as any)?.data || []);
    } catch (err) {
      setError("Failed to fetch subcategory or topics.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAddTopic = async () => {
    if (!newTopicName.trim() || !newTopicDescription.trim()) {
      setError("Topic name and description are required.");
      return;
    }

    try {
      setError(null);
      const newTopic = await CreateTopicService(subcategoryId, newTopicName, newTopicDescription);
      setTopics((prev) => [...prev, newTopic as any]);
      setNewTopicName("");
      setNewTopicDescription("");
      showSuccess("Topic added successfully!");
    } catch (err) {
      setError("Failed to create topic.");
    }
  };

  const handleEditTopic = (id: string) => {
    setEditingTopicId(id);
    const topicToEdit = topics.find((topic) => topic._id === id);
    if (topicToEdit) {
      setOriginalTopicData(topicToEdit);
    }
  };

  const handleSaveEdit = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
      await UpdateTopicService(id, updatedName, updatedDescription);
      const topicsData = await GetTopicsBySubcategoryService(subcategoryId);
      setTopics(Array.isArray(topicsData) ? topicsData : (topicsData as any)?.data || []);
      setEditingTopicId(null);
      setOriginalTopicData(null);
      setError(null);
      showSuccess("Topic updated successfully!");
    } catch (err) {
      setError("Failed to update topic.");
    }
  };

  const handleCancelEdit = () => {
    if (originalTopicData) {
      setTopics((prev) =>
        prev.map((topic) =>
          topic._id === originalTopicData._id ? originalTopicData : topic
        )
      );
    }
    setEditingTopicId(null);
    setOriginalTopicData(null);
  };

  const handleDeleteTopic = async (id: string) => {
    setDeletingId(id);
    try {
      await DeleteTopicService(id);
      setTopics((prev) => prev.filter((topic) => topic._id !== id));
      showSuccess("Topic deleted successfully.");
    } catch (err) {
      setError("Failed to delete topic.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push(`/super-admin/categories/${categoryId}`)}
              className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors"
              title="Back to Subcategories"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FolderOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {subcategory ? `${subcategory.name}'s Topics` : 'Topics'}
              </h1>
              <p className="text-xs text-gray-400">{topics.length} topics available</p>
            </div>
          </div>
        </div>

        {/* Alert messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4 border border-red-100">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
            <button className="ml-auto text-red-400 hover:text-red-600" onClick={() => setError(null)}>✕</button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm mb-4 border border-green-100">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Add Topic Form */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add New Topic</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Topic name"
              className="flex-1 p-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <input
              type="text"
              value={newTopicDescription}
              onChange={(e) => setNewTopicDescription(e.target.value)}
              placeholder="Topic description"
              className="flex-1 p-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <button
              onClick={handleAddTopic}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap shadow-sm shadow-purple-200 active:scale-95"
            >
              <Plus size={16} /> Add Topic
            </button>
          </div>
        </div>
      </div>

      {/* Topics Table / Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-3 p-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No topics yet</p>
            <p className="text-sm mt-1">Use the form above to add your first topic.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic, idx) => (
                    <tr key={topic._id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-400 font-bold">{idx + 1}</td>
                      <td className="px-6 py-4">
                        {editingTopicId === topic._id ? (
                          <input
                            type="text"
                            value={topic.name}
                            onChange={(e) => setTopics((prev) => prev.map((t) => t._id === topic._id ? { ...t, name: e.target.value } : t))}
                            className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="font-semibold text-gray-800 text-sm">{topic.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingTopicId === topic._id ? (
                          <input
                            type="text"
                            value={topic.description}
                            onChange={(e) => setTopics((prev) => prev.map((t) => t._id === topic._id ? { ...t, description: e.target.value } : t))}
                            className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">{topic.description}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {editingTopicId === topic._id ? (
                            <>
                              <button onClick={() => handleSaveEdit(topic._id, topic.name, topic.description)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Save"><Save size={16} /></button>
                              <button onClick={handleCancelEdit} className="p-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200 transition" title="Cancel"><XCircle size={16} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditTopic(topic._id)} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition" title="Edit"><Pencil size={16} /></button>
                              <button onClick={() => handleDeleteTopic(topic._id)} disabled={deletingId === topic._id} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition disabled:opacity-40" title="Delete"><Trash2 size={16} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {topics.map((topic, idx) => (
                <div key={topic._id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      {editingTopicId === topic._id ? (
                        <input
                          type="text"
                          value={topic.name}
                          onChange={(e) => setTopics((prev) => prev.map((t) => t._id === topic._id ? { ...t, name: e.target.value } : t))}
                          className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                        />
                      ) : (
                        <p className="font-bold text-gray-900 text-sm">{topic.name}</p>
                      )}
                      {editingTopicId === topic._id ? (
                        <input
                          type="text"
                          value={topic.description}
                          onChange={(e) => setTopics((prev) => prev.map((t) => t._id === topic._id ? { ...t, description: e.target.value } : t))}
                          className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{topic.description}</p>
                      )}
                    </div>
                    <span className="text-xs bg-purple-50 text-purple-500 font-bold px-2 py-0.5 rounded-lg flex-shrink-0">#{idx+1}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {editingTopicId === topic._id ? (
                      <>
                        <button onClick={() => handleSaveEdit(topic._id, topic.name, topic.description)} className="flex-1 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><Save size={14} />Save</button>
                        <button onClick={handleCancelEdit} className="flex-1 py-2 bg-orange-50 text-orange-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><XCircle size={14} />Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditTopic(topic._id)} className="flex-1 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><Pencil size={14} />Edit</button>
                        <button onClick={() => handleDeleteTopic(topic._id)} disabled={deletingId === topic._id} className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40"><Trash2 size={14} />Delete</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
