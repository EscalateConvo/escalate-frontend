import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/assets/animation/LoadingSpinner";
import DashboardLayout from "@/layouts/DashboardLayout";

interface TestTakerRouteWrapperProps {
  children: React.ReactNode;
}

export default function TestTakerRouteWrapper({
  children,
}: TestTakerRouteWrapperProps) {
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

  if (user.type !== "USER") {
    return <Navigate to="/modules" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
