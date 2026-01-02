import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createModule } from "@/queries/moduleQueries";
import {
  ArrowLeft,
  Sparkles,
  User,
  Settings2,
  Users,
  ChevronDown,
  ChevronUp,
  Timer,
} from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type Emotion = "neutral" | "happy" | "angry" | "confused" | "sad";

interface ModuleFormData {
  title: string;
  topic: string;
  difficulty: Difficulty;
  maxDurationSeconds: number;
  aiFields: {
    role: string;
    systemPrompt: string;
    firstMessage: string;
    initialEmotion: Emotion;
  };
  userFields: {
    role: string;
    problemStatement: string;
  };
  userEmails: string[];
}

const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  color: string;
}[] = [
  {
    value: "EASY",
    label: "Easy",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "HARD",
    label: "Hard",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
];

const EMOTION_OPTIONS: { value: Emotion; label: string; emoji: string }[] = [
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "angry", label: "Angry", emoji: "😠" },
  { value: "confused", label: "Confused", emoji: "😕" },
  { value: "sad", label: "Sad", emoji: "😢" },
];

export default function CreateModule() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ModuleFormData>({
    title: "",
    topic: "",
    difficulty: "MEDIUM",
    maxDurationSeconds: 180,
    aiFields: {
      role: "",
      systemPrompt: "",
      firstMessage: "",
      initialEmotion: "neutral",
    },
    userFields: {
      role: "",
      problemStatement: "",
    },
    userEmails: [],
  });

  const [emailInput, setEmailInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFormData = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const addEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (formData.userEmails.includes(email)) {
      toast.error("Email already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      userEmails: [...prev.userEmails, email],
    }));
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      userEmails: prev.userEmails.filter((e) => e !== email),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a module title");
      return;
    }
    if (!formData.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (!formData.aiFields.role.trim()) {
      toast.error("Please enter the AI role");
      return;
    }
    if (!formData.aiFields.systemPrompt.trim()) {
      toast.error("Please enter a system prompt");
      return;
    }
    if (!formData.aiFields.firstMessage.trim()) {
      toast.error("Please enter the first message");
      return;
    }
    if (!formData.userFields.role.trim()) {
      toast.error("Please enter the user role");
      return;
    }
    if (!formData.userFields.problemStatement.trim()) {
      toast.error("Please enter a problem statement");
      return;
    }

    setSubmitting(true);
    try {
      await createModule(formData);
      toast.success("Module created successfully!");
      navigate("/modules");
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create module";
      toast.error(errorMessage);
      console.error("Error creating module:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/modules")}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Create New Module
          </h1>
          <p className="text-slate-500">
            Set up a new training scenario for your team
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Settings2 className="w-5 h-5 text-indigo-500" />
            Basic Information
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="title">Module Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                placeholder="e.g., Customer Complaint Resolution"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => updateFormData("topic", e.target.value)}
                placeholder="e.g., Handling Refund Requests"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <div className="flex gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateFormData("difficulty", opt.value)}
                  className={`
                      px-4 py-2 rounded-lg border font-medium text-sm transition-all
                      ${
                        formData.difficulty === opt.value
                          ? opt.color +
                            " ring-2 ring-offset-2 ring-slate-900/10"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }
                    `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDuration" className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-slate-500" />
              Max Duration
            </Label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="maxDuration"
                min={60}
                max={300}
                step={30}
                value={formData.maxDurationSeconds}
                onChange={(e) =>
                  updateFormData("maxDurationSeconds", Number(e.target.value))
                }
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex items-center gap-1 min-w-[80px] justify-end">
                <span className="text-lg font-semibold text-slate-800">
                  {Math.floor(formData.maxDurationSeconds / 60)}
                </span>
                <span className="text-sm text-slate-500">
                  min{" "}
                  {formData.maxDurationSeconds % 60 > 0 &&
                    `${formData.maxDurationSeconds % 60}s`}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Conversation will automatically end after this duration (1-5
              minutes)
            </p>
          </div>
        </section>

        {/* AI Configuration */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Character Configuration
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="aiRole">AI Role *</Label>
              <Input
                id="aiRole"
                value={formData.aiFields.role}
                onChange={(e) =>
                  updateFormData("aiFields.role", e.target.value)
                }
                placeholder="e.g., Frustrated Customer"
                className="h-11"
              />
              <p className="text-xs text-slate-500">
                The character the AI will play
              </p>
            </div>

            <div className="space-y-2">
              <Label>Initial Emotion</Label>
              <div className="flex flex-wrap gap-2">
                {EMOTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      updateFormData("aiFields.initialEmotion", opt.value)
                    }
                    className={`
                        px-3 py-1.5 rounded-lg border text-sm transition-all flex items-center gap-1.5
                        ${
                          formData.aiFields.initialEmotion === opt.value
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-offset-1 ring-indigo-500/20"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }
                      `}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt *</Label>
            <textarea
              id="systemPrompt"
              value={formData.aiFields.systemPrompt}
              onChange={(e) =>
                updateFormData("aiFields.systemPrompt", e.target.value)
              }
              placeholder="Describe the AI's personality, behavior, and conversation style..."
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstMessage">First Message *</Label>
            <textarea
              id="firstMessage"
              value={formData.aiFields.firstMessage}
              onChange={(e) =>
                updateFormData("aiFields.firstMessage", e.target.value)
              }
              placeholder="The opening message the AI will send to start the conversation..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>
        </section>

        {/* User Configuration */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <User className="w-5 h-5 text-teal-500" />
            Test Taker Configuration
          </div>

          <div className="space-y-2">
            <Label htmlFor="userRole">User Role *</Label>
            <Input
              id="userRole"
              value={formData.userFields.role}
              onChange={(e) =>
                updateFormData("userFields.role", e.target.value)
              }
              placeholder="e.g., Customer Support Agent"
              className="h-11"
            />
            <p className="text-xs text-slate-500">
              The role the test taker will play
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemStatement">Problem Statement *</Label>
            <textarea
              id="problemStatement"
              value={formData.userFields.problemStatement}
              onChange={(e) =>
                updateFormData("userFields.problemStatement", e.target.value)
              }
              placeholder="Describe the scenario and objectives for the test taker..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>
        </section>

        {/* Invite Users (Optional) */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Users className="w-5 h-5 text-blue-500" />
              Invite Users (Optional)
            </div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              {showAdvanced ? (
                <>
                  Hide <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {showAdvanced && (
            <>
              <p className="text-sm text-slate-500">
                Add email addresses of users who should have access to this
                module. You can also share via link later.
              </p>

              <div className="flex gap-2">
                <Input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address"
                  className="h-11 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEmail();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addEmail}
                  variant="outline"
                  className="h-11"
                >
                  Add
                </Button>
              </div>

              {formData.userEmails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.userEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm"
                    >
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/modules")}
            className="h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Module"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
