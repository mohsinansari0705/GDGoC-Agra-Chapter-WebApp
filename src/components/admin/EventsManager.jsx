import React, { useState } from "react";
import {
  Plus,
  Calendar,
  Edit2,
  Trash2,
  X,
  Clock,
  Target,
  Award,
  MapPin,
  Users,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const EventsManager = ({ events, onSave, onDelete, isLoading }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const initialFormState = {
    title: "",
    category: "hackathon",
    status: "draft",
    description: "",
    date: "",
    end_date: "",
    time: "",
    location: "",
    cover_image_url: "",
    banner_image_url: "",
    registration_link: "",
    color: "",
    featured: false,
    tags: [],
    timeline: [],
    themes: [],
    prizes: [],
  };

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [bannerImagePreview, setBannerImagePreview] = useState("");

  const [formData, setFormData] = useState(initialFormState);

  // Handle file selection (don't upload yet)
  const handleFileSelect = (file, type = 'cover') => {
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    if (type === 'cover') {
      setCoverImageFile(file);
      setCoverImagePreview(previewUrl);
    } else {
      setBannerImageFile(file);
      setBannerImagePreview(previewUrl);
    }
  };

  // Upload images to storage with event ID folder structure
  const uploadEventImages = async (eventId) => {
    const urls = {
      cover_image_url: formData.cover_image_url,
      banner_image_url: formData.banner_image_url
    };

    try {
      // Upload cover image if file selected
      if (coverImageFile) {
        setUploadingCover(true);
        const fileExt = coverImageFile.name.split('.').pop();
        const filePath = `${eventId}/cover.${fileExt}`;

        // Delete old cover image if exists
        await supabase.storage
          .from('event-images')
          .remove([filePath]);

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, coverImageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        urls.cover_image_url = publicUrl;
      }

      // Upload banner image if file selected
      if (bannerImageFile) {
        setUploadingBanner(true);
        const fileExt = bannerImageFile.name.split('.').pop();
        const filePath = `${eventId}/banner.${fileExt}`;

        // Delete old banner image if exists
        await supabase.storage
          .from('event-images')
          .remove([filePath]);

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, bannerImageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        urls.banner_image_url = publicUrl;
      }

      return urls;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploadingCover(false);
      setUploadingBanner(false);
    }
  };

  const startEditing = async (event) => {
    setEditingId(event.id);
    setIsCreating(true);
    setFormData({
      ...initialFormState,
      ...event,
      timeline: [],
      themes: [],
      prizes: [],
    });
    setLoadingDetails(true);

    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      const [timelineRes, themesRes, prizesRes] = await Promise.all([
        supabase
          .from("event_timeline_items")
          .select("*")
          .eq("event_id", event.id)
          .order("order_index", { ascending: true }),
        supabase
          .from("event_themes")
          .select("theme")
          .eq("event_id", event.id)
          .order("order_index", { ascending: true }),
        supabase.from("event_prizes").select("*").eq("event_id", event.id),
      ]);

      setFormData((prev) => ({
        ...prev,
        timeline: timelineRes.data || [],
        themes: themesRes.data ? themesRes.data.map((t) => t.theme) : [],
        prizes: prizesRes.data || [],
      }));
    } catch (err) {
      console.error("Failed to load details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First save event to get event ID
      const savedEvent = await onSave(formData, Boolean(editingId), editingId);
      
      // If we have files to upload and got an event ID back
      if ((coverImageFile || bannerImageFile) && savedEvent?.id) {
        const imageUrls = await uploadEventImages(savedEvent.id);
        
        // Update event with image URLs
        await onSave(
          { ...formData, ...imageUrls },
          true,
          savedEvent.id
        );
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Failed to save event: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCoverImageFile(null);
    setBannerImageFile(null);
    setCoverImagePreview("");
    setBannerImagePreview("");
    setIsCreating(false);
    setEditingId(null);
  };

  // --- Timeline Helpers ---
  const addTimelineItem = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { title: "", date: "", time: "", description: "", label: "PENDING" },
      ],
    }));
  };

  const removeTimelineItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const updateTimelineItem = (index, field, value) => {
    setFormData((prev) => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      return { ...prev, timeline: newTimeline };
    });
  };

  // --- Theme Helpers ---
  const addTheme = () => {
    setFormData((prev) => ({ ...prev, themes: [...prev.themes, ""] }));
  };

  const removeTheme = (index) => {
    setFormData((prev) => ({
      ...prev,
      themes: prev.themes.filter((_, i) => i !== index),
    }));
  };

  const updateTheme = (index, value) => {
    setFormData((prev) => {
      const newThemes = [...prev.themes];
      newThemes[index] = value;
      return { ...prev, themes: newThemes };
    });
  };

  // --- Prize Helpers ---
  const addPrize = () => {
    setFormData((prev) => ({
      ...prev,
      prizes: [...prev.prizes, { position: "", amount: "", description: "" }],
    }));
  };

  const removePrize = (index) => {
    setFormData((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));
  };

  const updatePrize = (index, field, value) => {
    setFormData((prev) => {
      const newPrizes = [...prev.prizes];
      newPrizes[index] = { ...newPrizes[index], [field]: value };
      return { ...prev, prizes: newPrizes };
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Event Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Organize hackathons, workshops, and community meetups.
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              setFormData(initialFormState);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all font-semibold"
          >
            <Plus size={20} /> Create Event
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-1 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-700/50 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {editingId ? (
                    <Edit2 className="text-sharda-blue" size={28} />
                  ) : (
                    <Calendar className="text-sharda-blue" size={28} />
                  )}
                  {editingId ? "Edit Event Details" : "Create New Event"}
                </h3>
                <p className="text-gray-500 mt-1">
                  Fill in the details to publish your event.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Event Title
                    </label>
                    <input
                      required
                      placeholder="e.g. Google Cloud Study Jam 2026"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-sharda-blue/10 focus:border-sharda-blue transition-all font-medium text-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue appearance-none font-medium"
                      >
                        <option value="hackathon">Hackathon</option>
                        <option value="workshop">Workshop</option>
                        <option value="competition">Competition</option>
                        <option value="meetup">Meetup</option>
                        <option value="conference">Conference</option>
                        <option value="webinar">Webinar</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue appearance-none font-medium"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jan 30, 2026"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      End Date (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Feb 01, 2026"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time
                    </label>
                    <input
                      placeholder="e.g. 9:00 AM Onwards"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Venue
                    </label>
                    <input
                      placeholder="e.g. Main Auditorium"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Theme Color
                    </label>
                    <input
                      placeholder="e.g. from-blue-500 to-cyan-500"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI, Machine Learning, Cloud"
                      value={Array.isArray(formData.tags) ? formData.tags.join(", ") : (typeof formData.tags === 'string' ? formData.tags : "")}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        // Store the raw string value so commas can be typed
                        setFormData({ ...formData, tags: rawValue });
                      }}
                      onBlur={(e) => {
                        // Convert to array on blur
                        const tagsArray = e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag);
                        setFormData({ ...formData, tags: tagsArray });
                      }}
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-gray-300 text-sharda-blue focus:ring-sharda-blue focus:ring-offset-0"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                          Featured Event
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Mark this event as featured to highlight it on the homepage
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Cover Image (Square/Portrait - for cards)
                    </label>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                        {(coverImagePreview || formData.cover_image_url) ? (
                          <img
                            src={coverImagePreview || formData.cover_image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'cover')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm outline-none focus:border-sharda-blue file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sharda-blue file:text-white file:cursor-pointer hover:file:bg-blue-600"
                        />
                        <input
                          type="url"
                          placeholder="Or paste image URL"
                          value={formData.cover_image_url}
                          onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm outline-none focus:border-sharda-blue"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Upload file or paste URL. Images will be saved when you create the event.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Banner Image (Wide - for event detail page)
                    </label>
                    <div className="flex gap-4">
                      <div className="w-32 h-18 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                        {(bannerImagePreview || formData.banner_image_url) ? (
                          <img
                            src={bannerImagePreview || formData.banner_image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'banner')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm outline-none focus:border-sharda-blue file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sharda-blue file:text-white file:cursor-pointer hover:file:bg-blue-600"
                        />
                        <input
                          type="url"
                          placeholder="Or paste image URL"
                          value={formData.banner_image_url}
                          onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm outline-none focus:border-sharda-blue"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Upload file or paste URL. Images will be saved when you create the event.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Registration Link
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="https://"
                        value={formData.registration_link}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registration_link: e.target.value,
                          })
                        }
                        className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue"
                      />
                      {formData.registration_link && (
                        <a
                          href={formData.registration_link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-sharda-blue hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Open
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Event Description
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      💡 Tip: Press Enter for new paragraphs. Line breaks will be preserved in the display.
                    </p>
                    <textarea
                      required
                      placeholder="Enter a detailed description...\n\nUse Enter for new paragraphs.\nLine breaks will be preserved."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:border-sharda-blue min-h-[200px] resize-y font-mono text-sm leading-relaxed"
                      style={{ whiteSpace: 'pre-wrap' }}
                    />
                  </div>
                </div>
              </div>

              {loadingDetails && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="w-8 h-8 border-4 border-sharda-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>Fetching event details...</p>
                </div>
              )}

              {!loadingDetails && (
                <>
                  {/* Timeline */}
                  <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-sharda-blue">
                          <Clock size={20} />
                        </span>
                        Event Timeline
                      </h4>
                      <button
                        type="button"
                        onClick={addTimelineItem}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        + Add Item
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.timeline.map((item, index) => (
                        <div
                          key={index}
                          className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Time Slot {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTimelineItem(index)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-5">
                              <input
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) =>
                                  updateTimelineItem(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-sharda-blue/20 outline-none text-sm font-medium"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <input
                                type="date"
                                value={item.date}
                                onChange={(e) =>
                                  updateTimelineItem(
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none text-sm"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <input
                                type="time"
                                value={item.time}
                                onChange={(e) =>
                                  updateTimelineItem(
                                    index,
                                    "time",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none text-sm"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <select
                                value={item.label || "PENDING"}
                                onChange={(e) =>
                                  updateTimelineItem(
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none text-xs font-bold uppercase"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETE">Complete</option>
                                <option value="LIVE">Live</option>
                              </select>
                            </div>
                            <div className="md:col-span-12">
                              <textarea
                                placeholder="Description..."
                                value={item.description}
                                onChange={(e) =>
                                  updateTimelineItem(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-sharda-blue/20 outline-none text-sm"
                                rows={1}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.timeline.length === 0 && (
                        <p className="text-center text-gray-400 py-4 italic">
                          No timeline items added yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Themes */}
                  <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600">
                          <Target size={20} />
                        </span>
                        Problem Statements
                      </h4>
                      <button
                        type="button"
                        onClick={addTheme}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        + Add Theme
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.themes.map((theme, index) => (
                        <div key={index} className="flex gap-2 group">
                          <input
                            placeholder="Enter theme title..."
                            value={theme}
                            onChange={(e) => updateTheme(index, e.target.value)}
                            className="flex-1 px-5 py-3 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm outline-none focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeTheme(index)}
                            className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors opacity-50 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      {formData.themes.length === 0 && (
                        <p className="col-span-2 text-center text-gray-400 py-4 italic">
                          No themes defined.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Prizes */}
                  <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-yellow-600">
                          <Award size={20} />
                        </span>
                        Prizes & Rewards
                      </h4>
                      <button
                        type="button"
                        onClick={addPrize}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        + Add Prize
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.prizes.map((prize, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm group"
                        >
                          <input
                            placeholder="Rank (e.g. 1st Place)"
                            value={prize.position}
                            onChange={(e) =>
                              updatePrize(index, "position", e.target.value)
                            }
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 outline-none text-sm font-bold text-gray-700 dark:text-gray-200"
                          />
                          <input
                            placeholder="Amount (e.g. ₹50,000)"
                            value={prize.amount}
                            onChange={(e) =>
                              updatePrize(index, "amount", e.target.value)
                            }
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 outline-none text-sm font-bold text-green-600"
                          />
                          <input
                            placeholder="Description..."
                            value={prize.description}
                            onChange={(e) =>
                              updatePrize(index, "description", e.target.value)
                            }
                            className="flex-[2] px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-900 outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removePrize(index)}
                            className="p-2.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      {formData.prizes.length === 0 && (
                        <p className="text-center text-gray-400 py-4 italic">
                          No prizes configured.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-semibold transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-sharda-blue to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2 font-bold"
                >
                  {isLoading
                    ? "Saving..."
                    : editingId
                    ? "Update Event"
                    : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      {!isCreating && (
        <div className="grid grid-cols-1 gap-6">
          {events.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first event.
              </p>
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingId(null);
                  setFormData(initialFormState);
                }}
                className="px-6 py-2 bg-sharda-blue text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Create Event
              </button>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-8 group hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300"
              >
                <div className="w-full md:w-48 h-32 md:h-auto rounded-2xl bg-gray-100 dark:bg-gray-900 overflow-hidden shrink-0 relative">
                  {event.cover_image_url ? (
                    <img
                      src={event.cover_image_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                    {event.date || "TBA"}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        event.status === "upcoming"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : event.status === "ongoing"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-200"
                      }`}
                    >
                      {event.status === "upcoming" && <CheckCircle size={10} />}
                      {event.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-sharda-blue transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} /> {event.time}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} /> {event.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 justify-start md:justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-8">
                  <button
                    onClick={() => startEditing(event)}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white rounded-xl transition-all hover:scale-105 active:scale-95"
                    title="Edit Event"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-105 active:scale-95"
                    title="Delete Event"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EventsManager;
