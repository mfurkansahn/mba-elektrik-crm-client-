import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  let returnPath = "/login";
  let returnText = "Giriş sayfasına dön";

  if (token && roles.includes("Customer")) {
    returnPath = "/customer-portal";
    returnText = "Müşteri portalına dön";
  } else if (token && (roles.includes("Admin") || roles.includes("User"))) {
    returnPath = "/dashboard";
    returnText = "Yönetim paneline dön";
  }

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <p className="not-found-code">404</p>

        <h1>Sayfa Bulunamadı</h1>

        <p>Aradığınız sayfa mevcut değil veya adresi değiştirilmiş olabilir.</p>

        <Link to={returnPath} className="not-found-link">
          {returnText}
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
