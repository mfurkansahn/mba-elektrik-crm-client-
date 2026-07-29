import { useEffect, useState } from "react";
import api from "../services/api";
import "./DashboardPage.css";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get("/api/Dashboard/summary");

        setSummary(response.data);
        console.log("Dashboard verileri:", response.data);
      } catch (error) {
        console.error("Dashboard verileri alınamadı:", error);
        setError("Dashboard bilgileri alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <p>Dashboard yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="dashboard-page">
      <h1>Yönetim Paneli</h1>
      <p>MBA Elektrik CRM sistemine hoş geldiniz.</p>

      <section className="dashboard-grid">
        <div className="summary-card">
          <h2>Toplam Müşteri</h2>
          <strong>{summary.totalCustomers}</strong>
        </div>

        <div className="summary-card">
          <h2>Toplam Hizmet Talebi</h2>
          <strong>{summary.totalServiceRequests}</strong>
        </div>

        <div className="summary-card">
          <h2>Yeni Talepler</h2>
          <strong>{summary.newRequests}</strong>
        </div>

        <div className="summary-card">
          <h2>Evrak Bekleyenler</h2>
          <strong>{summary.waitingDocuments}</strong>
        </div>

        <div className="summary-card">
          <h2>Başvurusu Hazırlananlar</h2>
          <strong>{summary.preparingApplications}</strong>
        </div>

        <div className="summary-card">
          <h2>Enerjisa Başvuruları</h2>
          <strong>{summary.enerjisaApplications}</strong>
        </div>

        <div className="summary-card">
          <h2>Kontrol Bekleyenler</h2>
          <strong>{summary.waitingControl}</strong>
        </div>

        <div className="summary-card">
          <h2>Tamamlanan Talepler</h2>
          <strong>{summary.completedRequests}</strong>
        </div>

        <div className="summary-card">
          <h2>İptal Edilen Talepler</h2>
          <strong>{summary.cancelledRequests}</strong>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
