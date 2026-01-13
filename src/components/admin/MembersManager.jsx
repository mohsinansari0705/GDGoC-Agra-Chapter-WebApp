import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  User,
  Github,
  Linkedin,
  Twitter,
  Users,
  Award,
  Upload,
  Loader2,
  Mail,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const TEAM_OPTIONS = [
  "Lead Organizer",
  "Technical Team",
  "Events & Operations Team",
  "PR & Outreach Team",
  "Social Media & Content Team",
  "Design & Editing Team",
  "Disciplinary Committee",
];

const POSITION_OPTIONS = [
  { value: "lead", label: "Lead Organizer" },
  { value: "head", label: "Head" },
  { value: "co-head", label: "Co-Head" },
  { value: "executive", label: "Executive" },
];

const ImageUpload = ({ value, onChange, label, onFileSelect, preview }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    onFileSelect(null);
  };

  const displayImage = preview || value;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block">
          {label}
        </label>
      )}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
      >
        {displayImage ? (
          <div className="flex items-center gap-4">
            <img
              src={displayImage}
              alt="Preview"
              className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {preview ? "Image selected (will upload on save)" : "Image uploaded"}
              </p>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-500 hover:text-red-600 font-medium mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Drag & drop image here or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const MemberForm = ({ member, onSubmit, onCancel, isLoading, onFileSelect, profileImagePreview, profileImageFile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile_image_url: "",
    linkedin_url: "",
    github_url: "",
    x_url: "",
    bio: "",
    team_name: "Technical Team",
    position: "executive",
    display_order: 0,
    ...member,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Adjust position options based on team
  const availablePositions =
    formData.team_name === "Lead Organizer"
      ? POSITION_OPTIONS.filter((p) => p.value === "lead")
      : POSITION_OPTIONS.filter((p) => p.value !== "lead");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Bio (Optional)
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="Brief description about the member..."
          />
        </div>
      </div>

      {/* Team & Position */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" />
          Team & Position
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              Team <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.team_name}
              onChange={(e) => {
                handleChange("team_name", e.target.value);
                // Auto-set position if Lead Organizer
                if (e.target.value === "Lead Organizer") {
                  handleChange("position", "lead");
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              {TEAM_OPTIONS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              disabled={formData.team_name === "Lead Organizer"}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availablePositions.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              Display Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.display_order}
              onChange={(e) =>
                handleChange("display_order", parseInt(e.target.value) || 0)
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="0"
            />
            <p className="text-xs text-gray-400 mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>
      </div>

      {/* Profile Image */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-green-500" />
          Profile Image
        </h3>
        <ImageUpload
          value={formData.profile_image_url}
          onChange={(url) => handleChange("profile_image_url", url)}
          onFileSelect={onFileSelect}
          preview={profileImagePreview}
          label="Member Photo"
        />
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Social Links
        </h3>

        <div className="space-y-3">
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => handleChange("linkedin_url", e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="LinkedIn Profile URL"
            />
          </div>

          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 dark:text-gray-300" />
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => handleChange("github_url", e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              placeholder="GitHub Profile URL"
            />
          </div>

          <div className="relative">
            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white" />
            <input
              type="url"
              value={formData.x_url}
              onChange={(e) => handleChange("x_url", e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              placeholder="X (Twitter) Profile URL"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {member ? "Update Member" : "Add Member"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const MemberCard = ({ member, onEdit, onDelete, onToggleStatus }) => {
  const getPositionBadgeColor = (position) => {
    const colors = {
      lead: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      head: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "co-head":
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      executive:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return colors[position] || colors.executive;
  };

  const getPositionLabel = (position) => {
    const labels = {
      lead: "Lead Organizer",
      head: "Head",
      "co-head": "Co-Head",
      executive: "Executive",
    };
    return labels[position] || position;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all group">
      <div className="flex items-start gap-4">
        <img
          src={
            member.profile_image_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              member.name
            )}&size=200&background=4285F4&color=fff`
          }
          alt={member.name}
          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {member.email}
              </p>
            </div>
            <button
              onClick={() => onToggleStatus(member)}
              className={`p-2 rounded-lg transition-all ${
                member.is_active
                  ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title={member.is_active ? "Active" : "Inactive"}
            >
              {member.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getPositionBadgeColor(
                member.position
              )}`}
            >
              {getPositionLabel(member.position)}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {member.team_name}
            </span>
            {!member.is_active && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Inactive
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.github_url && (
              <a
                href={member.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.x_url && (
              <a
                href={member.x_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onEdit(member)}
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(member)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const MembersManager = ({ members, onCreate, onEdit, onDelete, isLoading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [filter, setFilter] = useState("all");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFileSelect = (file) => {
    if (file) {
      setProfileImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    } else {
      setProfileImageFile(null);
      setProfileImagePreview("");
    }
  };

  const uploadProfileImage = async (memberId) => {
    if (!profileImageFile) return null;

    try {
      const fileExt = profileImageFile.name.split(".").pop();
      const filePath = `${memberId}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("member-profiles")
        .upload(filePath, profileImageFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("member-profiles").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingMember) {
        // Update existing member
        let finalData = { ...formData };

        // Upload new image if selected
        if (profileImageFile) {
          const imageUrl = await uploadProfileImage(editingMember.id);
          if (imageUrl) {
            finalData.profile_image_url = imageUrl;
          }
        }

        await onEdit(editingMember.id, finalData);
      } else {
        // Create new member - first create without image
        const tempData = { ...formData };
        delete tempData.profile_image_url; // Remove image URL for now

        // Create member and get the ID
        const savedMember = await onCreate(tempData);

        // Upload image if provided
        if (profileImageFile && savedMember?.id) {
          const imageUrl = await uploadProfileImage(savedMember.id);
          if (imageUrl) {
            // Update member with image URL
            await onEdit(savedMember.id, { profile_image_url: imageUrl });
          }
        }
      }

      // Reset form state
      setShowForm(false);
      setEditingMember(null);
      setProfileImageFile(null);
      setProfileImagePreview("");
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Failed to save member: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
    setProfileImageFile(null);
    setProfileImagePreview("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
    setProfileImageFile(null);
    setProfileImagePreview("");
  };

  const handleToggleStatus = async (member) => {
    try {
      // Call toggle_member_status RPC function
      const { error } = await supabase.rpc('toggle_member_status', {
        p_member_id: member.id
      });
      
      if (error) {
        console.error('Error toggling member status:', error);
        alert('Failed to toggle member status: ' + error.message);
      }
      
      // Refresh the members list by calling parent's edit which triggers refreshAll
      await onEdit(member.id, { is_active: !member.is_active });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update member status');
    }
  };

  const filteredMembers = members.filter((m) => {
    if (filter === "all") return true;
    if (filter === "active") return m.is_active;
    if (filter === "inactive") return !m.is_active;
    return m.team_name === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Team Members
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your chapter's core team members
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingMember ? "Edit Member" : "Add New Member"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <MemberForm
            member={editingMember}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={saving}
            onFileSelect={handleFileSelect}
            profileImagePreview={profileImagePreview}
            profileImageFile={profileImageFile}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All ({members.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Active ({members.filter((m) => m.is_active).length})
        </button>
        {TEAM_OPTIONS.map((team) => (
          <button
            key={team}
            onClick={() => setFilter(team)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === team
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {team} ({members.filter((m) => m.team_name === team).length})
          </button>
        ))}
      </div>

      {/* Members Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            No Members Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === "all"
              ? "Start by adding your first team member"
              : `No members found in ${filter}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={handleEdit}
              onDelete={() => onDelete(member.id)}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersManager;
