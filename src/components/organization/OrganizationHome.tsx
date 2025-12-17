import { Mail, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationStatistics } from "@/lib/apiService";
import LoadingSpinner from "../../assets/animation/LoadingSpinner";

const OrganizationHome = ({ user }: { user: User | null }) => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["org-statistics"],
    queryFn: getOrganizationStatistics,
    enabled: !!user && user.type === "ORGANIZATION",
  });
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-muted-foreground text-lg">Company Admin Dashboard</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 sm:p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex items-start gap-4 pb-6 border-b border-border">
          <div className="shrink-0">
            {user?.photoURL ? (
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg ring-2 ring-primary/10">
                <Avatar className="h-full w-full rounded-full">
                  <AvatarImage src={user.photoURL} className="object-cover" />
                  <AvatarFallback className="rounded-full">
                    {user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-linear-to-br from-primary to-green-600 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg ring-2 ring-primary/10">
                {user?.name?.[0] || "O"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              {user?.name || "Organization"}
            </h2>
            <p className="text-muted-foreground text-sm">Company Admin</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Email Address
              </p>
              <p className="text-foreground break-all">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Account Type
              </p>
              <p className="text-foreground">Company Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-6 text-foreground">
            Quick Actions
          </h3>
          <ul className="space-y-4">
            <li>
              <a
                href="/assign-test"
                className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
              >
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
                <span className="font-medium">Assign a new test</span>
              </a>
            </li>
            <li>
              <a
                href="/manage-tests"
                className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
              >
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
                <span className="font-medium">View assigned tests</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8">
          <h3 className="text-xl font-semibold mb-6 text-foreground">
            Statistics
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Total Tests Assigned
                </span>
                <span className="text-2xl font-bold text-primary">
                  {statistics?.totalTestsAssigned || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed</span>
                <span className="text-2xl font-bold text-green-600">
                  {statistics?.completed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending</span>
                <span className="text-2xl font-bold text-amber-600">
                  {statistics?.pending || 0}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationHome;
