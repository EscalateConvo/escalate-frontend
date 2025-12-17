import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllModules,
  getOneModule,
  generateShareURL,
  revokeShareURL,
  deleteModule,
  updateModule,
} from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "../assets/animation/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Trash2,
  Share2,
  X,
  Edit,
  Eye,
  RefreshCw,
  Check,
} from "lucide-react";

interface Module {
  _id: string;
  title: string;
  topic: string;
  difficulty: string;
  active: boolean;
  shareURL?: string;
  shareTokenExpiry?: string;
}

export default function OrganizationViewTests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "view" | "edit">("list");
  const [shareURL, setShareURL] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    topic: "",
    difficulty: "MEDIUM",
    active: true,
  });

  const { data: modules, isLoading, error, refetch } = useQuery({
    queryKey: ["org-modules"],
    queryFn: getAllModules,
    enabled: !!user && user.type === "ORGANIZATION",
  });

  const generateShareMutation = useMutation({
    mutationFn: ({ moduleId, expiryDays }: { moduleId: string; expiryDays?: number }) =>
      generateShareURL(moduleId, expiryDays),
    onSuccess: (data, variables) => {
      toast.success("Share URL generated successfully");
      setShareURL(data.shareURL);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to generate share URL");
    },
  });

  const revokeShareMutation = useMutation({
    mutationFn: (moduleId: string) => revokeShareURL(moduleId),
    onSuccess: () => {
      toast.success("Share URL revoked successfully");
      setShareURL("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to revoke share URL");
    },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (moduleId: string) => deleteModule(moduleId),
    onSuccess: () => {
      toast.success("Module deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
      setSelectedModule(null);
      setViewMode("list");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete module");
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: any }) =>
      updateModule(moduleId, data),
    onSuccess: () => {
      toast.success("Module updated successfully");
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
      setViewMode("list");
      setSelectedModule(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update module");
    },
  });

  const handleViewModule = async (module: Module) => {
    try {
      const fullModule = await getOneModule(module._id);
      setSelectedModule(fullModule);
      setEditData({
        title: fullModule.title,
        topic: fullModule.topic,
        difficulty: fullModule.difficulty,
        active: fullModule.active,
      });
      setViewMode("view");
      if (fullModule.shareURL) {
        setShareURL(fullModule.shareURL);
      } else {
        setShareURL("");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch module details");
    }
  };

  const handleEdit = () => {
    setViewMode("edit");
  };

  const handleSaveEdit = () => {
    if (!selectedModule) return;
    updateModuleMutation.mutate({
      moduleId: selectedModule._id,
      data: editData,
    });
  };

  const handleGenerateShare = (moduleId: string) => {
    generateShareMutation.mutate({ moduleId });
  };

  const handleRevokeShare = (moduleId: string) => {
    revokeShareMutation.mutate(moduleId);
  };

  const handleDelete = (moduleId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this module? This action cannot be undone."
      )
    ) {
      deleteModuleMutation.mutate(moduleId);
    }
  };

  const handleCopyShareURL = () => {
    if (shareURL) {
      navigator.clipboard.writeText(shareURL);
      setCopied(true);
      toast.success("Share URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedModule(null);
    setShareURL("");
    setCopied(false);
  };

  if (user?.type !== "ORGANIZATION") {
    return (
      <div className="p-8">
        <h2 className="text-xl font-medium">Not authorized</h2>
        <p className="text-muted-foreground">
          This page is only for organization accounts.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch tests");
  }

  if (viewMode === "view" && selectedModule) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Test Details</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleBackToList}>
              Back to List
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Title</Label>
            <h3 className="text-xl font-semibold mt-1">{selectedModule.title}</h3>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Topic</Label>
            <p className="text-sm mt-1">{selectedModule.topic}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Difficulty</Label>
            <p className="text-sm mt-1">{selectedModule.difficulty}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
            <span
              className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                selectedModule.active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {selectedModule.active ? "Active" : "Inactive"}
            </span>
          </div>

          {shareURL && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Share URL
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={shareURL} readOnly className="flex-1" />
                <Button variant="outline" size="sm" onClick={handleCopyShareURL}>
                  <Copy className="h-4 w-4 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            {!shareURL && (
              <Button
                onClick={() => handleGenerateShare(selectedModule._id)}
                disabled={generateShareMutation.isPending}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Generate Share URL
              </Button>
            )}
            {shareURL && (
              <Button
                variant="destructive"
                onClick={() => handleRevokeShare(selectedModule._id)}
                disabled={revokeShareMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Revoke Share URL
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedModule._id)}
              disabled={deleteModuleMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "edit" && selectedModule) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Edit Test</h1>
          <Button variant="outline" size="sm" onClick={() => setViewMode("view")}>
            Cancel
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Topic</Label>
            <Input
              value={editData.topic}
              onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
            />
          </div>
          <div>
            <Label>Difficulty</Label>
            <select
              className="w-full rounded-md border px-3 py-2"
              value={editData.difficulty}
              onChange={(e) =>
                setEditData({ ...editData, difficulty: e.target.value })
              }
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select
              className="w-full rounded-md border px-3 py-2"
              value={editData.active ? "true" : "false"}
              onChange={(e) =>
                setEditData({ ...editData, active: e.target.value === "true" })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSaveEdit}
              disabled={updateModuleMutation.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              {updateModuleMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => setViewMode("view")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Manage Tests</h1>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {(!modules || modules.length === 0) ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-muted-foreground">No tests assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(modules as Module[]).map((module) => (
            <div
              key={module._id}
              className="bg-white rounded-xl shadow p-4 hover:bg-green-50 hover:border-green-200 border border-transparent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{module.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Topic: {module.topic}</span>
                    <span>Difficulty: {module.difficulty}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        module.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {module.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {module.shareURL && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Share URL: {module.shareURL.substring(0, 50)}...
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewModule(module)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateShare(module._id)}
                    disabled={generateShareMutation.isPending}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  {module.shareURL && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeShare(module._id)}
                      disabled={revokeShareMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(module._id)}
                    disabled={deleteModuleMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
