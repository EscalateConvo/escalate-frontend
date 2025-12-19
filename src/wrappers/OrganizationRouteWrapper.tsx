import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/assets/animation/LoadingSpinner";
import DashboardLayout from "@/layouts/DashboardLayout";

interface OrganizationRouteWrapperProps {
  children: React.ReactNode;
}

export default function OrganizationRouteWrapper({
  children,
}: OrganizationRouteWrapperProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.type !== "ORGANIZATION") {
    return <Navigate to="/modules" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
