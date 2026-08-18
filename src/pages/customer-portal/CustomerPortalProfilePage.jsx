import { useEffect, useState } from "react";
import api from "../../services/api";

function CustomerPortalProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/CustomerPortal/me");
        setProfile(response.data);
      } catch (error) {
        console.error("Müşteri profili alınamadı:", error);

        setError(
          error.response?.data?.detail ||
            "Profil bilgileri yüklenirken bir hata oluştu.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Profil bilgileri yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Profil bilgisi bulunamadı.</p>;
  }

  return (
    <section className="customer-portal-profile-page">
      <h1>Profilim</h1>

      <div className="customer-portal-profile-card">
        <p>
          <strong>Ad Soyad / Firma:</strong> {profile.fullName}
        </p>

        <p>
          <strong>E-posta:</strong> {profile.email}
        </p>

        <p>
          <strong>Telefon:</strong> {profile.phone || "-"}
        </p>

        <p>
          <strong>Müşteri Tipi:</strong> {profile.customerType || "-"}
        </p>

        <p>
          <strong>Şehir / İlçe:</strong>{" "}
          {[profile.city, profile.district].filter(Boolean).join(" / ") || "-"}
        </p>

        <p>
          <strong>Adres:</strong> {profile.address || "-"}
        </p>
      </div>
    </section>
  );
}

export default CustomerPortalProfilePage;
