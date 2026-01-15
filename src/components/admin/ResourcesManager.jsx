import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAdmin } from '../../context/AdminContext';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiX,
  FiEye,
  FiStar,
  FiHeart,
  FiExternalLink
} from 'react-icons/fi';

export default function ResourcesManager() {
  const { admin } = useAdmin();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    link: '',
    category: 'Tutorial',
    type: 'Free',
    tags: '',
    thumbnail_url: '',
    is_featured: false,
    is_active: true
  });

  const categories = [
    'Tutorial', 'Documentation', 'Tool', 'Article',
    'Video', 'Course', 'Book', 'Template', 'Other'
  ];

  const types = ['Free', 'Paid', 'Freemium'];

  useEffect(() => {
    fetchResources();
  }, []);

  // Debug: Log admin state
  useEffect(() => {
    console.log('Admin state in ResourcesManager:', admin);
    console.log('Admin ID:', admin?.admin_id);
  }, [admin]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (newTitle) => {
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: editingResource ? prev.slug : generateSlug(newTitle)
    }));
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      alert('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setThumbnailFile(file);
    setThumbnailPreview(previewUrl);
  };

  const uploadThumbnail = async (resourceId) => {
    if (!thumbnailFile) return null;

    try {
      const fileExt = thumbnailFile.name.split('.').pop();
      const filePath = `${resourceId}/thumbnail.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resource-thumbnails')
        .upload(filePath, thumbnailFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('resource-thumbnails')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.link || !formData.slug) {
      alert('Please fill in all required fields');
      return;
    }

    if (!admin || !admin.admin_id) {
      alert('Admin session not found. Please login again.');
      return;
    }

    try {
      setUploading(true);
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      let thumbnailUrl = formData.thumbnail_url;

      if (editingResource) {
        // Update existing resource
        // Upload new thumbnail if file selected
        if (thumbnailFile) {
          thumbnailUrl = await uploadThumbnail(editingResource.id);
        }

        const resourceData = {
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          link: formData.link,
          category: formData.category,
          type: formData.type,
          tags: tagsArray,
          thumbnail_url: thumbnailUrl,
          is_featured: formData.is_featured,
          is_active: formData.is_active
        };

        const { error } = await supabase
          .from('resources')
          .update(resourceData)
          .eq('id', editingResource.id);

        if (error) throw error;
        alert('Resource updated successfully!');
      } else {
        // Create new resource first
        const resourceData = {
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          link: formData.link,
          category: formData.category,
          type: formData.type,
          tags: tagsArray,
          thumbnail_url: '', // Will update after upload
          is_featured: formData.is_featured,
          is_active: formData.is_active,
          created_by: admin.admin_id
        };

        const { data: newResource, error } = await supabase
          .from('resources')
          .insert([resourceData])
          .select()
          .single();

        if (error) throw error;

        // Upload thumbnail if file selected
        if (thumbnailFile && newResource) {
          thumbnailUrl = await uploadThumbnail(newResource.id);

          // Update resource with thumbnail URL
          const { error: updateError } = await supabase
            .from('resources')
            .update({ thumbnail_url: thumbnailUrl })
            .eq('id', newResource.id);

          if (updateError) throw updateError;
        }

        alert('Resource created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert(`Failed to save resource: ${error.message || error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      slug: resource.slug,
      description: resource.description,
      link: resource.link,
      category: resource.category,
      type: resource.type,
      tags: resource.tags ? resource.tags.join(', ') : '',
      thumbnail_url: resource.thumbnail_url || '',
      is_featured: resource.is_featured,
      is_active: resource.is_active
    });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Resource deleted successfully!');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchResources();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchResources();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Failed to update featured status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      link: '',
      category: 'Tutorial',
      type: 'Free',
      tags: '',
      thumbnail_url: '',
      is_featured: false,
      is_active: true
    });
    setEditingResource(null);
    setThumbnailFile(null);
    setThumbnailPreview('');
    // Revoke object URL if exists
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Tutorial: 'bg-blue-100 text-blue-700',
      Documentation: 'bg-green-100 text-green-700',
      Tool: 'bg-purple-100 text-purple-700',
      Article: 'bg-yellow-100 text-yellow-700',
      Video: 'bg-red-100 text-red-700',
      Course: 'bg-indigo-100 text-indigo-700',
      Book: 'bg-pink-100 text-pink-700',
      Template: 'bg-teal-100 text-teal-700',
      Other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Resources Manager</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage learning resources for the community</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus /> Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Total Resources</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{resources.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-green-600 dark:text-green-400 text-sm font-semibold">Active</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {resources.filter(r => r.is_active).length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">Featured</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {resources.filter(r => r.is_featured).length}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold">Total Likes</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {resources.reduce((sum, r) => sum + (r.likes_count || 0), 0)}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No resources yet</p>
          <p className="text-gray-400">Click "Add Resource" to create your first resource</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 overflow-hidden">
                          {resource.thumbnail_url ? (
                            <img
                              src={resource.thumbnail_url}
                              alt={resource.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                              {resource.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{resource.title}</p>
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            View Link <FiExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">{resource.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <FiHeart className="w-4 h-4" /> {resource.likes_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiEye className="w-4 h-4" /> {resource.views_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => toggleStatus(resource.id, resource.is_active)}
                          className={`text-xs px-2 py-1 rounded-full ${resource.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {resource.is_active ? 'Active' : 'Inactive'}
                        </button>
                        {resource.is_featured && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeatured(resource.id, resource.is_featured)}
                          className={`p-2 rounded hover:bg-gray-100 ${resource.is_featured ? 'text-yellow-500' : 'text-gray-400'
                            }`}
                        >
                          <FiStar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(resource)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="auto-generated-from-title"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">URL-friendly version of the title (auto-generated, but you can edit)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link *</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {types.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="react, javascript, tutorial"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail Image</label>
                {(thumbnailPreview || formData.thumbnail_url) && (
                  <div className="relative mb-2">
                    <img
                      src={thumbnailPreview || formData.thumbnail_url}
                      alt="Thumbnail"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {thumbnailPreview && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        New Image Selected
                      </span>
                    )}
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-700/50">
                  <FiUpload className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">{thumbnailFile ? thumbnailFile.name : 'Select Thumbnail Image'}</span>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
                {thumbnailPreview && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Image will be uploaded when you submit the form</p>
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700" />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700" />
                  <span className="text-sm">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Saving...' : editingResource ? 'Update Resource' : 'Add Resource'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
