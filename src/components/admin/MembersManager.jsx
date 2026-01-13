import React, { useState, useEffect } from "react";
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
  Maximize2,
  Users,
  Award,
  Briefcase,
  Camera,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * Premium Social Input Component
 */
const SocialInput = ({ icon: Icon, color, helpText, ...props }) => {
  const tone = {
    blue: {
      iconActive: "text-blue-500",
      focus: "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
    },
    gray: {
      iconActive: "text-gray-600 dark:text-gray-200",
      focus: "focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400",
    },
    sky: {
      iconActive: "text-sky-500",
      focus: "focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500",
    },
  }[color] || {
    iconActive: "text-blue-500",
    focus: "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
  };

  const hasValue = Boolean(String(props.value || "").trim());

  return (
    <div className="relative group space-y-1">
      <div className="relative">
        <div
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            hasValue
              ? tone.iconActive
              : "text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300"
          }`}
        >
          <Icon size={16} />
        </div>
        <input
          {...props}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none ${tone.focus} transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-200 placeholder-gray-400`}
        />
      </div>
      {helpText && <p className="text-[10px] text-gray-400 pl-1">{helpText}</p>}
    </div>
  );
};

/**
 * Premium Member Card Editor
 */
const MemberCardEditor = ({
  title,
  description,
  prefix,
  data,
  onChange,
  theme = "blue",
  icon: HeaderIcon = User,
}) => {
  const themeColors = {
    blue: "text-blue-600 bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30",
    purple:
      "text-purple-600 bg-purple-50/50 border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/30",
    green:
      "text-green-600 bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30",
  };

  const themeFocus = {
    blue: "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
    purple: "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10",
    green: "focus:border-green-500 focus:ring-4 focus:ring-green-500/10",
  };

  const themeDecor = {
    blue: {
      blob: "bg-blue-500/5",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
    },
    purple: {
      blob: "bg-purple-500/5",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
    },
    green: {
      blob: "bg-green-500/5",
      iconBg: "bg-green-100 dark:bg-green-900/50",
    },
  };

  const themeKey = themeColors[theme] ? theme : "blue";
  const decor = themeDecor[themeKey];

  return (
    <div
      className={`p-5 rounded-2xl border ${themeColors[themeKey]
        .split(" ")
        .slice(1)
        .join(
          " "
        )} relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800`}
    >
      {/* Background decoration */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${decor.blob} rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`}
      ></div>

      <div className="mb-4">
        <h4
          className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
            themeColors[themeKey].split(" ")[0]
          }`}
        >
          <div className={`p-1.5 rounded-lg ${decor.iconBg}`}>
            <HeaderIcon size={14} />
          </div>
          {title}
        </h4>
        {description && (
          <p className="text-xs text-gray-400 mt-1 ml-9">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block ml-1">
            Full Name
          </label>
          <input
            placeholder={`e.g. John Doe`}
            value={data[`${prefix}`] || ""}
            onChange={(e) => onChange(prefix, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none ${themeFocus[themeKey]} transition-all font-medium`}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block ml-1">
            Profile Picture
          </label>
          <div className="flex gap-3">
            <div className="relative group/img w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
              {data[`${prefix}_image_url`] ? (
                <img
                  src={data[`${prefix}_image_url`]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Camera size={20} />
                </div>
              )}
            </div>
            <input
              placeholder="Image URL (https://...)"
              value={data[`${prefix}_image_url`] || ""}
              onChange={(e) => onChange(`${prefix}_image_url`, e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none ${themeFocus[themeKey]} transition-all text-sm`}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 ml-1">
            Paste a direct link to the image (from Drive, Cloudinary, etc.)
          </p>
        </div>
        <SocialInput
          icon={Linkedin}
          color="blue"
          placeholder="LinkedIn Profile URL"
          value={data[`${prefix}_linkedin_url`] || ""}
          onChange={(e) => onChange(`${prefix}_linkedin_url`, e.target.value)}
        />
        <SocialInput
          icon={Github}
          color="gray"
          placeholder="GitHub Profile URL"
          value={data[`${prefix}_github_url`] || ""}
          onChange={(e) => onChange(`${prefix}_github_url`, e.target.value)}
        />
        <SocialInput
          icon={Twitter}
          color="sky"
          placeholder="Twitter/X Profile URL"
          value={data[`${prefix}_twitter_url`] || ""}
          onChange={(e) => onChange(`${prefix}_twitter_url`, e.target.value)}
        />
      </div>
    </div>
  );
};

const MemberForm = ({
  data,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
  isEdit = false,
}) => {
  const [executives, setExecutives] = useState([]);

  useEffect(() => {
    const execs = [];
    for (let i = 1; i <= 8; i++) {
      if (data[`executive_${i}`]) {
        execs.push({
          id: i,
          name: data[`executive_${i}`] || "",
          image_url: data[`executive_${i}_image_url`] || "",
          linkedin_url: data[`executive_${i}_linkedin_url`] || "",
          github_url: data[`executive_${i}_github_url`] || "",
          twitter_url: data[`executive_${i}_twitter_url`] || "",
        });
      }
    }
    if (execs.length === 0)
      setExecutives([
        {
          id: 1,
          name: "",
          image_url: "",
          linkedin_url: "",
          github_url: "",
          twitter_url: "",
        },
      ]);
    else setExecutives(execs);
  }, []);

  const updateParentData = (newExecs) => {
    const newData = { ...data };
    for (let i = 1; i <= 8; i++) {
      newData[`executive_${i}`] = "";
      newData[`executive_${i}_image_url`] = "";
      newData[`executive_${i}_linkedin_url`] = "";
      newData[`executive_${i}_github_url`] = "";
      newData[`executive_${i}_twitter_url`] = "";
    }
    newExecs.forEach((exec, index) => {
      if (index < 8) {
        const num = index + 1;
        newData[`executive_${num}`] = exec.name;
        newData[`executive_${num}_image_url`] = exec.image_url;
        newData[`executive_${num}_linkedin_url`] = exec.linkedin_url;
        newData[`executive_${num}_github_url`] = exec.github_url;
        newData[`executive_${num}_twitter_url`] = exec.twitter_url;
      }
    });
    onChange(newData);
  };

  const handleExecChange = (index, field, value) => {
    const newExecs = [...executives];
    newExecs[index] = { ...newExecs[index], [field]: value };
    setExecutives(newExecs);
    updateParentData(newExecs);
  };

  const addExecutive = () => {
    if (executives.length >= 8) return;
    const newExecs = [
      ...executives,
      {
        id: Date.now(),
        name: "",
        image_url: "",
        linkedin_url: "",
        github_url: "",
        twitter_url: "",
      },
    ];
    setExecutives(newExecs);
    updateParentData(newExecs);
  };

  const removeExecutive = (index) => {
    const newExecs = executives.filter((_, i) => i !== index);
    setExecutives(newExecs);
    updateParentData(newExecs);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Section 1: Team Identity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sharda-blue/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sharda-blue/10 text-sharda-blue">
            <Briefcase size={18} />
          </span>
          Department & Team Info
        </h3>
        <p className="text-sm text-gray-500 mb-6 ml-10">
          Define the name of this specific group within your chapter.
        </p>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 block ml-1">
              Group / Department Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Technical Team, Design Wing, Core Team"
              value={data.team_name || data.name || ""}
              onChange={(e) => onChange({ ...data, team_name: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-sharda-blue/10 focus:border-sharda-blue transition-all text-lg font-medium"
            />
            <p className="text-xs text-gray-400 mt-2 ml-1">
              This will display as the main header for this group of members.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Leadership */}
      <div className="space-y-4">
        <div className="ml-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <Award size={18} />
            </span>
            Team Leadership
          </h3>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Assign the leaders responsible for this department.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MemberCardEditor
            title="Department Head / Lead"
            description="The primary person in charge."
            prefix="team_head"
            data={data}
            onChange={(key, val) => onChange({ ...data, [key]: val })}
            theme="blue"
            icon={User}
          />
          <MemberCardEditor
            title="Co-Lead / Assistant"
            description="The second-in-command (optional)."
            prefix="team_co_head"
            data={data}
            onChange={(key, val) => onChange({ ...data, [key]: val })}
            theme="purple"
            icon={User}
          />
        </div>
      </div>

      {/* Section 3: Executives */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600">
              <Users size={18} />
            </span>
            Team Members / Executives
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-500">
              {executives.length}/8
            </span>
          </h3>
          <button
            type="button"
            onClick={addExecutive}
            disabled={executives.length >= 8}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-8 ml-10 relative z-10">
          Add individual members belonging to this department (max 8 visible).
        </p>

        <div className="space-y-4 relative z-10">
          {executives.map((exec, index) => (
            <div
              key={index}
              className="flex gap-4 items-start p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:border-green-200 dark:hover:border-green-900 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col items-center gap-2 pt-1">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg shadow-green-500/30">
                  {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeExecutive(index)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex gap-3">
                  <div className="flex-1">
                    <input
                      placeholder="Full Name"
                      value={exec.name}
                      onChange={(e) =>
                        handleExecChange(index, "name", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      placeholder="Image URL"
                      value={exec.image_url}
                      onChange={(e) =>
                        handleExecChange(index, "image_url", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                  <input
                    placeholder="LinkedIn URL"
                    value={exec.linkedin_url}
                    onChange={(e) =>
                      handleExecChange(index, "linkedin_url", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                  />
                </div>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-800 dark:group-focus-within:text-white" />
                  <input
                    placeholder="GitHub URL"
                    value={exec.github_url}
                    onChange={(e) =>
                      handleExecChange(index, "github_url", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          {executives.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                <Users className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium max-w-xs mx-auto">
                This team currently has no executive members.
              </p>
              <button
                type="button"
                onClick={addExecutive}
                className="text-sharda-blue hover:underline text-sm font-semibold mt-1"
              >
                Add the first member
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 -mx-4 -mb-4 rounded-b-3xl z-20">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-sharda-blue to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2 font-bold"
        >
          {isLoading ? (
            "Saving Team..."
          ) : (
            <>
              <Save size={20} /> {isEdit ? "Save Changes" : "Create Team"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const MembersManager = ({ members, onCreate, onEdit, onDelete, isLoading }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    team_name: "",
    team_head: "",
    team_head_image_url: "",
    team_head_linkedin_url: "",
    team_head_github_url: "",
    team_head_twitter_url: "",
    team_co_head: "",
    team_co_head_image_url: "",
    team_co_head_linkedin_url: "",
    team_co_head_github_url: "",
    team_co_head_twitter_url: "",
    ...Array.from({ length: 8 }).reduce(
      (acc, _, i) => ({
        ...acc,
        [`executive_${i + 1}`]: "",
        [`executive_${i + 1}_image_url`]: "",
        [`executive_${i + 1}_linkedin_url`]: "",
        [`executive_${i + 1}_github_url`]: "",
        [`executive_${i + 1}_twitter_url`]: "",
      }),
      {}
    ),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editValues, setEditValues] = useState({});

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, name: formData.team_name };
    await onCreate(payload);
    setFormData(initialFormState);
    setIsCreating(false);
  };

  const startEditing = (member) => {
    setEditingId(member.id);
    setEditValues({
      ...member,
      team_name: member.team_name || member.name,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...editValues, name: editValues.team_name };
    await onEdit(editingId, payload);
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Team & Members
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Organize your chapter by Departments (e.g., Tech, Design, Core).
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
            <Plus size={20} /> Create New Department
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-1 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-700/50">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  New Department Structure
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Create a new group of members for your chapter.
                </p>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <MemberForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleCreateSubmit}
              onCancel={() => setIsCreating(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 gap-8">
        {members.length === 0 && !isCreating ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Teams Created
            </h3>
            <p className="text-gray-500 mb-6">
              Start by organizing your members into a department.
            </p>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingId(null);
                setFormData(initialFormState);
              }}
              className="px-6 py-2 bg-sharda-blue text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Create New Department
            </button>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="group bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300"
            >
              {editingId === member.id ? (
                <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-sharda-blue animate-pulse"></div>
                      Editing:{" "}
                      <span className="text-sharda-blue">
                        {member.team_name}
                      </span>
                    </h3>
                    <button
                      onClick={cancelEditing}
                      className="p-2 rounded-xl bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                      <Maximize2 size={20} />
                    </button>
                  </div>
                  <MemberForm
                    data={editValues}
                    onChange={setEditValues}
                    onSubmit={handleEditSubmit}
                    onCancel={cancelEditing}
                    isLoading={isLoading}
                    isEdit={true}
                  />
                </div>
              ) : (
                <div className="p-8">
                  <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center text-sharda-blue font-bold text-3xl shadow-inner border border-blue-100 dark:border-blue-900/30">
                        {member.team_name?.charAt(0) || "T"}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-sharda-blue transition-colors">
                          {member.team_name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Users size={12} />
                            {[1, 2, 3, 4, 5, 6, 7, 8].reduce(
                              (acc, i) =>
                                acc + (member[`executive_${i}`] ? 1 : 0),
                              0
                            ) +
                              (member.team_head ? 1 : 0) +
                              (member.team_co_head ? 1 : 0)}{" "}
                            Members
                          </span>
                          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-400 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{" "}
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(member)}
                        className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white rounded-xl transition-all hover:scale-105 active:scale-95"
                        title="Edit Team"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
                        className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-105 active:scale-95"
                        title="Delete Team"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Leadership Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {member.team_head && (
                        <div className="relative group/card">
                          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                          <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                            <div className="relative">
                              <img
                                src={
                                  member.team_head_image_url ||
                                  `https://ui-avatars.com/api/?name=${member.team_head}&background=0D8ABC&color=fff`
                                }
                                alt=""
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-md"
                              />
                              <div
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-white"
                                title="Team Head"
                              >
                                👑
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">
                                Team Lead
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                                {member.team_head}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {member.team_co_head && (
                        <div className="relative group/card">
                          <div className="absolute inset-0 bg-purple-500/5 dark:bg-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                          <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                            <div className="relative">
                              <img
                                src={
                                  member.team_co_head_image_url ||
                                  `https://ui-avatars.com/api/?name=${member.team_co_head}&background=8b5cf6&color=fff`
                                }
                                alt=""
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-md"
                              />
                              <div
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-white"
                                title="Co-Lead"
                              >
                                ⚡
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-0.5">
                                Co-Lead
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                                {member.team_co_head}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Executives Wrap */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].some(
                      (i) => member[`executive_${i}`]
                    ) && (
                      <div className="pt-4 border-t border-dashed border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
                          Executive Team
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(
                            (i) =>
                              member[`executive_${i}`] && (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all cursor-default group/exec relative"
                                >
                                  <img
                                    src={
                                      member[`executive_${i}_image_url`] ||
                                      `https://ui-avatars.com/api/?name=${
                                        member[`executive_${i}`]
                                      }`
                                    }
                                    className="w-6 h-6 rounded-full object-cover"
                                    alt=""
                                  />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {member[`executive_${i}`]}
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
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

export default MembersManager;
