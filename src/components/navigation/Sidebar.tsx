import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, PanelLeftClose, Boxes } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const userMenuItems = [
    { path: "/home", icon: LayoutDashboard, label: "Home" },
  ];

  const orgMenuItems = [
    { path: "/home", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/modules", icon: Boxes, label: "Modules" },
  ];

  const menuItems =
    user?.type === "ORGANIZATION" ? orgMenuItems : userMenuItems;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            EscalateConvo
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          {user?.photoURL ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.[0] || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {user?.type === "ORGANIZATION" ? "Company Admin" : "Test Taker"}
            </p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
