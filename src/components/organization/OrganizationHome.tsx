import {
  Mail,
  Shield,
  Plus,
  FolderOpen,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationStatistics } from "../../queries/moduleQueries";

const OrganizationHome = ({ user }: { user: User | null }) => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["organizationStatistics"],
    queryFn: getOrganizationStatistics,
  });

  const totalModules = statistics?.totalModules ?? 0;
  const completedAttempts = statistics?.completed ?? 0;
  const activeModules = statistics?.activeModules ?? 0;

  const maxValue = Math.max(totalModules, completedAttempts, activeModules, 1);

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto max-w-7xl px-4 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Admin Portal
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                Welcome back,
              </span>
              <br />
              <span className="bg-linear-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Manage your training modules and track team progress from your
              command center.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="group border-slate-200 hover:border-green-300 hover:text-green-600 hover:bg-green-50/50"
              asChild
            >
              <a href="/modules">
                <FolderOpen className="w-4 h-4 mr-2 transition-colors" />
                View Modules
              </a>
            </Button>
            <Button
              className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25 group"
              asChild
            >
              <a href="/modules/create">
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                New Module
              </a>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <Card className="lg:col-span-1 border-0 bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-700">
                  Profile
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-700 bg-green-50"
                >
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-500 rounded-full blur-md opacity-40" />
                    <Avatar className="h-16 w-16 ring-4 ring-white shadow-xl relative">
                      <AvatarImage
                        src={user.photoURL}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-linear-to-br from-green-500 to-emerald-600 text-white text-xl font-bold">
                        {user.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-500 rounded-full blur-md opacity-40" />
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-white relative">
                      {user?.name?.[0] || "O"}
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-slate-900 truncate">
                    {user?.name || "Organization"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Company Administrator
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-sm text-slate-700 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </p>
                    <p className="text-sm text-slate-700">Admin Access</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl shadow-slate-900/20 text-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Dashboard Overview
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Your organization's performance at a glance
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                      <FolderOpen className="h-5 w-5 text-white" />
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12 bg-white/10" />
                    ) : (
                      <span className="text-3xl font-bold text-green-400">
                        {totalModules}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    Total Modules
                  </p>
                  <div className="mt-3">
                    <Progress
                      value={(totalModules / maxValue) * 100}
                      className="h-1.5 bg-white/10 [&>div]:bg-green-500"
                    />
                  </div>
                </div>

                <div className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12 bg-white/10" />
                    ) : (
                      <span className="text-3xl font-bold text-blue-400">
                        {completedAttempts}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    Completed Attempts
                  </p>
                  <div className="mt-3">
                    <Progress
                      value={(completedAttempts / maxValue) * 100}
                      className="h-1.5 bg-white/10 [&>div]:bg-blue-500"
                    />
                  </div>
                </div>

                <div className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12 bg-white/10" />
                    ) : (
                      <span className="text-3xl font-bold text-amber-400">
                        {activeModules}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    Active Modules
                  </p>
                  <div className="mt-3">
                    <Progress
                      value={(activeModules / maxValue) * 100}
                      className="h-1.5 bg-white/10 [&>div]:bg-amber-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationHome;
