import OrganizationHome from "@/components/organization/OrganizationHome";
import SharedModules from "./testtaker/SharedModules";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {user?.type === "ORGANIZATION" ? (
        <OrganizationHome user={user} />
      ) : (
        <SharedModules />
      )}
    </>
  );
}
