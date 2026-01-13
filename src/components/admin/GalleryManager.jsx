import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Image, Calendar, Tag, Upload } from "lucide-react";

const GalleryManager = ({ galleryItems, onCreate, onEdit, onDelete, isLoading }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    category: "Hackathon",
    date: "",
    status: "Completed",
  });

  const [editValues, setEditValues] = useState({});

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await onCreate(formData);
    setFormData({
      title: "",
      image_url: "",
      category: "Hackathon",
      date: "",
      status: "Completed",
    });
    setIsCreating(false);
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditValues({ ...item });
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
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-8">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gallery Management</h2>
            <p className="text-gray-500 dark:text-gray-400">Curate visuals from your community events.</p>
        </div>
        <button
          onClick={() => { setIsCreating(!isCreating); }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all font-semibold"
        >
          {isCreating ? <X size={20} /> : <Plus size={20} />}
          {isCreating ? "Cancel" : "Add Image"}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-1 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-700/50 animate-in fade-in slide-in-from-bottom-8 duration-500 mb-8">
           <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-10">
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><Upload size={20} /></div>
                 Upload New Moment
              </h3>
              
              <form onSubmit={handleCreateSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Image Title</label>
                        <input
                            required
                            placeholder="e.g. Winners of Hackathon 2025"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-lg"
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Image URL</label>
                        <div className="flex gap-4">
                           <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                               {formData.image_url ? <img src={formData.image_url} alt="" className="w-full h-full object-cover" /> : <Image className="text-gray-300" />}
                           </div>
                           <input
                                required
                                placeholder="https://"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
                        <div className="relative">
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-green-500 appearance-none font-medium"
                            >
                                <option value="Hackathon">Hackathon</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Meetup">Meetup</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                        </div>
                    </div>

                     <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Date</label>
                        <input
                            placeholder="e.g. Jan 2025"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-green-500"
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
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all font-bold"
                    >
                        {isLoading ? "Uploading..." : "Add to Gallery"}
                    </button>
                 </div>
              </form>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {galleryItems.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
             <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image size={32} className="text-gray-300" />
             </div>
             <p className="text-gray-500 font-medium">Gallery is empty.</p>
          </div>
        ) : (
             galleryItems.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {editingId === item.id ? (
                <div className="p-4 space-y-4">
                    <input
                        value={editValues.title}
                        onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 outline-none font-bold"
                    />
                    <input
                        value={editValues.image_url}
                        onChange={(e) => setEditValues({ ...editValues, image_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 outline-none text-xs"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={saveEditing} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Save size={18} /></button>
                        <button onClick={cancelEditing} className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100"><X size={18} /></button>
                    </div>
                </div>
                ) : (
                <>
                    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                         {item.image_url ? (
                            <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Image size={32} />
                            </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                            <button
                                onClick={() => startEditing(item)}
                                className="p-3 bg-white/20 text-white rounded-xl hover:bg-white hover:text-gray-900 backdrop-blur-md transition-all transform hover:scale-110"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="p-3 bg-white/20 text-white rounded-xl hover:bg-red-500 hover:text-white backdrop-blur-md transition-all transform hover:scale-110"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        
                        {/* Date Badge */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                            {item.date || "No Date"}
                        </div>
                    </div>
                    
                    <div className="p-5">
                         <div className="flex items-center gap-2 mb-2">
                             <Tag size={12} className="text-gray-400" />
                             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.category}</span>
                         </div>
                        <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg group-hover:text-sharda-blue transition-colors">{item.title}</h3>
                    </div>
                </>
                )}
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
