import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, LogIn, RefreshCw } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { useAdmin } from "../context/AdminContext";

// Import Layout and Managers
import AdminLayout from "../components/admin/AdminLayout";
import DashboardStats from "../components/admin/DashboardStats";
import EventsManager from "../components/admin/EventsManager";
import BlogManager from "../components/admin/BlogManager";
import MembersManager from "../components/admin/MembersManager";
import GalleryManager from "../components/admin/GalleryManager";
import AdminsManager from "../components/admin/AdminsManager";
import ResourcesManager from "../components/admin/ResourcesManager";

const Admin = () => {
  const { admin, isLoading: authLoading, login, logout, hasAccess, isAuthenticated } = useAdmin();
  
  const [authError, setAuthError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    teamName: "",
    adminPosition: "",
    password: ""
  });

  // Dashboard State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const [stats, setStats] = useState({
    events: null,
    members: null,
    posts: null,
    gallery: null,
  });
  const [recent, setRecent] = useState({ event: null, post: null });

  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [resources, setResources] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                                Data Fetching                               */
  /* -------------------------------------------------------------------------- */

  const loadDashboard = async () => {
    if (!supabase) return;
    setIsDashboardLoading(true);
    try {
      const [eventsCount, membersCount, postsCount, galleryCount] =
        await Promise.all([
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("members").select("id", { count: "exact", head: true }),
          supabase
            .from("blog_posts")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("gallery_items")
            .select("id", { count: "exact", head: true }),
        ]);

      setStats({
        events: eventsCount.count ?? 0,
        members: membersCount.count ?? 0,
        posts: postsCount.count ?? 0,
        gallery: galleryCount.count ?? 0,
      });

      const [latestEvent, latestPost] = await Promise.all([
        supabase
          .from("events")
          .select("title, created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("blog_posts")
          .select("title, created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setRecent({ event: latestEvent.data, post: latestPost.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const loadLists = async () => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);
    try {
      const promises = [];
      let eventsIndex = -1, membersIndex = -1, postsIndex = -1, galleryIndex = -1, resourcesIndex = -1, adminsIndex = -1;
      let currentIndex = 0;

      // Events - super_admin and admin can see all
      if (hasAccess('events')) {
        eventsIndex = currentIndex++;
        promises.push(
          supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false })
        );
      }

      // Members - only super_admin
      if (hasAccess('members')) {
        membersIndex = currentIndex++;
        promises.push(
          supabase
            .from("members")
            .select("*")
            .order("created_at", { ascending: false })
        );
      }

      // Blog Posts - super_admin sees all, others see only their own
      postsIndex = currentIndex++;
      if (admin.admin_type === 'super_admin') {
        promises.push(
          supabase
            .from("blog_posts")
            .select("*")
            .order("created_at", { ascending: false })
        );
      } else {
        promises.push(
          supabase
            .from("blog_posts")
            .select("*")
            .eq("created_by", admin.admin_id)
            .order("created_at", { ascending: false })
        );
      }

      // Gallery - super_admin and admin can see all
      if (hasAccess('gallery')) {
        galleryIndex = currentIndex++;
        promises.push(
          supabase
            .from("gallery_items")
            .select("*")
            .order("created_at", { ascending: false })
        );
      }

      // Resources - super_admin sees all, others see only their own
      resourcesIndex = currentIndex++;
      if (admin.admin_type === 'super_admin') {
        promises.push(
          supabase
            .from("resources")
            .select("*")
            .order("created_at", { ascending: false })
        );
      } else {
        promises.push(
          supabase
            .from("resources")
            .select("*")
            .eq("created_by", admin.admin_id)
            .order("created_at", { ascending: false })
        );
      }

      // Admins - only super_admin
      if (hasAccess('admins')) {
        adminsIndex = currentIndex++;
        promises.push(
          supabase
            .from("admins")
            .select("*")
            .order("created_at", { ascending: false })
        );
      }

      const results = await Promise.all(promises);
      
      if (eventsIndex >= 0) setEvents(results[eventsIndex].data || []);
      if (membersIndex >= 0) setMembers(results[membersIndex].data || []);
      if (postsIndex >= 0) setPosts(results[postsIndex].data || []);
      if (galleryIndex >= 0) setGalleryItems(results[galleryIndex].data || []);
      if (resourcesIndex >= 0) setResources(results[resourcesIndex].data || []);
      if (adminsIndex >= 0) setAdmins(results[adminsIndex].data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const refreshAll = async () => {
    setIsDashboardLoading(true);
    try {
      await Promise.all([loadDashboard(), loadLists()]);
      setLastUpdatedAt(new Date().toISOString());
    } finally {
      setIsDashboardLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                CRUD Handlers                               */
  /* -------------------------------------------------------------------------- */

  const handleCreate = async (table, data) => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);
    
    // Special handling for admins table using RPC
    if (table === 'admins') {
      const { error } = await supabase.rpc('create_admin_with_auth', {
        p_email: data.email,
        p_password: data.password,
        p_admin_name: data.admin_name,
        p_admin_type: data.admin_type,
        p_team_name: data.team_name,
        p_admin_position: data.admin_position,
        p_is_active: data.is_active
      });
      if (error) alert(`Error: ${error.message}`);
    } else {
      const { error } = await supabase.from(table).insert({
        ...data,
        created_by: admin.admin_id,
      });
      if (error) alert(`Error: ${error.message}`);
    }
    await refreshAll();
  };

  const handleUpdate = async (table, id, data) => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);
    
    // Special handling for admins table using RPC
    if (table === 'admins') {
      const { error } = await supabase.rpc('update_admin', {
        p_admin_id: id,
        p_admin_name: data.admin_name,
        p_email: data.email,
        p_admin_type: data.admin_type,
        p_team_name: data.team_name,
        p_admin_position: data.admin_position,
        p_is_active: data.is_active
      });
      if (error) alert(`Error: ${error.message}`);
    } else {
      const { error } = await supabase.from(table).update(data).eq("id", id);
      if (error) alert(`Error: ${error.message}`);
    }
    await refreshAll();
  };

  const handleDelete = async (table, id) => {
    if (!supabase || !admin) return;
    if (!confirm("Are you sure you want to delete this specific item?")) return;
    setIsDashboardLoading(true);
    
    // Special handling for admins table using RPC
    if (table === 'admins') {
      const { error } = await supabase.rpc('delete_admin', {
        p_admin_id: id
      });
      if (error) alert(`Error: ${error.message}`);
    } else {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) alert(`Error: ${error.message}`);
    }
    await refreshAll();
  };

  // Specialized Event Saver (Deep Save)
  const handleSaveEvent = async (eventData, isEdit = false, id = null) => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);

    try {
      // 1. Separate generic fields from relation fields
      const { timeline, themes, prizes, ...mainData } = eventData;

      let eventId = id;

      if (isEdit && id) {
        // Update Main Event
        const { error } = await supabase
          .from("events")
          .update(mainData)
          .eq("id", id);
        if (error) throw error;
      } else {
        // Create Main Event
        const { data, error } = await supabase
          .from("events")
          .insert({ ...mainData, created_by: admin.admin_id })
          .select()
          .single();
        if (error) throw error;
        eventId = data.id;
      }

      // 2. Handle Relations (Timeline, Themes, Prizes)
      if (isEdit) {
        await Promise.all([
          supabase
            .from("event_timeline_items")
            .delete()
            .eq("event_id", eventId),
          supabase.from("event_themes").delete().eq("event_id", eventId),
          supabase.from("event_prizes").delete().eq("event_id", eventId),
        ]);
      }

      const operations = [];

      if (timeline && timeline.length > 0) {
        const timelineRows = timeline.map((item, index) => ({
          event_id: eventId,
          title: item.title,
          date: item.date,
          time: item.time,
          label: item.label || "COMPLETE",
          description: item.description,
          order_index: index,
          created_by: admin.admin_id,
        }));
        operations.push(
          supabase.from("event_timeline_items").insert(timelineRows)
        );
      }

      if (themes && themes.length > 0) {
        const themeRows = themes.map((theme, index) => ({
          event_id: eventId,
          theme,
          order_index: index,
          created_by: admin.admin_id,
        }));
        operations.push(supabase.from("event_themes").insert(themeRows));
      }

      if (prizes && prizes.length > 0) {
        const prizeRows = prizes.map((prize, index) => ({
          event_id: eventId,
          position: prize.position,
          amount: prize.amount,
          description: prize.description,
          created_by: admin.admin_id,
        }));
        operations.push(supabase.from("event_prizes").insert(prizeRows));
      }

      await Promise.all(operations);
      
      // Return event ID for image upload
      return { id: eventId };
    } catch (error) {
      console.error("Save Event Error:", error);
      alert(`Failed to save event: ${error.message}`);
      throw error;
    } finally {
      await refreshAll();
      setIsDashboardLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Auth Effects                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      refreshAll();
    }
  }, [isAuthenticated, authLoading]);

  // Protect against unauthorized tab access
  useEffect(() => {
    if (!isAuthenticated || !admin) return;

    const tabPermissions = {
      'dashboard': true,
      'admins': hasAccess('admins'),
      'events': hasAccess('events'),
      'members': hasAccess('members'),
      'blog': hasAccess('blogs'),
      'gallery': hasAccess('gallery'),
      'resources': hasAccess('resources'),
    };

    if (!tabPermissions[activeTab]) {
      setActiveTab('dashboard');
    }
  }, [activeTab, isAuthenticated, admin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    const result = await login(
      credentials.email,
      credentials.teamName,
      credentials.adminPosition,
      credentials.password
    );

    if (!result.success) {
      setAuthError(result.error || 'Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await logout();
    setCredentials({ email: "", teamName: "", adminPosition: "", password: "" });
  };

  /* -------------------------------------------------------------------------- */
  /*                                Render Views                                */
  /* -------------------------------------------------------------------------- */

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Configuration Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Supabase is not configured properly. Please check your environment
            variables.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sharda-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-sharda-blue/10 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-sharda-blue" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Access
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Team Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={credentials.teamName}
                  onChange={(e) =>
                    setCredentials({ ...credentials, teamName: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none transition-all"
                  required
                >
                  <option value="">Select Team</option>
                  <option value="Technical Team">Technical Team</option>
                  <option value="Events & Operations Team">Events & Operations Team</option>
                  <option value="PR & Outreach Team">PR & Outreach Team</option>
                  <option value="Social Media & Content Team">Social Media & Content Team</option>
                  <option value="Design & Editing Team">Design & Editing Team</option>
                  <option value="Disciplinary Committee">Disciplinary Committee</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Position
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={credentials.adminPosition}
                  onChange={(e) =>
                    setCredentials({ ...credentials, adminPosition: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none transition-all"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="head">Head</option>
                  <option value="co-head">Co-Head</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-sharda-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        // Build quick actions based on access
        const quickActions = [];
        
        if (hasAccess('events')) {
          quickActions.push({ 
            label: "Create Event", 
            onClick: () => setActiveTab("events") 
          });
        }
        
        quickActions.push({
          label: "Write Blog Post",
          onClick: () => setActiveTab("blog"),
          className: "bg-blue-50 dark:bg-blue-900/20 text-sharda-blue hover:bg-blue-100",
        });
        
        if (hasAccess('members')) {
          quickActions.push({
            label: "Add Member",
            onClick: () => setActiveTab("members"),
            className: "bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100",
          });
        }
        
        if (hasAccess('gallery')) {
          quickActions.push({
            label: "Upload Photo",
            onClick: () => setActiveTab("gallery"),
            className: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:bg-purple-100",
          });
        }

        return (
          <DashboardStats
            stats={stats}
            recent={recent}
            isLoading={isDashboardLoading}
            lastUpdatedAt={lastUpdatedAt}
            quickActions={quickActions}
          />
        );
      case "admins":
        return (
          <AdminsManager
            admins={admins}
            onCreate={(data) => handleCreate("admins", data)}
            onEdit={(id, data) => handleUpdate("admins", id, data)}
            onDelete={(id) => handleDelete("admins", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "events":
        return (
          <EventsManager
            events={events}
            onSave={handleSaveEvent}
            onDelete={(id) => handleDelete("events", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "blog":
        return (
          <BlogManager
            posts={posts}
            onCreate={(data) => handleCreate("blog_posts", data)}
            onEdit={(id, data) => handleUpdate("blog_posts", id, data)}
            onDelete={(id) => handleDelete("blog_posts", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "members":
        return (
          <MembersManager
            members={members}
            onCreate={(data) => handleCreate("members", data)}
            onEdit={(id, data) => handleUpdate("members", id, data)}
            onDelete={(id) => handleDelete("members", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "gallery":
        return (
          <GalleryManager
            galleryItems={galleryItems}
            onCreate={(data) => handleCreate("gallery_items", data)}
            onEdit={(id, data) => handleUpdate("gallery_items", id, data)}
            onDelete={(id) => handleDelete("gallery_items", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "resources":
        return (
          <ResourcesManager
            resources={resources}
            onCreate={(data) => handleCreate("resources", data)}
            onEdit={(id, data) => handleUpdate("resources", id, data)}
            onDelete={(id) => handleDelete("resources", id)}
            isLoading={isDashboardLoading}
            isSuperAdmin={admin?.admin_type === 'super_admin'}
          />
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  const headerMeta = {
    dashboard: {
      title: "Dashboard",
      subtitle:
        "Quick overview of events, members, posts, and gallery content.",
    },
    admins: {
      title: "Admin Management",
      subtitle: "Manage admin users and their access levels to the system.",
    },
    events: {
      title: "Events",
      subtitle:
        "Create and manage upcoming events, timeline, themes, and prizes.",
    },
    members: {
      title: "Members",
      subtitle:
        "Manage teams, leads, and executive members shown on the website.",
    },
    blog: {
      title: "Blog",
      subtitle: "Publish and update blog posts visible on the website.",
    },
    gallery: {
      title: "Gallery",
      subtitle: "Upload and curate photos for the gallery section.",
    },
    resources: {
      title: "Resources",
      subtitle: "Manage community-submitted learning resources and tools.",
    },
  };

  const meta = headerMeta[activeTab] || headerMeta.dashboard;

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      headerTitle={meta.title}
      headerSubtitle={meta.subtitle}
      headerRight={
        <button
          onClick={refreshAll}
          disabled={isDashboardLoading}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <RefreshCw
            className={`w-4 h-4 ${isDashboardLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      }
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
