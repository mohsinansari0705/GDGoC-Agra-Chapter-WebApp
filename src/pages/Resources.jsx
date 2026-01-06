import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Video, Code, FileText, ExternalLink } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const Resources = () => {
  const resources = [
    {
      category: "Web Development",
      color: "bg-blue-500",
      icon: <Code className="w-8 h-8" />,
      items: [
        {
          title: "React.js Official Documentation",
          link: "https://react.dev",
          type: "Documentation",
        },
        {
          title: "MDN Web Docs",
          link: "https://developer.mozilla.org",
          type: "Documentation",
        },
        {
          title: "Next.js Tutorial",
          link: "https://nextjs.org/learn",
          type: "Tutorial",
        },
        {
          title: "Tailwind CSS Guide",
          link: "https://tailwindcss.com/docs",
          type: "Documentation",
        },
      ],
    },
    {
      category: "AI/ML",
      color: "bg-red-500",
      icon: <BookOpen className="w-8 h-8" />,
      items: [
        {
          title: "Google AI Learning",
          link: "https://ai.google/education/",
          type: "Course",
        },
        {
          title: "TensorFlow Tutorials",
          link: "https://www.tensorflow.org/tutorials",
          type: "Tutorial",
        },
        {
          title: "Machine Learning Crash Course",
          link: "https://developers.google.com/machine-learning/crash-course",
          type: "Course",
        },
        {
          title: "Kaggle Learn",
          link: "https://www.kaggle.com/learn",
          type: "Platform",
        },
      ],
    },
    {
      category: "Cloud Computing",
      color: "bg-yellow-500",
      icon: <Video className="w-8 h-8" />,
      items: [
        {
          title: "Google Cloud Training",
          link: "https://cloud.google.com/training",
          type: "Course",
        },
        {
          title: "Google Cloud Skills Boost",
          link: "https://www.cloudskillsboost.google/",
          type: "Platform",
        },
        {
          title: "Firebase Documentation",
          link: "https://firebase.google.com/docs",
          type: "Documentation",
        },
        {
          title: "Cloud Architecture Center",
          link: "https://cloud.google.com/architecture",
          type: "Guide",
        },
      ],
    },
    {
      category: "Android Development",
      color: "bg-green-500",
      icon: <Code className="w-8 h-8" />,
      items: [
        {
          title: "Android Developer Guide",
          link: "https://developer.android.com/guide",
          type: "Documentation",
        },
        {
          title: "Flutter Documentation",
          link: "https://flutter.dev/docs",
          type: "Documentation",
        },
        {
          title: "Kotlin for Android",
          link: "https://kotlinlang.org/docs/android-overview.html",
          type: "Documentation",
        },
        {
          title: "Jetpack Compose",
          link: "https://developer.android.com/jetpack/compose",
          type: "Framework",
        },
      ],
    },
    {
      category: "Design & UI/UX",
      color: "bg-purple-500",
      icon: <FileText className="w-8 h-8" />,
      items: [
        {
          title: "Material Design",
          link: "https://material.io/design",
          type: "Guide",
        },
        {
          title: "Google Design Resources",
          link: "https://design.google/",
          type: "Resources",
        },
        {
          title: "Figma Community",
          link: "https://www.figma.com/community",
          type: "Platform",
        },
        {
          title: "Design Principles",
          link: "https://principles.design/",
          type: "Guide",
        },
      ],
    },
    {
      category: "Developer Tools",
      color: "bg-indigo-500",
      icon: <Code className="w-8 h-8" />,
      items: [
        {
          title: "VS Code Tips",
          link: "https://code.visualstudio.com/docs",
          type: "Documentation",
        },
        {
          title: "Git Documentation",
          link: "https://git-scm.com/doc",
          type: "Documentation",
        },
        {
          title: "Chrome DevTools",
          link: "https://developer.chrome.com/docs/devtools/",
          type: "Tool",
        },
        {
          title: "GitHub Learning Lab",
          link: "https://lab.github.com/",
          type: "Course",
        },
      ],
    },
  ];

  const categoryOptions = useMemo(
    () => resources.map((r) => r.category),
    [resources]
  );

  const [communityResources, setCommunityResources] = useState([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [communityError, setCommunityError] = useState("");

  const [submitState, setSubmitState] = useState({
    title: "",
    link: "",
    category: categoryOptions[0] || "General",
    type: "Resource",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCommunity = async () => {
      if (!supabase || !isSupabaseConfigured) return;

      setIsLoadingCommunity(true);
      setCommunityError("");
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("id,title,link,category,type,description,created_at")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        if (cancelled) return;
        setCommunityResources(data || []);
      } catch (err) {
        if (cancelled) return;
        setCommunityError(err?.message || "Failed to load community resources");
      } finally {
        if (!cancelled) setIsLoadingCommunity(false);
      }
    };

    loadCommunity();

    return () => {
      cancelled = true;
    };
  }, [categoryOptions]);

  const normalizeUrl = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleSubmitCommunity = async (e) => {
    e.preventDefault();
    if (!supabase || !isSupabaseConfigured) return;

    setSubmitMessage("");

    const title = (submitState.title || "").trim();
    const link = normalizeUrl(submitState.link);

    if (!title) {
      setSubmitMessage("Title is required.");
      return;
    }

    if (!link || !/^https?:\/\//i.test(link)) {
      setSubmitMessage("Please enter a valid link (http/https).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        link,
        category: (submitState.category || "").trim(),
        type: (submitState.type || "").trim(),
        description: (submitState.description || "").trim(),
      };

      const { error } = await supabase.from("resources").insert(payload);
      if (error) throw error;

      setSubmitState((prev) => ({
        ...prev,
        title: "",
        link: "",
        description: "",
      }));
      setSubmitMessage("Thanks! Your resource was added.");

      const { data, error: reloadErr } = await supabase
        .from("resources")
        .select("id,title,link,category,type,description,created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!reloadErr) setCommunityResources(data || []);
    } catch (err) {
      setSubmitMessage(err?.message || "Failed to submit resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Curated learning materials and resources for our community members
          </motion.p>

          {isSupabaseConfigured ? (
            <motion.a
              href="#add-resource"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex mt-8 bg-google-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              Add your resource
            </motion.a>
          ) : null}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {resources.map((category, categoryIndex) => (
            <motion.section
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center mb-6">
                <div
                  className={`${category.color} p-3 rounded-lg text-white mr-4`}
                >
                  {category.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {category.category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.a
                    key={itemIndex}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-google-blue group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-google-blue transition-colors">
                          {item.title}
                        </h3>
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                          {item.type}
                        </span>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-google-blue transition-colors" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Community Resources */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex items-center mb-6">
            <div className="bg-google-blue p-3 rounded-lg text-white mr-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Community Resources
            </h2>
          </div>

          {!isSupabaseConfigured ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300">
                Supabase is not configured, so community resources are disabled.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add your resource */}
              <div
                id="add-resource"
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Add your resource
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Share a helpful link with the community.
                </p>

                <form onSubmit={handleSubmitCommunity} className="space-y-3">
                  <input
                    value={submitState.title}
                    onChange={(e) =>
                      setSubmitState((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Title (e.g., React Roadmap)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 outline-none"
                    required
                  />
                  <input
                    value={submitState.link}
                    onChange={(e) =>
                      setSubmitState((prev) => ({
                        ...prev,
                        link: e.target.value,
                      }))
                    }
                    placeholder="Link (e.g., https://example.com)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 outline-none"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={submitState.category}
                      onChange={(e) =>
                        setSubmitState((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 outline-none"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      {!categoryOptions.includes("General") && (
                        <option value="General">General</option>
                      )}
                    </select>

                    <input
                      value={submitState.type}
                      onChange={(e) =>
                        setSubmitState((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      placeholder="Type (e.g., Course)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 outline-none"
                    />
                  </div>

                  <textarea
                    value={submitState.description}
                    onChange={(e) =>
                      setSubmitState((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 outline-none min-h-[90px]"
                  />

                  {submitMessage ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {submitMessage}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-google-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Resource"}
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Latest submissions
                </h3>

                {isLoadingCommunity ? (
                  <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                ) : communityError ? (
                  <p className="text-red-600 dark:text-red-400">
                    {communityError}
                  </p>
                ) : communityResources.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">
                    No community resources yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {communityResources.slice(0, 10).map((item) => (
                      <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.category || "General"}
                              {item.type ? ` • ${item.type}` : ""}
                            </p>
                            {item.description ? (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                          <ExternalLink className="w-5 h-5 text-gray-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.section>

        {/* Additional Resources Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-google-blue to-google-green p-8 rounded-2xl text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Need More Resources?</h2>
          <p className="text-lg mb-6">
            Join our community on Discord and connect with fellow learners to
            share resources and knowledge!
          </p>
          <button className="bg-white text-google-blue px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Join Community
          </button>
        </motion.section>
      </div>
    </div>
  );
};

export default Resources;
