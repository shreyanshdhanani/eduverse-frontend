"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetSubcategoriesByCategoryService } from "@/app/service/subcategory-service";
import { GetCategoryByIdService } from "@/app/service/category-service";
import { CreateSubcategoryService, DeleteSubcategoryService, UpdateSubcategoryService } from "@/app/service/subcategory-service"; // Assuming services exist

import { Pencil, Trash2, Save, XCircle, CircleArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Subcategory {
  _id: string;
  name: string;
  description: string;
}

export default function SubcategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [newSubcategoryDescription, setNewSubcategoryDescription] = useState<string>("");
  
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [originalSubcategoryData, setOriginalSubcategoryData] = useState<Subcategory | null>(null); // Store original data for reset

  const params = useParams();
  const router = useRouter();
  const categoryId = params?.categoryId;

  // Fetch category details and subcategories
  useEffect(() => {
    if (categoryId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const categoryData = await GetCategoryByIdService(categoryId as string);
          setCategory(categoryData as any);

          const subcategoryData = await GetSubcategoriesByCategoryService(categoryId as string);
          setSubcategories(Array.isArray(subcategoryData) ? subcategoryData : (subcategoryData as any)?.data || []);
        } catch (err) {
          setError("Failed to fetch category or subcategories.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [categoryId]);

  // Handle adding new subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !newSubcategoryDescription.trim()) {
      setError("Subcategory name and description are required.");
      return;
    }
    try {
      const newSubcategory = await CreateSubcategoryService(categoryId as string, newSubcategoryName, newSubcategoryDescription);
      setSubcategories((prev) => [...prev, newSubcategory as any]);
      setNewSubcategoryName("");
      setNewSubcategoryDescription("");
      setError(null);
    } catch (err) {
      setError("Failed to add subcategory.");
    }
  };

  // Handle deleting subcategory
  const handleDeleteSubcategory = async (id: string) => {
    try {
      await DeleteSubcategoryService(id);
      setSubcategories((prev) => prev.filter((subcategory) => subcategory._id !== id));
    } catch (err) {
      setError("Failed to delete subcategory.");
    }
  };

  // Handle editing subcategory
  const handleEditSubcategory = (id: string) => {
    setEditingSubcategoryId(id);
    const subcategoryToEdit = subcategories.find((subcategory) => subcategory._id === id);
    if (subcategoryToEdit) {
      setOriginalSubcategoryData(subcategoryToEdit);
    }
  };

  // Save edited subcategory
  const handleSaveEdit = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
      await UpdateSubcategoryService(id, updatedName, updatedDescription);
      const updatedSubcategories = await GetSubcategoriesByCategoryService(categoryId as string);
      setSubcategories(Array.isArray(updatedSubcategories) ? updatedSubcategories : (updatedSubcategories as any)?.data || []);
      setEditingSubcategoryId(null);
      setError(null);
    } catch (err) {
      setError("Failed to update subcategory.");
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    if (originalSubcategoryData) {
      setSubcategories((prev) => 
        prev.map((subcategory) => 
          subcategory._id === originalSubcategoryData._id ? originalSubcategoryData : subcategory
        )
      );
    }
    setEditingSubcategoryId(null);
    setOriginalSubcategoryData(null);
  };

  if (!categoryId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">Sub Categories</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      {category && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="text-gray-600">{category.description}</p>
        </div>
      )}

      {/* Form to Add New Subcategory */}
      <div className="mb-6 flex items-center space-x-3">
        <input
          type="text"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          placeholder="Subcategory name"
          className="p-2 border rounded-md w-80"
        />
        <input
          type="text"
          value={newSubcategoryDescription}
          onChange={(e) => setNewSubcategoryDescription(e.target.value)}
          placeholder="Subcategory description"
          className="p-2 border rounded-md w-80"
        />
        <button onClick={handleAddSubcategory} className="p-2 bg-purple-600 text-white rounded-md">
          Add Subcategory
        </button>
      </div>

      {/* Display Subcategories */}
      <div className="mb-6">
        {subcategories.length === 0 ? (
          <p>No subcategories available.</p>
        ) : (
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Subcategory Name</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory) => (
                <tr key={subcategory._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    {editingSubcategoryId === subcategory._id ? (
                      <input
                        type="text"
                        value={subcategory.name}
                        onChange={(e) =>
                          setSubcategories((prev) =>
                            prev.map((s) =>
                              s._id === subcategory._id
                                ? { ...s, name: e.target.value }
                                : s
                            )
                          )
                        }
                        className="p-2 border rounded-md w-full"
                      />
                    ) : (
                      subcategory.name
                    )}
                  </td>
                  <td className="p-3">
                    {editingSubcategoryId === subcategory._id ? (
                      <input
                        type="text"
                        value={subcategory.description}
                        onChange={(e) =>
                          setSubcategories((prev) =>
                            prev.map((s) =>
                              s._id === subcategory._id
                                ? { ...s, description: e.target.value }
                                : s
                            )
                          )
                        }
                        className="p-2 border rounded-md w-full"
                      />
                    ) : (
                      subcategory.description
                    )}
                  </td>
                  <td className="p-3 flex justify-center items-center space-x-8">
                    {editingSubcategoryId === subcategory._id ? (
                      <>
                        <button onClick={() => handleSaveEdit(subcategory._id, subcategory.name, subcategory.description)} className="text-green-600">
                          <Save />
                        </button>
                        <button onClick={handleCancelEdit} className="text-orange-500">
                          <XCircle />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditSubcategory(subcategory._id)} className="text-yellow-500">
                          <Pencil />
                        </button>
                        <button onClick={() => handleDeleteSubcategory(subcategory._id)} className="text-red-500">
                          <Trash2 />
                        </button>
                        <button onClick={() =>router.push(`/super-admin/categories/${categoryId}/${subcategory._id}`)} className="text-blue-500">
                            <CircleArrowRight />
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
