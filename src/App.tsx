import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Introduction from './pages/Introduction';
import PrivateRouteWrapper from './wrappers/PrivateRouteWrapper';
import PublicRouteWrapper from './wrappers/PublicRouteWrapper';
import RoleSelectionRouteWrapper from './wrappers/RoleSelectionRouteWrapper';
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
    path: '/select-role',
    element:
      <RoleSelectionRouteWrapper>
        <RoleSelection />
      </RoleSelectionRouteWrapper>
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
