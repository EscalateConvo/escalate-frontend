import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient, queryClient } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { QUERY_KEYS } from "@/constants";

// Components
import {
  StepIndicator,
  RoleSelectionStep,
  DetailsStep,
} from "@/components/role-selection";
import type { Role, Step } from "@/components/role-selection";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { user, clearRoleSelectionFlag } = useAuth();
  
  // State
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [orgDescription, setOrgDescription] = useState('');

  // Pre-fill name from user data
  useEffect(() => {
    if (user?.name) {
      setDisplayName(user.name);
    }
  }, [user]);

  // Handlers
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinueToDetails = () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    setStep("details");
  };

  const handleBack = () => {
    setStep("role");
  };

  const handleSubmit = async () => {
    // Validation
    if (selectedRole === "USER") {
      if (!displayName.trim()) {
        toast.error("Please enter your name");
        return;
      }
    }

    if (selectedRole === "ORGANIZATION") {
      if (!orgName.trim()) {
        toast.error("Please enter your organization name");
        return;
      }
      if (!orgType) {
        toast.error("Please select an organization type");
        return;
      }
    }

    setLoading(true);

    try {
      if (selectedRole === "ORGANIZATION") {
        // Upgrade to organization
        await apiClient.post("/api/auth/upgrade-to-org", {
          orgName: orgName.trim(),
          orgType: orgType,
          orgDescription: orgDescription.trim() || undefined,
        });
      } else {
        // Update user profile (name)
        await apiClient.post("/api/auth/upgrade-to-org", {
          name: displayName.trim(),
        });
      }

      // Refresh user data and clear role selection flag
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.GET_USER],
      });
      clearRoleSelectionFlag();

      toast.success("Account setup complete!");

      // Navigate with replace to prevent back navigation
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 500);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to complete setup";
      toast.error(errorMessage);
      console.error("Error setting up account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <StepIndicator
            stepNumber={1}
            label="Select Role"
            isActive={step === "role"}
            isCompleted={step === "details"}
          />
          <div className="w-12 h-0.5 bg-slate-200" />
          <StepIndicator
            stepNumber={2}
            label="Details"
            isActive={step === "details"}
            isCompleted={false}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
          {step === "role" ? (
            <RoleSelectionStep
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
              onContinue={handleContinueToDetails}
              loading={loading}
            />
          ) : (
            <DetailsStep
              selectedRole={selectedRole!}
              displayName={displayName}
              setDisplayName={setDisplayName}
              orgName={orgName}
              setOrgName={setOrgName}
              orgType={orgType}
              setOrgType={setOrgType}
              orgDescription={orgDescription}
              setOrgDescription={setOrgDescription}
              onBack={handleBack}
              onSubmit={handleSubmit}
              loading={loading}
              existingName={user?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
