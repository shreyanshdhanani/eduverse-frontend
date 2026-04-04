"use client";

import { useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

// Mock data for categories (replace with real API data later)
const initialCategories = [
  { id: 1, name: "Science", description: "Study of the natural world" },
  { id: 2, name: "Technology", description: "Application of scientific knowledge" },
  { id: 3, name: "Engineering", description: "Design and construction of machines" },
  { id: 4, name: "Mathematics", description: "Abstract science of numbers and shapes" },
];

export default function CategoryCRUD() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleAddCategory = () => {
    if (newCategory.trim() && newDescription.trim()) {
      const newCategoryObj = {
        id: categories.length + 1, // simple ID generation
        name: newCategory,
        description: newDescription,
      };
      setCategories([...categories, newCategoryObj]);
      setNewCategory(""); // Clear input field
      setNewDescription(""); // Clear description field
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
  };

  const handleSaveEdit = () => {
    if (editingCategory?.name.trim() && editingCategory?.description.trim()) {
      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id
          ? { ...category, name: editingCategory.name, description: editingCategory.description }
          : category
      );
      setCategories(updatedCategories);
      setEditingCategory(null); // Clear editing state
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">Categories</h2>

      {/* Add Category Form */}
      <div className="mb-6 flex items-center space-x-3">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="p-2 border rounded-md w-80"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Category description"
          className="p-2 border rounded-md w-80"
        />
        <button
          onClick={handleAddCategory}
          className="p-2 bg-purple-600 text-white rounded-md flex items-center"
        >
          <PlusCircle className="mr-2" /> Add Category
        </button>
      </div>

      {/* Category Table */}
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
            <tr key={category.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{category.name}</td>
              <td className="p-3">{category.description}</td>
              <td className="p-3 flex justify-center space-x-3">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <Pencil />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-purple-600">Edit Category</h3>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  name: e.target.value,
                })
              }
              className="p-2 border rounded-md w-80"
            />
            <input
              type="text"
              value={editingCategory.description}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  description: e.target.value,
                })
              }
              className="p-2 border rounded-md w-80"
            />
            <button
              onClick={handleSaveEdit}
              className="p-2 bg-purple-600 text-white rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingCategory(null)}
              className="p-2 bg-gray-300 text-gray-900 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
