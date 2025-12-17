import {
  Building2,
  Calendar,
  Mail,
  Shield,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getAllModulesByUserEmail } from "@/lib/apiService";
import LoadingSpinner from "../../assets/animation/LoadingSpinner";
import { useEffect } from "react";
import { toast } from "sonner";

const TestTakerHome = ({ user }: { user: User | null }) => {
  const { data: modules, isLoading, error } = useQuery({
    queryKey: ["test-taker-modules"],
    queryFn: getAllModulesByUserEmail,
    enabled: !!user && user.type === "USER",
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch assigned tests");
    }
  }, [error]);

  // Transform API data to match component format
  const pendingTests = modules
    ? modules.map((module: any) => ({
        id: module._id,
        organizationName: module.organizationName,
        assignedDate: module.createdAt,
        testType: module.title,
        topic: module.topic,
        userFields: module.userFields,
      }))
    : [];

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground text-lg">
          You have {pendingTests.length} pending test
          {pendingTests.length !== 1 ? "s" : ""} to complete
        </p>
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
                <UserIcon className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              {user?.name || "User"}
            </h2>
            <p className="text-muted-foreground text-sm">Test Taker</p>
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
              <p className="text-foreground capitalize">
                {user?.type === "USER" ? "Test Taker" : user?.type}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
          Pending Tests
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : pendingTests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No pending tests at the moment
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              New assignments will appear here when organizations assign tests to your email
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {test.testType}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />
                        <span className="text-sm">
                          <span className="font-medium">Organization:</span>{" "}
                          {test.organizationName}
                        </span>
                      </div>

                      {test.topic && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-sm">
                            <span className="font-medium">Topic:</span> {test.topic}
                          </span>
                        </div>
                      )}

                      {test.userFields?.role && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-sm">
                            <span className="font-medium">Your Role:</span> {test.userFields.role}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span className="text-sm">
                          <span className="font-medium">Assigned:</span>{" "}
                          {new Date(test.assignedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                      Start Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestTakerHome;
