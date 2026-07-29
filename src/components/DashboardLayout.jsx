import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <strong>MBA Elektrik CRM</strong>
          <span>İş Takip Sistemi</span>
        </div>

        <nav className="dashboard-nav">
          <NavLink to="/dashboard">Ana Panel</NavLink>
          <NavLink to="/customers">Müşteriler</NavLink>
          <NavLink to="/service-requests">Hizmet Talepleri</NavLink>
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

export default DashboardLayout;
