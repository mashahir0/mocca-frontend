import React, { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api/adminApi";

export default function CategoryManagement() {
  const [newCategory, setNewCategory] = useState({
    category: "",
    offer: "",
    description: "",
    status: true,
    visibility: true,
  });

  const [editingCategory, setEditingCategory] = useState(null);

  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("get-category");
      return response.data;
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (newCategory) => api.post("/add-category", newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategory({ category: "", offer: "", description: "" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId) => api.delete(`/delete-categories/${categoryId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (updatedCategory) =>
      api.patch(`/update-categories/${updatedCategory._id}`, updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
    },
  });

  const handleDelete = (id) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({
        ...editingCategory,
        category: newCategory.category.trim(),
        offer: parseInt(newCategory.offer),
        description: newCategory.description,
        visibility: newCategory.visibility,
        status: newCategory.status,
      });
    } else {
      createCategoryMutation.mutate({
        category: newCategory.category.trim(),
        offer: parseInt(newCategory.offer),
        description: newCategory.description,
        visibility: true,
        status: true,
      });
    }
  };

  const handleToggleField = (categoryId, field) => {
    const updatedCategory = categories.find(
      (category) => category._id === categoryId
    );
    const updatedData = {
      ...updatedCategory,
      [field]: !updatedCategory[field],
    };
    updateCategoryMutation.mutate(updatedData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Category Management Table */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-medium">Category Management</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Offers %
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id} className="border-b last:border-b-0">
                    <td className="px-6 py-4">{category.category}</td>
                    <td className="px-6 py-4">{category.description}</td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={category.visibility}
                          onClick={() =>
                            handleToggleField(category._id, "visibility")
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 ${
                            category.visibility ? "bg-green-500" : "bg-gray-300"
                          } rounded-full transition-colors`}
                        >
                          <span
                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                              category.visibility ? "translate-x-5" : ""
                            }`}
                          />
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4">{category.offer}</td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={category.status}
                          onClick={() =>
                            handleToggleField(category._id, "status")
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 ${
                            category.status ? "bg-green-500" : "bg-gray-300"
                          } rounded-full transition-colors`}
                        >
                          <span
                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                              category.status ? "translate-x-5" : ""
                            }`}
                          />
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No categories available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Category Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-6 text-center">
          {editingCategory ? "Edit" : "Add"} Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Category"
            value={newCategory.category}
            onChange={(e) =>
              setNewCategory({ ...newCategory, category: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <input
            type="number"
            placeholder="Offer"
            value={newCategory.offer}
            onChange={(e) =>
              setNewCategory({ ...newCategory, offer: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
          >
            {editingCategory ? "Update" : "Add"} Category
          </button>
        </form>
      </div>
    </div>
  );
}
