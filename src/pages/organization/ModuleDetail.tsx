import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getModule,
  updateModule,
  generateShareURL,
  revokeShareURL,
  getModuleAttempts,
} from "@/queries/moduleQueries";
import type {
  Module,
  Difficulty,
  Emotion,
  ModuleAttempt,
} from "@/queries/moduleQueries";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "../../assets/animation/LoadingSpinner";
import {
  ArrowLeft,
  Save,
  Sparkles,
  User,
  Settings2,
  Users,
  Link2,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit3,
  X,
  Eye,
  EyeOff,
  Timer,
  FileText,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

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

export default function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Module | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<ModuleAttempt | null>(
    null,
  );
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const {
    data: module,
    isLoading,
    error,
  } = useQuery<Module>({
    queryKey: ["module", moduleId],
    queryFn: () => getModule(moduleId as string),
    enabled: !!moduleId && !!user,
  });

  const { data: attempts, isLoading: isLoadingAttempts } = useQuery<
    ModuleAttempt[]
  >({
    queryKey: ["module-attempts", moduleId],
    queryFn: () => getModuleAttempts(moduleId as string),
    enabled: !!moduleId && !!user,
  });

  const startEditing = () => {
    if (module) {
      setFormData(module);
      setIsEditing(true);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Module>) => updateModule(moduleId!, data),
    onSuccess: () => {
      toast.success("Module updated successfully");
      queryClient.invalidateQueries({ queryKey: ["module", moduleId] });
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
      setIsEditing(false);
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update module",
      );
    },
  });

  const generateShareMutation = useMutation({
    mutationFn: () => generateShareURL(moduleId!),
    onSuccess: (data) => {
      toast.success("Share link generated!");
      queryClient.invalidateQueries({ queryKey: ["module", moduleId] });
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
      if (data?.shareURL) {
        navigator.clipboard.writeText(data.shareURL);
        toast.success("Link copied to clipboard!");
      }
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to generate share link",
      );
    },
  });

  const revokeShareMutation = useMutation({
    mutationFn: () => revokeShareURL(moduleId!),
    onSuccess: () => {
      toast.success("Share link revoked");
      queryClient.invalidateQueries({ queryKey: ["module", moduleId] });
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to revoke share link",
      );
    },
  });

  const updateFormData = (path: string, value: any) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return prev;
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
    if (!email || !formData) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (formData.userEmails.includes(email)) {
      toast.error("Email already added");
      return;
    }

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            userEmails: [...prev.userEmails, email],
          }
        : prev,
    );
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            userEmails: prev.userEmails.filter((e) => e !== email),
          }
        : prev,
    );
  };

  const handleSave = () => {
    if (!formData) return;

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

    updateMutation.mutate({
      title: formData.title,
      topic: formData.topic,
      difficulty: formData.difficulty,
      maxDurationSeconds: formData.maxDurationSeconds,
      active: formData.active,
      aiFields: formData.aiFields,
      userFields: formData.userFields,
      userEmails: formData.userEmails,
    });
  };

  const handleCopyLink = async () => {
    if (module?.shareURL) {
      await navigator.clipboard.writeText(module.shareURL);
      setCopiedLink(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isShareExpired = () => {
    if (!module?.shareTokenExpiry) return false;
    return new Date(module.shareTokenExpiry) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Module Not Found
          </h2>
          <p className="text-slate-500">
            The module you're looking for doesn't exist or you don't have
            access.
          </p>
          <Button
            onClick={() => navigate("/modules")}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
        </div>
      </div>
    );
  }

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case "HIRE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "NO_HIRE":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "MAYBE":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-100";
    if (score >= 60) return "bg-amber-50 border-amber-100";
    return "bg-rose-50 border-rose-100";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleViewReport = (attempt: ModuleAttempt) => {
    setSelectedAttempt(attempt);
    setIsReportDialogOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              {isEditing ? "Edit Module" : module.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={
                  module.active
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }
              >
                {module.active ? "Active" : "Inactive"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  DIFFICULTY_OPTIONS.find((d) => d.value === module.difficulty)
                    ?.color || "bg-slate-100"
                }
              >
                {module.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "details" && isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(module);
                  setIsEditing(false);
                }}
                className="h-10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="h-10 bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : activeTab === "details" ? (
            <Button
              onClick={startEditing}
              className="h-10 bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Module
            </Button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          if (isEditing) {
            setFormData(module);
            setIsEditing(false);
          }
        }}
      >
        <TabsList className="h-10">
          <TabsTrigger value="details" className="gap-2 px-4">
            <FileText className="w-4 h-4" />
            Module Details
          </TabsTrigger>
          <TabsTrigger value="attempts" className="gap-2 px-4">
            <ClipboardList className="w-4 h-4" />
            Attempts
            {attempts && attempts.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 bg-indigo-100 text-indigo-700"
              >
                {attempts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Attempts Tab Content */}
        <TabsContent value="attempts" className="mt-6">
          <div className="space-y-3">
            {isLoadingAttempts ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : !attempts || attempts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Attempts Yet
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  No one has attempted this module yet. Share the module link
                  with test takers to get started.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Recommendation
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.map((attempt) => (
                      <tr
                        key={attempt._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {attempt.user?.name ||
                                  attempt.user?.email ||
                                  "Unknown User"}
                              </p>
                              {attempt.user?.email && attempt.user?.name && (
                                <p className="text-xs text-slate-500">
                                  {attempt.user.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {attempt.createdAt
                              ? new Date(attempt.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {attempt.createdAt
                              ? new Date(attempt.createdAt).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : ""}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant="outline"
                            className={
                              attempt.attemptStatus === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }
                          >
                            {attempt.attemptStatus}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          {attempt.attemptReport?.overallScore !== undefined ? (
                            <span
                              className={`text-lg font-bold ${getScoreColor(attempt.attemptReport.overallScore)}`}
                            >
                              {attempt.attemptReport.overallScore}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {attempt.attemptReport?.recommendation ? (
                            <Badge
                              variant="outline"
                              className={getRecommendationStyle(
                                attempt.attemptReport.recommendation,
                              )}
                            >
                              {attempt.attemptReport.recommendation ===
                                "HIRE" && (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              )}
                              {attempt.attemptReport.recommendation ===
                                "NO_HIRE" && (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {attempt.attemptReport.recommendation ===
                                "MAYBE" && <Minus className="w-3 h-3 mr-1" />}
                              {attempt.attemptReport.recommendation.replace(
                                "_",
                                " ",
                              )}
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {attempt.attemptStatus === "COMPLETED" &&
                          attempt.attemptReport ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(attempt)}
                              className="h-8"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View Report
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Module Details Tab Content */}
        <TabsContent value="details" className="mt-6 space-y-6">
          {/* Share Link Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Link2 className="w-5 h-5 text-blue-500" />
                Share Link
              </div>
              {module.shareURL && !isShareExpired() ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="h-9"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />{" "}
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" /> Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeShareMutation.mutate()}
                    disabled={revokeShareMutation.isPending}
                    className="h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    Revoke
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateShareMutation.mutate()}
                  disabled={generateShareMutation.isPending}
                  className="h-9"
                >
                  <Link2 className="w-4 h-4 mr-1.5" />
                  {generateShareMutation.isPending
                    ? "Generating..."
                    : "Generate Link"}
                </Button>
              )}
            </div>

            {module.shareURL && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <code className="flex-1 text-sm text-slate-600 font-mono truncate">
                    {isLinkVisible
                      ? module.shareURL
                      : "••••••••••••••••••••••••••••••••••••••••••••"}
                  </code>
                  <button
                    onClick={() => setIsLinkVisible(!isLinkVisible)}
                    className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                    title={isLinkVisible ? "Hide link" : "Show link"}
                  >
                    {isLinkVisible ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
                {module.shareTokenExpiry && (
                  <div
                    className={`flex items-center gap-1.5 mt-3 text-xs ${isShareExpired() ? "text-rose-600" : "text-slate-500"}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {isShareExpired() ? (
                      <span>
                        Expired on{" "}
                        {new Date(module.shareTokenExpiry).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>
                        Expires on{" "}
                        {new Date(module.shareTokenExpiry).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Basic Information */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Settings2 className="w-5 h-5 text-indigo-500" />
              Basic Information
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="title">Module Title</Label>
                {isEditing && formData ? (
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    className="h-11"
                  />
                ) : (
                  <p className="text-slate-700 py-2">{module.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                {isEditing && formData ? (
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => updateFormData("topic", e.target.value)}
                    className="h-11"
                  />
                ) : (
                  <p className="text-slate-700 py-2">{module.topic}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                {isEditing && formData ? (
                  <div className="flex gap-2">
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateFormData("difficulty", opt.value)}
                        className={`
                        px-3 py-1.5 rounded-lg border font-medium text-sm transition-all
                        ${
                          formData.difficulty === opt.value
                            ? opt.color +
                              " ring-2 ring-offset-1 ring-slate-900/10"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }
                      `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span
                    className={`
                  inline-flex px-3 py-1.5 rounded-lg text-sm font-medium
                  ${DIFFICULTY_OPTIONS.find((d) => d.value === module.difficulty)?.color || "bg-slate-100"}
                `}
                  >
                    {module.difficulty}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                {isEditing && formData ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateFormData("active", true)}
                      className={`
                      px-3 py-1.5 rounded-lg border font-medium text-sm transition-all
                      ${
                        formData.active
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200 ring-2 ring-offset-1 ring-emerald-500/20"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }
                    `}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFormData("active", false)}
                      className={`
                      px-3 py-1.5 rounded-lg border font-medium text-sm transition-all
                      ${
                        !formData.active
                          ? "bg-slate-200 text-slate-700 border-slate-300 ring-2 ring-offset-1 ring-slate-500/20"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }
                    `}
                    >
                      Inactive
                    </button>
                  </div>
                ) : (
                  <span
                    className={`
                  inline-flex px-3 py-1.5 rounded-lg text-sm font-medium
                  ${module.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}
                `}
                  >
                    {module.active ? "Active" : "Inactive"}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-slate-500" />
                Max Duration
              </Label>
              {isEditing && formData ? (
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={60}
                    max={300}
                    step={30}
                    value={formData.maxDurationSeconds || 180}
                    onChange={(e) =>
                      updateFormData(
                        "maxDurationSeconds",
                        Number(e.target.value),
                      )
                    }
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex items-center gap-1 min-w-[80px] justify-end">
                    <span className="text-lg font-semibold text-slate-800">
                      {Math.floor((formData.maxDurationSeconds || 180) / 60)}
                    </span>
                    <span className="text-sm text-slate-500">
                      min{" "}
                      {(formData.maxDurationSeconds || 180) % 60 > 0 &&
                        `${(formData.maxDurationSeconds || 180) % 60}s`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-2">
                  <span className="text-slate-700">
                    {Math.floor((module.maxDurationSeconds || 180) / 60)} min
                    {(module.maxDurationSeconds || 180) % 60 > 0 &&
                      ` ${(module.maxDurationSeconds || 180) % 60}s`}
                  </span>
                </div>
              )}
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
                <Label htmlFor="aiRole">AI Role</Label>
                {isEditing && formData ? (
                  <Input
                    id="aiRole"
                    value={formData.aiFields.role}
                    onChange={(e) =>
                      updateFormData("aiFields.role", e.target.value)
                    }
                    className="h-11"
                  />
                ) : (
                  <p className="text-slate-700 py-2">{module.aiFields.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Initial Emotion</Label>
                {isEditing && formData ? (
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
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-lg">
                      {EMOTION_OPTIONS.find(
                        (e) => e.value === module.aiFields.initialEmotion,
                      )?.emoji || "😐"}
                    </span>
                    <span className="text-slate-700 capitalize">
                      {module.aiFields.initialEmotion}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              {isEditing && formData ? (
                <textarea
                  id="systemPrompt"
                  value={formData.aiFields.systemPrompt}
                  onChange={(e) =>
                    updateFormData("aiFields.systemPrompt", e.target.value)
                  }
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              ) : (
                <p className="text-slate-700 py-2 whitespace-pre-wrap bg-slate-50 rounded-lg p-3 text-sm">
                  {module.aiFields.systemPrompt}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstMessage">First Message</Label>
              {isEditing && formData ? (
                <textarea
                  id="firstMessage"
                  value={formData.aiFields.firstMessage}
                  onChange={(e) =>
                    updateFormData("aiFields.firstMessage", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              ) : (
                <p className="text-slate-700 py-2 whitespace-pre-wrap bg-slate-50 rounded-lg p-3 text-sm">
                  {module.aiFields.firstMessage}
                </p>
              )}
            </div>
          </section>

          {/* User Configuration */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <User className="w-5 h-5 text-teal-500" />
              Test Taker Configuration
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">User Role</Label>
              {isEditing && formData ? (
                <Input
                  id="userRole"
                  value={formData.userFields.role}
                  onChange={(e) =>
                    updateFormData("userFields.role", e.target.value)
                  }
                  className="h-11"
                />
              ) : (
                <p className="text-slate-700 py-2">{module.userFields.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemStatement">Problem Statement</Label>
              {isEditing && formData ? (
                <textarea
                  id="problemStatement"
                  value={formData.userFields.problemStatement}
                  onChange={(e) =>
                    updateFormData(
                      "userFields.problemStatement",
                      e.target.value,
                    )
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              ) : (
                <p className="text-slate-700 py-2 whitespace-pre-wrap bg-slate-50 rounded-lg p-3 text-sm">
                  {module.userFields.problemStatement}
                </p>
              )}
            </div>
          </section>

          {/* Invited Users */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Users className="w-5 h-5 text-blue-500" />
              Invited Users ({module.userEmails?.length || 0})
            </div>

            {isEditing && (
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
            )}

            {(isEditing && formData ? formData.userEmails : module.userEmails)
              ?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(isEditing && formData
                  ? formData.userEmails
                  : module.userEmails
                ).map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm"
                  >
                    <span>{email}</span>
                    {isEditing && formData && (
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                No users invited yet. Share the link or add email addresses.
              </p>
            )}
          </section>
        </TabsContent>
      </Tabs>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <span className="block">
                  {selectedAttempt?.user?.name ||
                    selectedAttempt?.user?.email ||
                    "Unknown User"}
                </span>
                {selectedAttempt?.user?.email &&
                  selectedAttempt?.user?.name && (
                    <span className="text-sm font-normal text-slate-500">
                      {selectedAttempt.user.email}
                    </span>
                  )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedAttempt?.attemptReport && (
            <div className="space-y-6 pt-2">
              {/* Score Header */}
              <div
                className={`rounded-xl p-5 border ${getScoreBgColor(selectedAttempt.attemptReport.overallScore)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Overall Score</p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl font-bold ${getScoreColor(selectedAttempt.attemptReport.overallScore)}`}
                      >
                        {selectedAttempt.attemptReport.overallScore}
                      </span>
                      <span className="text-slate-400">/100</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-sm px-3 py-1 ${getRecommendationStyle(selectedAttempt.attemptReport.recommendation)}`}
                  >
                    {selectedAttempt.attemptReport.recommendation ===
                      "HIRE" && <TrendingUp className="w-4 h-4 mr-1.5" />}
                    {selectedAttempt.attemptReport.recommendation ===
                      "NO_HIRE" && <TrendingDown className="w-4 h-4 mr-1.5" />}
                    {selectedAttempt.attemptReport.recommendation ===
                      "MAYBE" && <Minus className="w-4 h-4 mr-1.5" />}
                    {selectedAttempt.attemptReport.recommendation.replace(
                      "_",
                      " ",
                    )}
                  </Badge>
                </div>
                {selectedAttempt.attemptReport.transcriptAnalysis
                  ?.callDurationSecs && (
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-slate-500">
                    <Timer className="w-4 h-4" />
                    <span>
                      Duration:{" "}
                      {formatDuration(
                        selectedAttempt.attemptReport.transcriptAnalysis
                          .callDurationSecs,
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedAttempt.attemptReport.summary && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Summary
                  </h4>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                    {selectedAttempt.attemptReport.summary}
                  </p>
                </div>
              )}

              {/* Detailed Scores */}
              {selectedAttempt.attemptReport.detailedFeedback && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">
                    Detailed Scores
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.entries(
                      selectedAttempt.attemptReport.detailedFeedback,
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100"
                      >
                        <p className="text-xs text-slate-500 capitalize mb-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p
                          className={`text-xl font-bold ${getScoreColor(value.score)}`}
                        >
                          {value.score}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Areas for Improvement */}
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedAttempt.attemptReport.strengths &&
                  selectedAttempt.attemptReport.strengths.length > 0 && (
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <h4 className="text-sm font-medium text-emerald-700 flex items-center gap-1.5 mb-3">
                        <TrendingUp className="w-4 h-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {selectedAttempt.attemptReport.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="text-sm text-slate-700 flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {selectedAttempt.attemptReport.areasForImprovement &&
                  selectedAttempt.attemptReport.areasForImprovement.length >
                    0 && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <h4 className="text-sm font-medium text-amber-700 flex items-center gap-1.5 mb-3">
                        <TrendingDown className="w-4 h-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {selectedAttempt.attemptReport.areasForImprovement.map(
                          (a, i) => (
                            <li
                              key={i}
                              className="text-sm text-slate-700 flex items-start gap-2"
                            >
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              {a}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Detailed Feedback */}
              {selectedAttempt.attemptReport.detailedFeedback && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">
                    Detailed Feedback
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(
                      selectedAttempt.attemptReport.detailedFeedback,
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-slate-50 rounded-lg p-4 border border-slate-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span
                            className={`text-sm font-bold ${getScoreColor(value.score)}`}
                          >
                            {value.score}/100
                          </span>
                        </div>
                        {value.feedback && (
                          <p className="text-sm text-slate-600">
                            {value.feedback}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
