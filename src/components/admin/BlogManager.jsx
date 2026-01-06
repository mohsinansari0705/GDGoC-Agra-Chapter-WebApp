import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, FileText, User, Calendar, Clock, Image as ImageIcon } from "lucide-react";

const BlogManager = ({ posts, onCreate, onEdit, onDelete, isLoading }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    title: "",
    status: "draft",
    category: "Web Development",
    author: "",
    date: "",
    read_time: "",
    image_url: "",
    excerpt: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editValues, setEditValues] = useState({});

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await onCreate(formData);
    setFormData(initialFormState);
    setIsCreating(false);
  };

  const startEditing = (post) => {
    setEditingId(post.id);
    setEditValues({ ...post });
  };

  const saveEditing = async () => {
    await onEdit(editingId, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-8">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog Posts</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your community articles and announcements.</p>
        </div>
        <button
          onClick={() => { setIsCreating(!isCreating); if(isCreating) setFormData(initialFormState); }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all font-semibold"
        >
          {isCreating ? <X size={20} /> : <Plus size={20} />}
          {isCreating ? "Cancel" : "New Post"}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-1 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-700/50 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600"><FileText size={20} /></div>
                 Draft New Article
              </h3>
              
              <form onSubmit={handleCreateSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Article Title</label>
                        <input
                            required
                            placeholder="Enter a catchy title..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all font-bold text-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Status</label>
                        <div className="relative">
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:border-yellow-500 appearance-none font-medium"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
                        <input
                            placeholder="e.g. Web Development"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Author Name</label>
                        <input
                            placeholder="e.g. Jane Doe"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div>
                         <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Publish Date</label>
                         <input
                            placeholder="e.g. Apr 23, 2025"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                         <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Cover Image URL</label>
                         <input
                            placeholder="https://"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                         <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Short Excerpt</label>
                         <textarea
                            placeholder="Brief summary of the post..."
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:border-yellow-500 min-h-[100px]"
                        />
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:shadow-yellow-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all font-bold"
                    >
                        {isLoading ? "Publishing..." : "Publish Post"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
             <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-gray-300" />
             </div>
             <p className="text-gray-500 font-medium">No blog posts found.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300"
            >
              {editingId === post.id ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-900 dark:text-white">Quick Edit</h4>
                        <button onClick={cancelEditing} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} /></button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            value={editValues.title}
                            onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 outline-none font-bold"
                            placeholder="Title"
                        />
                        <textarea
                            value={editValues.excerpt}
                            onChange={(e) => setEditValues({ ...editValues, excerpt: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 outline-none h-24"
                            placeholder="Excerpt"
                        />
                         <div className="flex justify-end gap-3">
                            <button
                            onClick={saveEditing}
                            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold"
                            >
                            Save Changes
                            </button>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="w-full md:w-48 h-32 rounded-2xl bg-gray-100 dark:bg-gray-900 overflow-hidden shrink-0 relative">
                        {post.image_url ? (
                            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24} /></div>
                        )}
                   </div>
                   
                   <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {post.status}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{post.category}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-google-blue transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                          {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                          {post.author && <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>}
                          {post.date && <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>}
                          {post.read_time && <span className="flex items-center gap-1.5"><Clock size={14} /> {post.read_time}</span>}
                      </div>
                   </div>

                   <div className="flex flex-row md:flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 justify-center">
                    <button
                      onClick={() => startEditing(post)}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                      title="Edit Post"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      title="Delete Post"
                    >
                      <Trash2 size={18} />
                    </button>
                   </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManager;
