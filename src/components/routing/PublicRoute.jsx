import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!token) {
    return children;
  }

  if (roles.includes("Customer")) {
    return <Navigate to="/customer-portal" replace />;
  }

  if (roles.includes("Admin") || roles.includes("User")) {
    return <Navigate to="/dashboard" replace />;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("roles");

  return children;
}

export default PublicRoute;
