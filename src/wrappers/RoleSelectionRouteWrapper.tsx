import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";
import LoadingSpinner from "../LoadingSpinner";

export default function RoleSelectionRouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, needsRoleSelection } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if user doesn't need role selection
  if (!needsRoleSelection) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

