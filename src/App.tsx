import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Introduction from "./pages/Introduction";
import Modules from "./pages/Modules";
import { CreateModule, ModuleDetail } from "./pages/organization";
import { SharedModuleDetail } from "./pages/testtaker";
import PrivateRouteWrapper from "./wrappers/PrivateRouteWrapper";
import PublicRouteWrapper from "./wrappers/PublicRouteWrapper";
import RoleSelectionRouteWrapper from "./wrappers/RoleSelectionRouteWrapper";
import OrganizationRouteWrapper from "./wrappers/OrganizationRouteWrapper";
import TestTakerRouteWrapper from "./wrappers/TestTakerRouteWrapper";
import { Toaster } from "./components/ui/sonner";
import RoleSelection from "./pages/RoleSelection";
import DashboardLayout from "./layouts/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Introduction />,
  },
  {
    path: "/login",
    element: (
      <PublicRouteWrapper>
        <Login />
      </PublicRouteWrapper>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRouteWrapper>
        <Signup />
      </PublicRouteWrapper>
    ),
  },
  {
    path: "/select-role",
    element: (
      <RoleSelectionRouteWrapper>
        <RoleSelection />
      </RoleSelectionRouteWrapper>
    ),
  },
  {
    path: "/home",
    element: (
      <PrivateRouteWrapper>
        <DashboardLayout>
          <Home />
        </DashboardLayout>
      </PrivateRouteWrapper>
    ),
  },
  {
    path: "/modules",
    element: (
      <PrivateRouteWrapper>
        <Modules />
      </PrivateRouteWrapper>
    ),
  },
  {
    path: "/modules/create",
    element: (
      <OrganizationRouteWrapper>
        <CreateModule />
      </OrganizationRouteWrapper>
    ),
  },
  {
    path: "/modules/:moduleId",
    element: (
      <OrganizationRouteWrapper>
        <ModuleDetail />
      </OrganizationRouteWrapper>
    ),
  },
  {
    path: "/shared/:moduleId",
    element: (
      <TestTakerRouteWrapper>
        <SharedModuleDetail />
      </TestTakerRouteWrapper>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
