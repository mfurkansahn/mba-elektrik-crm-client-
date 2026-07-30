import { useEffect, useState } from "react";
import api from "../services/api";
import "./DashboardPage.css";
import { Link } from "react-router-dom";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reminders, setReminders] = useState(null);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersError, setRemindersError] = useState("");

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

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await api.get("/api/Dashboard/reminders");

        setReminders(response.data);
        console.log("Dashboard hatırlatma verileri:", response.data);
      } catch (error) {
        console.error("Hatırlatma verileri alınamadı:", error);
        setRemindersError("Hatırlatma bilgileri alınırken bir hata oluştu.");
      } finally {
        setRemindersLoading(false);
      }
    };

    fetchReminders();
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
        <div className="summary-card total-customers-card">
          <h2>Toplam Müşteri</h2>
          <strong>{summary.totalCustomers}</strong>
        </div>

        <Link
          to="/customers"
          className="summary-card summary-card-link active-customers-card"
        >
          <h2>Aktif Müşteriler</h2>
          <strong>{summary.activeCustomers}</strong>
          <span>Aktif müşterileri görüntüle</span>
        </Link>

        <Link
          to="/customers/passive"
          className="summary-card summary-card-link passive-customers-card"
        >
          <h2>Pasif Müşteriler</h2>
          <strong>{summary.passiveCustomers}</strong>
          <span>Pasif müşterileri görüntüle</span>
        </Link>

        <Link
          to="/service-requests"
          className="summary-card summary-card-link total-requests-card"
        >
          <h2>Toplam Hizmet Talebi</h2>
          <strong>{summary.totalServiceRequests}</strong>
          <span>Hizmet taleplerini görüntüle</span>
        </Link>

        <div className="summary-card new-requests-card">
          <h2>Yeni Talepler</h2>
          <strong>{summary.newRequests}</strong>
        </div>

        <div className="summary-card waiting-documents-card">
          <h2>Evrak Bekleyenler</h2>
          <strong>{summary.waitingDocuments}</strong>
        </div>

        <div className="summary-card preparing-applications-card">
          <h2>Başvurusu Hazırlananlar</h2>
          <strong>{summary.preparingApplications}</strong>
        </div>

        <div className="summary-card enerjisa-applications-card">
          <h2>Enerjisa Başvuruları</h2>
          <strong>{summary.enerjisaApplications}</strong>
        </div>

        <div className="summary-card waiting-control-card">
          <h2>Kontrol Bekleyenler</h2>
          <strong>{summary.waitingControl}</strong>
        </div>

        <div className="summary-card completed-requests-card">
          <h2>Tamamlanan Talepler</h2>
          <strong>{summary.completedRequests}</strong>
        </div>

        <div className="summary-card cancelled-requests-card">
          <h2>İptal Edilen Talepler</h2>
          <strong>{summary.cancelledRequests}</strong>
        </div>
      </section>

      <section className="reminders-section">
        <h2>Hatırlatmalar</h2>

        {remindersLoading ? (
          <p>Hatırlatmalar yükleniyor...</p>
        ) : remindersError ? (
          <p className="reminders-error">{remindersError}</p>
        ) : (
          <>
            <div className="reminders-grid">
              <div className="reminder-summary-card">
                <h3>Tamamlanmamış</h3>
                <strong>{reminders.totalIncompleteReminders}</strong>
              </div>

              <div className="reminder-summary-card overdue-reminders-card">
                <h3>Gecikmiş</h3>
                <strong>{reminders.overdueCount}</strong>
              </div>

              <div className="reminder-summary-card today-reminders-card">
                <h3>Bugün</h3>
                <strong>{reminders.todayCount}</strong>
              </div>

              <div className="reminder-summary-card upcoming-reminders-card">
                <h3>Yaklaşan</h3>
                <strong>{reminders.upcomingCount}</strong>
              </div>
            </div>

            {reminders.totalIncompleteReminders === 0 && (
              <p className="reminders-empty">
                Şu anda bekleyen bir hatırlatma bulunmuyor.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
