import { Link } from "react-router-dom";
import "./UnauthorizedPage.css";

function UnauthorizedPage() {
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  const returnPath = roles.includes("Customer")
    ? "/customer-portal"
    : "/dashboard";

  return (
    <main className="unauthorized-page">
      <section className="unauthorized-card">
        <p className="unauthorized-code">403</p>

        <h1>Yetkisiz Erişim</h1>

        <p>Bu sayfaya erişim yetkiniz bulunmuyor.</p>

        <Link to={returnPath} className="unauthorized-link">
          Yetkili olduğum alana dön
        </Link>
      </section>
    </main>
  );
}

export default UnauthorizedPage;
