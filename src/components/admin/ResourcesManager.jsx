import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  FolderOpen,
  Link as LinkIcon,
  FileText,
  Tag,
  Type,
} from "lucide-react";

const ResourcesManager = ({ resources, onCreate, onEdit, onDelete, isLoading, isSuperAdmin }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    title: "",
    link: "",
    category: "",
    type: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const categoryOptions = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Data Science",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Design",
    "Other",
  ];

  const typeOptions = [
    "Tutorial",
    "Documentation",
    "Tool",
    "Course",
    "Article",
    "Video",
    "Book",
    "Other",
  ];

  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const startEditing = (resource) => {
    setEditingId(resource.id);
    setIsCreating(true);
    setFormData({
      title: resource.title,
      link: resource.link,
      category: resource.category || "",
      type: resource.type || "",
      description: resource.description || "",
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await onEdit(editingId, formData);
    } else {
      await onCreate(formData);
    }
    handleCancel();
  };

  if (isCreating) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingId ? "Edit Resource" : "Add New Resource"}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
                placeholder="e.g., React Official Documentation"
                required
              />
            </div>

            {/* Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Link
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
                placeholder="https://..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Type className="w-4 h-4 inline mr-2" />
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
              >
                <option value="">Select Type</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none resize-none"
                placeholder="Brief description of the resource..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-sharda-blue text-white font-medium hover:bg-blue-600 transition-colors"
            >
              {editingId ? "Update Resource" : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isSuperAdmin ? "Manage all community resources" : "Manage your submitted resources"}
          </p>
        </div>
        <button
          onClick={startCreating}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-sharda-blue text-white rounded-xl font-semibold hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          <Plus size={20} />
          Add Resource
        </button>
      </div>

      {/* Resources List */}
      <div className="grid grid-cols-1 gap-4">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>
                  
                  {resource.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {resource.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {resource.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                        {resource.category}
                      </span>
                    )}
                    
                    {resource.type && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                        {resource.type}
                      </span>
                    )}
                  </div>

                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-sharda-blue hover:underline"
                  >
                    <LinkIcon size={14} />
                    Visit Resource
                  </a>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEditing(resource)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(resource.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No resources found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesManager;
