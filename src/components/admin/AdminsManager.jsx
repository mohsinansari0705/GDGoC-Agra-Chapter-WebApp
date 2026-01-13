import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Shield,
  User,
  Mail,
  Users,
  Briefcase,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AdminsManager = ({ admins, onCreate, onEdit, onDelete, isLoading }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    admin_name: "",
    email: "",
    admin_type: "least_access_admin",
    team_name: "",
    admin_position: "",
    password: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const teamOptions = [
    "Technical Team",
    "Events & Operations Team",
    "PR & Outreach Team",
    "Social Media & Content Team",
    "Design & Editing Team",
    "Disciplinary Committee",
  ];

  const positionOptions = ["head", "co-head", "executive"];

  const adminTypeLabels = {
    super_admin: { label: "Super Admin", color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
    admin: { label: "Admin", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    least_access_admin: { label: "Content Admin", color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const startEditing = (admin) => {
    setEditingId(admin.id);
    setIsCreating(true);
    setFormData({
      admin_name: admin.admin_name,
      email: admin.email,
      admin_type: admin.admin_type,
      team_name: admin.team_name || "",
      admin_position: admin.admin_position || "",
      password: "", // Don't prefill password
      is_active: admin.is_active,
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
      // For edit, password is optional
      const dataToSend = { ...formData };
      delete dataToSend.password; // Password can't be updated this way in Supabase Auth
      await onEdit(editingId, dataToSend);
    } else {
      // For create, password is required
      if (!formData.password || formData.password.trim() === "") {
        alert("Password is required for new admins");
        return;
      }
      
      // Create uses RPC that handles auth.users creation
      await onCreate(formData);
    }
    handleCancel();
  };

  if (isCreating) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingId ? "Edit Admin" : "Create New Admin"}
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
            {/* Admin Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Admin Name
              </label>
              <input
                type="text"
                value={formData.admin_name}
                onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
                required
              />
            </div>

            {/* Admin Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Admin Type
              </label>
              <select
                value={formData.admin_type}
                onChange={(e) => setFormData({ ...formData, admin_type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
                required
              >
                <option value="least_access_admin">Content Admin (Blogs & Resources)</option>
                <option value="admin">Admin (Events, Gallery, Blogs, Resources)</option>
                <option value="super_admin">Super Admin (Full Access)</option>
              </select>
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Team Name
              </label>
              <select
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
              >
                <option value="">Select Team (Optional)</option>
                {teamOptions.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Position
              </label>
              <select
                value={formData.admin_position}
                onChange={(e) => setFormData({ ...formData, admin_position: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
              >
                <option value="">Select Position (Optional)</option>
                {positionOptions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password {editingId && <span className="text-xs text-gray-500">(leave empty to keep current)</span>}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none"
                placeholder="••••••••"
                required={!editingId}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-sharda-blue focus:ring-sharda-blue/20"
              />
              <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Admin
              </label>
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
              {editingId ? "Update Admin" : "Create Admin"}
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage admin users and their access levels
          </p>
        </div>
        <button
          onClick={startCreating}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-sharda-blue text-white rounded-xl font-semibold hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      {/* Admins List */}
      <div className="grid grid-cols-1 gap-4">
        {admins && admins.length > 0 ? (
          admins.map((admin) => {
            const typeInfo = adminTypeLabels[admin.admin_type] || adminTypeLabels.least_access_admin;
            
            return (
              <div
                key={admin.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sharda-blue to-sharda-red flex items-center justify-center text-white font-bold">
                        {admin.admin_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {admin.admin_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      
                      {admin.team_name && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {admin.team_name}
                        </span>
                      )}
                      
                      {admin.admin_position && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                          {admin.admin_position.charAt(0).toUpperCase() + admin.admin_position.slice(1)}
                        </span>
                      )}

                      {admin.is_active ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center gap-1">
                          <CheckCircle size={12} />
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center gap-1">
                          <XCircle size={12} />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(admin)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(admin.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No admins found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminsManager;
