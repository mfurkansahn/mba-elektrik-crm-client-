import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = roles.includes("Admin");

  const handleLogout = () => {
    const shouldLogout = window.confirm(
      "Çıkış yapmak istediğinizden emin misiniz?",
    );

    if (!shouldLogout) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <header
        className={`dashboard-header ${isMenuOpen ? "mobile-menu-open" : ""}`}
      >
        <div className="dashboard-brand">
          <strong>MBA Elektrik CRM</strong>
          <span>İş Takip Sistemi</span>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isMenuOpen}
          aria-controls="dashboard-navigation"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <nav
          id="dashboard-navigation"
          className="dashboard-nav"
          onClick={() => setIsMenuOpen(false)}
        >
          <NavLink to="/dashboard">Ana Panel</NavLink>
          <NavLink to="/customers">Müşteriler</NavLink>
          <NavLink to="/service-requests">Hizmet Talepleri</NavLink>
          {isAdmin && (
            <NavLink to="/customer-accounts">Portal Hesapları</NavLink>
          )}
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
