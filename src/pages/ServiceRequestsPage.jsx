import { useEffect, useState } from "react";
import api from "../services/api";
import "./ServiceRequestsPage.css";
import { Link } from "react-router-dom";

function ServiceRequestsPage() {
  const [serviceRequestsData, setServiceRequestsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const response = await api.get("/api/ServiceRequests", {
          params: {
            pageNumber: 1,
            pageSize: 10,
          },
        });

        setServiceRequestsData(response.data);
      } catch (error) {
        console.error("Servis talepleri alınamadı:", error);
        setError("Servis talepleri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  if (loading) {
    return <p>Servis talepleri yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="service-requests-page">
      <div className="service-requests-header">
        <div>
          <h1>Servis Talepleri</h1>
          <p>Kayıtlı servis taleplerinin listesi</p>
        </div>

        <Link to="/service-requests/new" className="add-service-request-button">
          Yeni Hizmet Talebi Ekle
        </Link>
      </div>
      {serviceRequestsData.items.length === 0 ? (
        <p>Henüz kayıtlı hizmet talebi bulunmuyor.</p>
      ) : (
        <div className="service-requests-table-wrapper">
          <table className="service-requests-table">
            <thead>
              <tr>
                <th>Müşteri</th>
                <th>Başlık</th>
                <th>Hizmet Türü</th>
                <th>Durum</th>
                <th>Başlangıç Tarihi</th>
                <th>Son Tarih</th>
              </tr>
            </thead>

            <tbody>
              {serviceRequestsData.items.map((serviceRequest) => (
                <tr key={serviceRequest.id}>
                  <td>{serviceRequest.customerName}</td>
                  <td>{serviceRequest.title}</td>
                  <td>{serviceRequest.serviceType}</td>
                  <td>{serviceRequest.status}</td>
                  <td>
                    {new Date(serviceRequest.startDate).toLocaleDateString(
                      "tr-TR",
                    )}
                  </td>
                  <td>
                    {new Date(serviceRequest.dueDate).toLocaleDateString(
                      "tr-TR",
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="service-requests-total">
            Toplam hizmet talebi: {serviceRequestsData.totalCount}
          </p>
        </div>
      )}
    </main>
  );
}

export default ServiceRequestsPage;
