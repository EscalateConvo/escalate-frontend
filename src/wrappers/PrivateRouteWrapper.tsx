import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";
import LoadingSpinner from "../LoadingSpinner";

export default function PrivateRouteWrapper({
  children,
  requireRoleSelection = true,
}: {
  children: React.ReactNode;
  requireRoleSelection?: boolean;
}) {
  const { user, loading } = useAuth();
  const needsRoleSelection = localStorage.getItem('needsRoleSelection') === 'true';
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRoleSelection && needsRoleSelection) {
    return <Navigate to="/select-role" replace />;
  }

  return children;
}