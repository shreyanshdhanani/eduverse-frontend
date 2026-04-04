"use client"
import { useEffect, useState } from "react";
import { Pencil, Trash2, Save, XCircle, CircleArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CreateCategoryService,
  DeleteCategoryService,
  GetAllCategoryService,
  UpdateCategoryService,
} from "@/app/service/category-service";

export default function CategoryCRUD() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [originalCategoryData, setOriginalCategoryData] = useState<any | null>(null); // To store original category data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await GetAllCategoryService();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // const handleNavigate = (id: string) => {
  //   router.push(`/super-admin/categories/${id}`);
  // };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !newDescription.trim()) {
      setError("Category name and description are required.");
      return;
    }
    try {
      const newCategoryObj = await CreateCategoryService(newCategory, newDescription);
      setCategories((prevCategories) => [...prevCategories, newCategoryObj]);
      setNewCategory("");
      setNewDescription("");
      setError(null);
    } catch (err) {
      setError("Failed to add category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await DeleteCategoryService(id);
      setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
    } catch (err) {
      setError("Failed to delete category. Please try again.");
    }
  };

  const handleEditCategory = (id: string) => {
    setEditingCategoryId(id);
    // Store the original data to reset if canceled
    const categoryToEdit = categories.find((category) => category._id === id);
    if (categoryToEdit) {
      setOriginalCategoryData(categoryToEdit); // Save original data
    }
  };

  const handleSaveEdit = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
      await UpdateCategoryService(id, updatedName, updatedDescription);
      
      // Re-fetch updated categories from the database
      const updatedCategories = await GetAllCategoryService();
      setCategories(updatedCategories);
      
      setEditingCategoryId(null);
      setError(null); // Clear error after success
    } catch (err) {
      setError("Failed to update category. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    // Revert the category back to the original values in the `categories` state
    if (originalCategoryData) {
      setCategories((prevCategories) => 
        prevCategories.map((category) =>
          category._id === originalCategoryData._id ? originalCategoryData : category
        )
      );
    }
    setEditingCategoryId(null); // Clear editing mode
    setOriginalCategoryData(null); // Clear original data
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">Categories</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading categories...</p>}

      <div className="mb-6 flex items-center space-x-3">
        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" className="p-2 border rounded-md w-80" />
        <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Category description" className="p-2 border rounded-md w-80" />
        <button onClick={handleAddCategory} className="p-2 bg-purple-600 text-white rounded-md">Add Category</button>
      </div>

      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Category Name</th>
            <th className="p-3">Description</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="border-b hover:bg-gray-100">
              <td className="p-3">
                {editingCategoryId === category._id ? (
                  <input type="text" value={category.name} onChange={(e) => setCategories((prev) => prev.map((c) => (c._id === category._id ? { ...c, name: e.target.value } : c)))} className="p-2 border rounded-md w-full" />
                ) : (
                  category.name
                )}
              </td>
              <td className="p-3">
                {editingCategoryId === category._id ? (
                  <input type="text" value={category.description} onChange={(e) => setCategories((prev) => prev.map((c) => (c._id === category._id ? { ...c, description: e.target.value } : c)))} className="p-2 border rounded-md w-full" />
                ) : (
                  category.description
                )}
              </td>
              <td className="p-3 flex justify-center items-center space-x-8">
                {editingCategoryId === category._id ? (
                  <>
                    <button onClick={() => handleSaveEdit(category._id, category.name, category.description)} className="text-green-600"><Save /></button>
                    <button onClick={handleCancelEdit} className="text-orange-500"><XCircle /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditCategory(category._id)} className="text-yellow-500"><Pencil /></button>
                    <button onClick={() => handleDeleteCategory(category._id)} className="text-red-500"><Trash2 /></button>
                    <button onClick={() =>router.push(`/super-admin/categories/${category._id}`)} className="text-blue-500"><CircleArrowRight /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
