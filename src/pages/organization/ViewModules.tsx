import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllModules,
  deleteModule,
  generateShareURL,
  revokeShareURL,
} from "@/queries/moduleQueries";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../../assets/animation/LoadingSpinner";
import {
  Plus,
  RefreshCw,
  Settings2,
  MoreVertical,
  Trash2,
  Link2,
  Link2Off,
  Eye,
  Copy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Edit3,
} from "lucide-react";
import { useState } from "react";

interface Module {
  _id: string;
  title: string;
  active: boolean;
  topic?: string;
  difficulty?: string;
  shareURL?: string;
  shareTokenExpiry?: string;
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  moduleName,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  moduleName: string;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Delete Module
          </h3>

          {/* Message */}
          <p className="text-slate-500 mb-2">Are you sure you want to delete</p>
          <p className="font-medium text-slate-900 mb-4">"{moduleName}"?</p>
          <p className="text-sm text-slate-500 mb-6">
            This action cannot be undone. All associated attempts and reports
            will also be deleted.
          </p>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewModules() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    moduleId: string;
    moduleName: string;
  }>({
    isOpen: false,
    moduleId: "",
    moduleName: "",
  });

  const {
    data: modules,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Module[]>({
    queryKey: ["org-modules"],
    queryFn: getAllModules,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      toast.success("Module deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
      setDeleteModal({ isOpen: false, moduleId: "", moduleName: "" });
    },
    onError: (err) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete module";
      toast.error(errorMessage);
    },
  });

  const generateShareMutation = useMutation({
    mutationFn: ({ moduleId }: { moduleId: string }) =>
      generateShareURL(moduleId),
    onSuccess: (data) => {
      toast.success("Share link generated!");
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
      if (data?.shareURL) {
        navigator.clipboard.writeText(data.shareURL);
        setCopiedId(data.shareURL);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
      }
    },
    onError: (err) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to generate share link";
      toast.error(errorMessage);
    },
  });

  const revokeShareMutation = useMutation({
    mutationFn: ({ moduleId }: { moduleId: string }) =>
      revokeShareURL(moduleId),
    onSuccess: () => {
      toast.success("Share link revoked");
      queryClient.invalidateQueries({ queryKey: ["org-modules"] });
    },
    onError: (err) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to revoke share link";
      toast.error(errorMessage);
    },
  });

  const handleCopyLink = async (shareURL: string, moduleId: string) => {
    await navigator.clipboard.writeText(shareURL);
    setCopiedId(moduleId);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDeleteModal = (moduleId: string, moduleName: string) => {
    setDeleteModal({ isOpen: true, moduleId, moduleName });
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteModal.moduleId);
  };

  const isShareExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const hasValidShareLink = (module: Module) => {
    return module.shareURL && !isShareExpired(module.shareTokenExpiry);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch modules");
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Training Modules
            </h1>
            <p className="text-slate-500">
              Manage your training scenarios and assessments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-10 w-10"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={() => navigate("/modules/create")}
              className="h-10 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Module
            </Button>
          </div>
        </div>

        {/* Module List */}
        {!modules || modules.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto">
                <Settings2 className="w-10 h-10 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  No modules yet
                </h3>
                <p className="text-slate-500 mt-1">
                  Create your first training module to get started
                </p>
              </div>
              <Button
                onClick={() => navigate("/modules/create")}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Module
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module._id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${module.active ? "bg-indigo-100" : "bg-slate-100"}
                    `}
                    >
                      <Settings2
                        className={`w-6 h-6 ${module.active ? "text-indigo-600" : "text-slate-400"}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`
                          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                          ${
                            module.active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }
                        `}
                        >
                          {module.active ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </span>
                        {module.topic && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            {module.topic}
                          </span>
                        )}
                        {hasValidShareLink(module) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <Link2 className="w-3 h-3" /> Shared
                          </span>
                        )}
                        {module.shareURL &&
                          isShareExpired(module.shareTokenExpiry) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              <Clock className="w-3 h-3" /> Link Expired
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Link Actions */}
                    {hasValidShareLink(module) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopyLink(module.shareURL!, module._id)
                        }
                        className="h-9"
                      >
                        {copiedId === module._id ? (
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
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          generateShareMutation.mutate({ moduleId: module._id })
                        }
                        disabled={generateShareMutation.isPending}
                        className="h-9"
                      >
                        <Link2 className="w-4 h-4 mr-1.5" />
                        {module.shareURL &&
                        isShareExpired(module.shareTokenExpiry)
                          ? "Regenerate Link"
                          : "Generate Link"}
                      </Button>
                    )}

                    {/* View Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/modules/${module._id}`)}
                      className="h-9"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View
                    </Button>

                    {/* More Actions Menu */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === module._id ? null : module._id,
                          )
                        }
                        className="h-9 w-9"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>

                      {openMenuId === module._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                            <button
                              onClick={() => {
                                navigate(`/modules/${module._id}`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit Module
                            </button>
                            {hasValidShareLink(module) && (
                              <button
                                onClick={() => {
                                  revokeShareMutation.mutate({
                                    moduleId: module._id,
                                  });
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Link2Off className="w-4 h-4" />
                                Revoke Share Link
                              </button>
                            )}
                            <button
                              onClick={() =>
                                openDeleteModal(module._id, module.title)
                              }
                              className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Module
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, moduleId: "", moduleName: "" })
        }
        onConfirm={confirmDelete}
        moduleName={deleteModal.moduleName}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
