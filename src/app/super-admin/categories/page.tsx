"use client"
import { useEffect, useState } from "react";
import { Pencil, Trash2, Save, XCircle, CircleArrowRight, Plus, FolderOpen, AlertCircle, CheckCircle2 } from "lucide-react";
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
  const [originalCategoryData, setOriginalCategoryData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await GetAllCategoryService();
      setCategories(Array.isArray(data) ? data : (data as any)?.data || []);
    } catch (err) {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !newDescription.trim()) {
      setError("Category name and description are required.");
      return;
    }
    try {
      setError(null);
      const newCategoryObj = await CreateCategoryService(newCategory, newDescription);
      setCategories((prev) => [...prev, newCategoryObj as any]);
      setNewCategory("");
      setNewDescription("");
      showSuccess("Category added successfully!");
    } catch (err) {
      setError("Failed to add category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setDeletingId(id);
    try {
      await DeleteCategoryService(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      showSuccess("Category deleted.");
    } catch (err) {
      setError("Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditCategory = (id: string) => {
    setEditingCategoryId(id);
    const cat = categories.find((c) => c._id === id);
    if (cat) setOriginalCategoryData(cat);
  };

  const handleSaveEdit = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
      await UpdateCategoryService(id, updatedName, updatedDescription);
      const updated = await GetAllCategoryService();
      setCategories(Array.isArray(updated) ? updated : (updated as any)?.data || []);
      setEditingCategoryId(null);
      setError(null);
      showSuccess("Category updated!");
    } catch (err) {
      setError("Failed to update category.");
    }
  };

  const handleCancelEdit = () => {
    if (originalCategoryData) {
      setCategories((prev) => prev.map((c) => c._id === originalCategoryData._id ? originalCategoryData : c));
    }
    setEditingCategoryId(null);
    setOriginalCategoryData(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FolderOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Categories</h1>
              <p className="text-xs text-gray-400">{categories.length} total categories</p>
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

        {/* Add Category Form */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add New Category</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="flex-1 p-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Category description"
              className="flex-1 p-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap shadow-sm shadow-purple-200 active:scale-95"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table / Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-3 p-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No categories yet</p>
            <p className="text-sm mt-1">Use the form above to add your first category.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, idx) => (
                    <tr key={category._id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-400 font-bold">{idx + 1}</td>
                      <td className="px-6 py-4">
                        {editingCategoryId === category._id ? (
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => setCategories((prev) => prev.map((c) => c._id === category._id ? { ...c, name: e.target.value } : c))}
                            className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="font-semibold text-gray-800 text-sm">{category.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingCategoryId === category._id ? (
                          <input
                            type="text"
                            value={category.description}
                            onChange={(e) => setCategories((prev) => prev.map((c) => c._id === category._id ? { ...c, description: e.target.value } : c))}
                            className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">{category.description}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {editingCategoryId === category._id ? (
                            <>
                              <button onClick={() => handleSaveEdit(category._id, category.name, category.description)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Save"><Save size={16} /></button>
                              <button onClick={handleCancelEdit} className="p-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200 transition" title="Cancel"><XCircle size={16} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditCategory(category._id)} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition" title="Edit"><Pencil size={16} /></button>
                              <button onClick={() => handleDeleteCategory(category._id)} disabled={deletingId === category._id} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition disabled:opacity-40" title="Delete"><Trash2 size={16} /></button>
                              <button onClick={() => router.push(`/super-admin/categories/${category._id}`)} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition" title="View Subcategories"><CircleArrowRight size={16} /></button>
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
              {categories.map((category, idx) => (
                <div key={category._id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      {editingCategoryId === category._id ? (
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => setCategories((prev) => prev.map((c) => c._id === category._id ? { ...c, name: e.target.value } : c))}
                          className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                        />
                      ) : (
                        <p className="font-bold text-gray-900 text-sm">{category.name}</p>
                      )}
                      {editingCategoryId === category._id ? (
                        <input
                          type="text"
                          value={category.description}
                          onChange={(e) => setCategories((prev) => prev.map((c) => c._id === category._id ? { ...c, description: e.target.value } : c))}
                          className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{category.description}</p>
                      )}
                    </div>
                    <span className="text-xs bg-purple-50 text-purple-500 font-bold px-2 py-0.5 rounded-lg flex-shrink-0">#{idx+1}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {editingCategoryId === category._id ? (
                      <>
                        <button onClick={() => handleSaveEdit(category._id, category.name, category.description)} className="flex-1 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><Save size={14} />Save</button>
                        <button onClick={handleCancelEdit} className="flex-1 py-2 bg-orange-50 text-orange-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><XCircle size={14} />Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditCategory(category._id)} className="flex-1 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><Pencil size={14} />Edit</button>
                        <button onClick={() => handleDeleteCategory(category._id)} disabled={deletingId === category._id} className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40"><Trash2 size={14} />Delete</button>
                        <button onClick={() => router.push(`/super-admin/categories/${category._id}`)} className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><CircleArrowRight size={14} />Sub.</button>
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
