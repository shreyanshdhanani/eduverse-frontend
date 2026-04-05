"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Save, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CreateTopicService, GetSubcategoryByIdService, GetTopicsBySubcategoryService, DeleteTopicService, UpdateTopicService } from "@/app/service/topic-service";

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
  const [subcategory, setsubCategory] = useState<SubCategory | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for new topic input
  const [newTopicName, setNewTopicName] = useState<string>("");
  const [newTopicDescription, setNewTopicDescription] = useState<string>("");

  // State for editing
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [originalTopicData, setOriginalTopicData] = useState<Topic | null>(null); // Store original data for reset

  // Get the subcategoryId from the URL parameters
  const params = useParams();
  const router = useRouter();
  const subcategoryId = params?.subcategoryId;

  // Fetch topics based on subcategoryId
  useEffect(() => {
    if (subcategoryId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const subcategoryData = await GetSubcategoryByIdService(subcategoryId as string);
          setsubCategory(subcategoryData as any);
          
          const topicsData = await GetTopicsBySubcategoryService(subcategoryId as string);
          setTopics(Array.isArray(topicsData) ? topicsData : (topicsData as any)?.data || []);
        } catch (err) {
          setError("Failed to fetch topics.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [subcategoryId]);

  // Handle adding new topic via CreateTopicService
  const handleAddTopic = async () => {
    if (!newTopicName.trim() || !newTopicDescription.trim()) {
      setError("Topic name and description are required.");
      return;
    }

    try {
      setLoading(true);
      const newTopic = await CreateTopicService(subcategoryId as string, newTopicName, newTopicDescription);
      
      // After successful topic creation, update the topics list
      setTopics((prev) => [...prev, newTopic as any]);
      setNewTopicName("");
      setNewTopicDescription("");
      setError(null);
    } catch (err) {
      setError("Failed to create topic.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing topic
  const handleEditTopic = (id: string) => {
    setEditingTopicId(id);
    const topicToEdit = topics.find((topic) => topic._id === id);
    if (topicToEdit) {
      setOriginalTopicData(topicToEdit);
    }
  };

  // Handle saving topic after editing
// Handle saving topic after editing
const handleSaveEdit = async (id: string, updatedName: string, updatedDescription: string) => {
  try {
    setLoading(true);
    const updatedTopic = await UpdateTopicService(id, updatedName, updatedDescription); // Call the service to update the topic
    
    const topicsData = await GetTopicsBySubcategoryService(subcategoryId as string);
    // Update the local state with the updated topic data immediately after the update
    setEditingTopicId(null);
    setTopics(Array.isArray(topicsData) ? topicsData : (topicsData as any)?.data || []);
    setOriginalTopicData(null);
    setError(null);
  } catch (err) {
    setError("Failed to update topic.");
  } finally {
    setLoading(false);
  }
};

  // Cancel edit
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

  // Handle deleting topic via DeleteTopicService
  const handleDeleteTopic = async (id: string) => {
    try {
      setLoading(true);
      await DeleteTopicService(id); // Call DeleteTopicService to delete the topic from the backend
      
      // Remove the topic from the state after successful deletion
      const updatedTopics = topics.filter((topic) => topic._id !== id);
      setTopics(updatedTopics);
      setError(null);
    } catch (err) {
      setError("Failed to delete topic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">Topics</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      {subcategory && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{subcategory.name}</h3>
          <p className="text-gray-600">{subcategory.description}</p>
        </div>
      )}

      {/* Form to Add New Topic */}
      <div className="mb-6 flex items-center space-x-3">
        <input
          type="text"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          placeholder="Topic name"
          className="p-2 border rounded-md w-80"
        />
        <input
          type="text"
          value={newTopicDescription}
          onChange={(e) => setNewTopicDescription(e.target.value)}
          placeholder="Topic description"
          className="p-2 border rounded-md w-80"
        />
        <button onClick={handleAddTopic} className="p-2 bg-purple-600 text-white rounded-md">
          Add Topic
        </button>
      </div>

      {/* Display Topics */}
      <div className="mb-6">
        {topics.length === 0 ? (
          <p>No topics available.</p>
        ) : (
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Topic Name</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    {editingTopicId === topic._id ? (
                      <input
                        type="text"
                        value={topic.name}
                        onChange={(e) =>
                          setTopics((prev) =>
                            prev.map((t) =>
                              t._id === topic._id ? { ...t, name: e.target.value } : t
                            )
                          )
                        }
                        className="p-2 border rounded-md w-full"
                      />
                    ) : (
                      topic.name
                    )}
                  </td>
                  <td className="p-3">
                    {editingTopicId === topic._id ? (
                      <input
                        type="text"
                        value={topic.description}
                        onChange={(e) =>
                          setTopics((prev) =>
                            prev.map((t) =>
                              t._id === topic._id
                                ? { ...t, description: e.target.value }
                                : t
                            )
                          )
                        }
                        className="p-2 border rounded-md w-full"
                      />
                    ) : (
                      topic.description
                    )}
                  </td>
                  <td className="p-3 flex justify-center items-center space-x-8">
                    {editingTopicId === topic._id ? (
                      <>
                        <button onClick={() => handleSaveEdit(topic._id, topic.name, topic.description)} className="text-green-600">
                          <Save />
                        </button>
                        <button onClick={handleCancelEdit} className="text-orange-500">
                          <XCircle />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditTopic(topic._id)} className="text-yellow-500">
                          <Pencil />
                        </button>
                        <button onClick={() => handleDeleteTopic(topic._id)} className="text-red-500">
                          <Trash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
