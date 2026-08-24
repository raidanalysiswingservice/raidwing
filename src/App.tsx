import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { RequireAdmin } from "./pages/admin/RequireAdmin";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Join from "./pages/Join";
import RawCorner from "./pages/RawCorner";
import Team from "./pages/Team";
import VerifyOfficer from "./pages/VerifyOfficer";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Applications = lazy(() => import("./pages/admin/Applications"));
const Messages = lazy(() => import("./pages/admin/Messages"));
const TeamManager = lazy(() => import("./pages/admin/TeamManager"));
const OfficerManager = lazy(() => import("./pages/admin/OfficerManager"));
const NewsManager = lazy(() => import("./pages/admin/NewsManager"));
const GalleryManager = lazy(() => import("./pages/admin/GalleryManager"));
const HeroManager = lazy(() => import("./pages/admin/HeroManager"));

function admin(el: React.ReactNode) {
  return (
    <Suspense fallback={<div className="container"><p className="eyebrow" style={{ marginTop: "48px" }}>Loading…</p></div>}>
      {el}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "services", element: <Services /> },
      { path: "join", element: <Join /> },
      { path: "raw-corner", element: <RawCorner /> },
      { path: "team", element: <Team /> },
      { path: "verify", element: <VerifyOfficer /> },
      { path: "gallery", element: <Gallery /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: admin(<Login />) },
      {
        path: "admin",
        element: (
          <RequireAdmin>
            {admin(<AdminLayout />)}
          </RequireAdmin>
        ),
        children: [
          { index: true, element: admin(<Dashboard />) },
          { path: "applications", element: admin(<Applications />) },
          { path: "messages", element: admin(<Messages />) },
          { path: "team", element: admin(<TeamManager />) },
          { path: "officers", element: admin(<OfficerManager />) },
          { path: "news", element: admin(<NewsManager />) },
          { path: "gallery", element: admin(<GalleryManager />) },
          { path: "hero", element: admin(<HeroManager />) },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}