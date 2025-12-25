import type { ReactNode } from "react";
import AppSidebar from "@/components/navigation/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardContent({ children }: { children: ReactNode }) {
  const { open, isMobile } = useSidebar();

  return (
    <SidebarInset className="bg-linear-to-br from-green-50 via-white to-green-50/50">
      {(!open || isMobile) && (
        <SidebarTrigger className="fixed top-4 left-4 z-50" />
      )}
      <main className="flex-1">{children}</main>
    </SidebarInset>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
