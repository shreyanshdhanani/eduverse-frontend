"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  GetSubcategoriesByCategoryService, 
  CreateSubcategoryService, 
  DeleteSubcategoryService, 
  UpdateSubcategoryService 
} from "@/app/service/subcategory-service";
import { GetCategoryByIdService } from "@/app/service/category-service";
import { 
  Pencil, 
  Trash2, 
  Save, 
  XCircle, 
  CircleArrowRight, 
  Plus, 
  FolderOpen, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

interface Category {
  _id: string;
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
  const [success, setSuccess] = useState<string | null>(null);
  
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [newSubcategoryDescription, setNewSubcategoryDescription] = useState<string>("");
  
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [originalSubcategoryData, setOriginalSubcategoryData] = useState<Subcategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const categoryId = params?.categoryId as string;

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const categoryData = await GetCategoryByIdService(categoryId);
      setCategory(categoryData as any);

      const subcategoryData = await GetSubcategoriesByCategoryService(categoryId);
      setSubcategories(Array.isArray(subcategoryData) ? subcategoryData : (subcategoryData as any)?.data || []);
    } catch (err) {
      setError("Failed to fetch category or subcategories.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !newSubcategoryDescription.trim()) {
      setError("Subcategory name and description are required.");
      return;
    }
    try {
      setError(null);
      const newSubcategory = await CreateSubcategoryService(categoryId, newSubcategoryName, newSubcategoryDescription);
      setSubcategories((prev) => [...prev, newSubcategory as any]);
      setNewSubcategoryName("");
      setNewSubcategoryDescription("");
      showSuccess("Subcategory added successfully!");
    } catch (err) {
      setError("Failed to add subcategory.");
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    setDeletingId(id);
    try {
      await DeleteSubcategoryService(id);
      setSubcategories((prev) => prev.filter((s) => s._id !== id));
      showSuccess("Subcategory deleted.");
    } catch (err) {
      setError("Failed to delete subcategory.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSubcategory = (id: string) => {
    setEditingSubcategoryId(id);
    const sub = subcategories.find((s) => s._id === id);
    if (sub) setOriginalSubcategoryData(sub);
  };

  const handleSaveEdit = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
      await UpdateSubcategoryService(id, updatedName, updatedDescription);
      const updated = await GetSubcategoriesByCategoryService(categoryId);
      setSubcategories(Array.isArray(updated) ? updated : (updated as any)?.data || []);
      setEditingSubcategoryId(null);
      setError(null);
      showSuccess("Subcategory updated!");
    } catch (err) {
      setError("Failed to update subcategory.");
    }
  };

  const handleCancelEdit = () => {
    if (originalSubcategoryData) {
      setSubcategories((prev) => prev.map((s) => s._id === originalSubcategoryData._id ? originalSubcategoryData : s));
    }
    setEditingSubcategoryId(null);
    setOriginalSubcategoryData(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/super-admin/categories')}
              className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors"
              title="Back to Categories"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FolderOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {category ? `${category.name}'s Subcategories` : 'Subcategories'}
              </h1>
              <p className="text-xs text-gray-400">{subcategories.length} subcategories available</p>
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

        {/* Add Subcategory Form */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add New Subcategory</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder="Subcategory name"
              className="flex-1 p-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory()}
            />
            <input
              type="text"
              value={newSubcategoryDescription}
              onChange={(e) => setNewSubcategoryDescription(e.target.value)}
              placeholder="Subcategory description"
              className="flex-1 p-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory()}
            />
            <button
              onClick={handleAddSubcategory}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap shadow-sm shadow-purple-200 active:scale-95"
            >
              <Plus size={16} /> Add Subcategory
            </button>
          </div>
        </div>
      </div>

      {/* Subcategories Table / Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-3 p-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : subcategories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No subcategories yet</p>
            <p className="text-sm mt-1">Use the form above to add your first subcategory.</p>
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
                  {subcategories.map((sub, idx) => (
                    <tr key={sub._id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-400 font-bold">{idx + 1}</td>
                      <td className="px-6 py-4">
                        {editingSubcategoryId === sub._id ? (
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => setSubcategories((prev) => prev.map((s) => s._id === sub._id ? { ...s, name: e.target.value } : s))}
                            className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="font-semibold text-gray-800 text-sm">{sub.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingSubcategoryId === sub._id ? (
                          <input
                            type="text"
                            value={sub.description}
                            onChange={(e) => setSubcategories((prev) => prev.map((s) => s._id === sub._id ? { ...s, description: e.target.value } : s))}
                            className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">{sub.description}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {editingSubcategoryId === sub._id ? (
                            <>
                              <button onClick={() => handleSaveEdit(sub._id, sub.name, sub.description)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Save"><Save size={16} /></button>
                              <button onClick={handleCancelEdit} className="p-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200 transition" title="Cancel"><XCircle size={16} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditSubcategory(sub._id)} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition" title="Edit"><Pencil size={16} /></button>
                              <button onClick={() => handleDeleteSubcategory(sub._id)} disabled={deletingId === sub._id} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition disabled:opacity-40" title="Delete"><Trash2 size={16} /></button>
                              <button onClick={() => router.push(`/super-admin/categories/${categoryId}/${sub._id}`)} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition" title="View Topics"><CircleArrowRight size={16} /></button>
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
              {subcategories.map((sub, idx) => (
                <div key={sub._id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      {editingSubcategoryId === sub._id ? (
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => setSubcategories((prev) => prev.map((s) => s._id === sub._id ? { ...s, name: e.target.value } : s))}
                          className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                        />
                      ) : (
                        <p className="font-bold text-gray-900 text-sm">{sub.name}</p>
                      )}
                      {editingSubcategoryId === sub._id ? (
                        <input
                          type="text"
                          value={sub.description}
                          onChange={(e) => setSubcategories((prev) => prev.map((s) => s._id === sub._id ? { ...s, description: e.target.value } : s))}
                          className="p-2 border border-purple-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{sub.description}</p>
                      )}
                    </div>
                    <span className="text-xs bg-purple-50 text-purple-500 font-bold px-2 py-0.5 rounded-lg flex-shrink-0">#{idx+1}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {editingSubcategoryId === sub._id ? (
                      <>
                        <button onClick={() => handleSaveEdit(sub._id, sub.name, sub.description)} className="flex-1 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><Save size={14} />Save</button>
                        <button onClick={handleCancelEdit} className="flex-1 py-2 bg-orange-50 text-orange-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><XCircle size={14} />Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditSubcategory(sub._id)} className="flex-1 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><Pencil size={14} />Edit</button>
                        <button onClick={() => handleDeleteSubcategory(sub._id)} disabled={deletingId === sub._id} className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40"><Trash2 size={14} />Delete</button>
                        <button onClick={() => router.push(`/super-admin/categories/${categoryId}/${sub._id}`)} className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><CircleArrowRight size={14} />Topics</button>
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
