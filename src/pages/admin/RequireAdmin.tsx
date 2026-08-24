import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <p className="eyebrow" style={{ marginTop: "48px" }}>Checking credentials…</p>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}