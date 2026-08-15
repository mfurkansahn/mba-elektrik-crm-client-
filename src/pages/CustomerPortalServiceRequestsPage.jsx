import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Date(dateValue).toLocaleDateString("tr-TR");
};

function CustomerPortalServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/CustomerPortal/service-requests");

        setServiceRequests(response.data);
      } catch (error) {
        console.error("Hizmet talepleri alınamadı:", error);

        setError(
          error.response?.data?.detail ||
            "Hizmet talepleri yüklenirken bir hata oluştu.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  if (loading) {
    return <p>Hizmet talepleri yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="customer-portal-service-requests-page">
      <h1>Hizmet Taleplerim</h1>

      {serviceRequests.length === 0 ? (
        <p>Henüz kayıtlı hizmet talebiniz bulunmuyor.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Hizmet Türü</th>
              <th>Durum</th>
              <th>Başlangıç Tarihi</th>
              <th>Son Tarih</th>
              <th>İşlem</th>
            </tr>
          </thead>

          <tbody>
            {serviceRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.title}</td>
                <td>{request.serviceType}</td>
                <td>{request.status}</td>
                <td>{formatDate(request.startDate)}</td>
                <td>{formatDate(request.dueDate)}</td>
                <td>
                  <Link to={`/customer-portal/service-requests/${request.id}`}>
                    Detayı Gör
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default CustomerPortalServiceRequestsPage;
