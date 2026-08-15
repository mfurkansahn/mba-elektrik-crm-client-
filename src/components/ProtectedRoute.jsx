import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole =
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => roles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
