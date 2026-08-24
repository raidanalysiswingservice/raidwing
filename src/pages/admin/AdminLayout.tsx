import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logout2Icon } from "@solar-icons/react/outline/logout-2";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/applications", label: "Applications", end: false },
  { to: "/admin/messages", label: "Messages", end: false },
  { to: "/admin/team", label: "Team", end: false },
  { to: "/admin/officers", label: "Officers", end: false },
  { to: "/admin/news", label: "RAW Corner", end: false },
  { to: "/admin/gallery", label: "Gallery", end: false },
  { to: "/admin/hero", label: "Hero Images", end: false },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-shell">
      <div className="admin-bar">
        <div className="container admin-bar-inner">
          <ul className="admin-tabs">
            {TABS.map((t) => (
              <li key={t.to}>
                <NavLink
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) => `admin-tab ${isActive ? "is-active" : ""}`}
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button className="admin-signout" onClick={onLogout}>
            <Logout2Icon size={14} /> Sign out {user?.email ? `(${user.email})` : ""}
          </button>
        </div>
      </div>

      <div className="container admin-body">
        <Outlet />
      </div>
    </div>
  );
}