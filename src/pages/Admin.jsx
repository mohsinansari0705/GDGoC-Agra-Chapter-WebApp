import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, LogIn, RefreshCw } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

// Import Layout and Managers
import AdminLayout from "../components/admin/AdminLayout";
import DashboardStats from "../components/admin/DashboardStats";
import EventsManager from "../components/admin/EventsManager";
import BlogManager from "../components/admin/BlogManager";
import MembersManager from "../components/admin/MembersManager";
import GalleryManager from "../components/admin/GalleryManager";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [userId, setUserId] = useState("");

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

  const allowedUids = useMemo(() => {
    const raw =
      import.meta.env.VITE_ADMIN_UIDS || import.meta.env.VITE_ADMIN_UID || "";
    return raw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }, []);

  const isAllowedAdmin = useMemo(() => {
    if (!userId) return false;
    if (allowedUids.length === 0) return false;
    return allowedUids.includes(userId);
  }, [allowedUids, userId]);

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
    if (!supabase) return;
    setIsDashboardLoading(true);
    try {
      const [eventsRes, membersRes, postsRes, galleryRes] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("members")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("gallery_items")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      setEvents(eventsRes.data || []);
      setMembers(membersRes.data || []);
      setPosts(postsRes.data || []);
      setGalleryItems(galleryRes.data || []);
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
    if (!supabase) return;
    setIsDashboardLoading(true);
    const { error } = await supabase.from(table).insert({
      ...data,
      created_by: userId,
    });
    if (error) alert(`Error: ${error.message}`);
    await refreshAll();
  };

  const handleUpdate = async (table, id, data) => {
    if (!supabase) return;
    setIsDashboardLoading(true);
    const { error } = await supabase.from(table).update(data).eq("id", id);
    if (error) alert(`Error: ${error.message}`);
    await refreshAll();
  };

  const handleDelete = async (table, id) => {
    if (!supabase) return;
    if (!confirm("Are you sure you want to delete this specific item?")) return;
    setIsDashboardLoading(true);
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) alert(`Error: ${error.message}`);
    await refreshAll();
  };

  // Specialized Event Saver (Deep Save)
  const handleSaveEvent = async (eventData, isEdit = false, id = null) => {
    if (!supabase) return;
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
          .insert({ ...mainData, created_by: userId })
          .select()
          .single();
        if (error) throw error;
        eventId = data.id;
      }

      // 2. Handle Relations (Timeline, Themes, Prizes)
      // Strategy: Delete all existing relation items and re-insert (simple replacement)
      // Ideally we would diff, but replacement is easier for now

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
          created_by: userId,
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
          created_by: userId,
        }));
        operations.push(supabase.from("event_themes").insert(themeRows));
      }

      if (prizes && prizes.length > 0) {
        const prizeRows = prizes.map((prize, index) => ({
          event_id: eventId,
          position: prize.position,
          amount: prize.amount,
          description: prize.description,
          created_by: userId,
        }));
        operations.push(supabase.from("event_prizes").insert(prizeRows));
      }

      await Promise.all(operations);
    } catch (error) {
      console.error("Save Event Error:", error);
      alert(`Failed to save event: ${error.message}`);
    } finally {
      await refreshAll();
      setIsDashboardLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Auth Effects                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    let isMounted = true;
    if (!supabase) {
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setAuthError(error.message);
      const id = data?.session?.user?.id || "";
      setUserId(id);
      setIsAuthenticated(Boolean(id));
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        const id = session?.user?.id || "";
        setUserId(id);
        setIsAuthenticated(Boolean(id));
      }
    );

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAllowedAdmin) refreshAll();
  }, [isAllowedAdmin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!supabase) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }
    const id = data?.user?.id || data?.session?.user?.id || "";
    setUserId(id);
    setIsAuthenticated(Boolean(id));
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserId("");
    setCredentials({ email: "", password: "" });
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

  if (isLoading) {
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

          <form onSubmit={handleLogin} className="space-y-5">
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

  if (!isAllowedAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You do not have permission to view this page.
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardStats
            stats={stats}
            recent={recent}
            isLoading={isDashboardLoading}
            lastUpdatedAt={lastUpdatedAt}
            quickActions={[
              { label: "Create Event", onClick: () => setActiveTab("events") },
              {
                label: "Write Blog Post",
                onClick: () => setActiveTab("blog"),
                className:
                  "bg-blue-50 dark:bg-blue-900/20 text-sharda-blue hover:bg-blue-100",
              },
              {
                label: "Add Member",
                onClick: () => setActiveTab("members"),
                className:
                  "bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100",
              },
              {
                label: "Upload Photo",
                onClick: () => setActiveTab("gallery"),
                className:
                  "bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:bg-purple-100",
              },
            ]}
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
