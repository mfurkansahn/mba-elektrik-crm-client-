import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./DashboardLayout.css";
import "./CustomerPortalLayout.css";

function CustomerPortalLayout() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <strong>MBA Elektrik</strong>
          <span>Müşteri Portalı</span>
        </div>

        <nav
          id="customer-portal-navigation"
          className="dashboard-nav"
          onClick={() => setIsMenuOpen(false)}
        >
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
        <button
          type="button"
          className="mobile-menu-button"
          aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isMenuOpen}
          aria-controls="customer-portal-navigation"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerPortalLayout;
