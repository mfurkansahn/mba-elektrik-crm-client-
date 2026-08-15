import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import "./CustomerPortalLayout.css";

function CustomerPortalLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <strong>MBA Elektrik</strong>
          <span>Müşteri Portalı</span>
        </div>

        <nav className="dashboard-nav">
          <NavLink to="/customer-portal" end>
            Profilim
          </NavLink>

          <NavLink to="/customer-portal/service-requests">
            Hizmet Taleplerim
          </NavLink>
        </nav>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </header>

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerPortalLayout;
