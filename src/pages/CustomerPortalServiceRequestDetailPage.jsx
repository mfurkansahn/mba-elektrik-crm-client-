import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Date(dateValue).toLocaleDateString("tr-TR");
};

function CustomerPortalServiceRequestDetailPage() {
  const { id } = useParams();

  const [serviceRequest, setServiceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/api/CustomerPortal/service-requests/${id}`,
        );

        setServiceRequest(response.data);
      } catch (error) {
        console.error("Hizmet talebi detayı alınamadı:", error);

        setError(
          error.response?.data?.detail ||
            "Hizmet talebi yüklenirken bir hata oluştu.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequest();
  }, [id]);

  if (loading) {
    return <p>Hizmet talebi yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!serviceRequest) {
    return <p>Hizmet talebi bulunamadı.</p>;
  }

  return (
    <section className="customer-portal-request-detail-page">
      <Link to="/customer-portal/service-requests">
        ← Hizmet Taleplerime Dön
      </Link>

      <h1>{serviceRequest.title}</h1>

      <div className="customer-portal-request-detail-card">
        <p>
          <strong>Hizmet Türü:</strong> {serviceRequest.serviceType}
        </p>

        <p>
          <strong>Durum:</strong> {serviceRequest.status}
        </p>

        <p>
          <strong>Açıklama:</strong> {serviceRequest.description || "-"}
        </p>

        <p>
          <strong>Başlangıç Tarihi:</strong>{" "}
          {formatDate(serviceRequest.startDate)}
        </p>

        <p>
          <strong>Son Tarih:</strong> {formatDate(serviceRequest.dueDate)}
        </p>

        <p>
          <strong>Tamamlanma Tarihi:</strong>{" "}
          {formatDate(serviceRequest.completedDate)}
        </p>

        <p>
          <strong>Oluşturulma Tarihi:</strong>{" "}
          {formatDate(serviceRequest.createdAt)}
        </p>
      </div>
    </section>
  );
}

export default CustomerPortalServiceRequestDetailPage;
