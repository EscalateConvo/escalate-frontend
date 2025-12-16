import { useQuery } from "@tanstack/react-query";
import { getAllModules } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../assets/animation/LoadingSpinner";

export default function OrganizationViewTests() {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["org-modules"],
    queryFn: getAllModules,
    enabled: !!user && user.type === "ORGANIZATION",
  });

  if (user?.type !== "ORGANIZATION") {
    return (
      <div className="p-8">
        <h2 className="text-xl font-medium">Not authorized</h2>
        <p className="text-muted-foreground">This page is only for organization accounts.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch tests");
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Assigned Tests</h1>
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>

      {(!data || data.length === 0) ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-muted-foreground">No tests assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((m: any) => (
            <div key={m._id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">{m.title}</h3>
                <p className="text-sm text-muted-foreground">Status: {m.active ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <a href={`/modules/${m._id}`} className="text-primary underline">View</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
