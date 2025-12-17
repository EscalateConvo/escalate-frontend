import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getAllModules,
  generateShareURL,
  revokeShareURL,
  deleteModule,
  updateModule,
  getOneModule,
} from "@/lib/apiService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Trash2, Share2, X, Edit, Eye, RefreshCw } from "lucide-react";
import LoadingSpinner from "@/assets/animation/LoadingSpinner";

interface Module {
  _id: string;
  title: string;
  topic: string;
  difficulty: string;
  active: boolean;
  shareURL?: string;
  shareTokenExpiry?: string;
}

interface AssignTestPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AssignTestPopup({
  open,
  onOpenChange,
}: AssignTestPopupProps) {
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

  const { data: modules, isLoading, refetch } = useQuery({
    queryKey: ["org-modules-popup"],
    queryFn: getAllModules,
    enabled: open,
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
      queryClient.invalidateQueries({ queryKey: ["org-modules-popup"] });
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
      queryClient.invalidateQueries({ queryKey: ["org-modules-popup"] });
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
    if (window.confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
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

  const handleClose = () => {
    setViewMode("list");
    setSelectedModule(null);
    setShareURL("");
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Tests</DialogTitle>
          <DialogDescription>
            View, edit, share, or delete your assigned tests
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-4">
            {!modules || modules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tests assigned yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(modules as Module[]).map((module) => (
                  <div
                    key={module._id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
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
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        ) : viewMode === "view" && selectedModule ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{selectedModule.title}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
                  Back
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Topic</Label>
                <p className="text-sm text-muted-foreground">{selectedModule.topic}</p>
              </div>
              <div>
                <Label>Difficulty</Label>
                <p className="text-sm text-muted-foreground">{selectedModule.difficulty}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedModule.active ? "Active" : "Inactive"}
                </p>
              </div>

              {shareURL && (
                <div>
                  <Label>Share URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={shareURL}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyShareURL}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
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
              </div>
            </div>
          </div>
        ) : viewMode === "edit" && selectedModule ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Edit Module</h3>
              <Button variant="outline" size="sm" onClick={() => setViewMode("view")}>
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
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
                  onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
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
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateModuleMutation.isPending}
                >
                  {updateModuleMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setViewMode("view")}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

