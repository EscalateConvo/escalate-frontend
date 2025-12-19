import { ViewModules } from "./organization";
import { SharedModules } from "./testtaker";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function Modules() {
  const { user } = useAuth();

  if (user?.type === "ORGANIZATION") {
    return (
      <DashboardLayout>
        <ViewModules />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SharedModules />
    </DashboardLayout>
  );
}
