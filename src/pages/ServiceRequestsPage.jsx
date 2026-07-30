import { useEffect, useState } from "react";
import api from "../services/api";
import "./ServiceRequestsPage.css";
import { Link, useSearchParams } from "react-router-dom";

function ServiceRequestsPage() {
  const [searchParams] = useSearchParams();
  const selectedStatus = searchParams.get("status") || "";
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
            status: selectedStatus || undefined,
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
  }, [selectedStatus]);

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
          <h1>{selectedStatus || "Servis Talepleri"}</h1>

          <p>
            {selectedStatus
              ? `"${selectedStatus}" durumundaki hizmet talepleri`
              : "Kayıtlı servis taleplerinin listesi"}
          </p>
        </div>

        <Link to="/service-requests/new" className="add-service-request-button">
          Yeni Hizmet Talebi Ekle
        </Link>
      </div>
      {serviceRequestsData.items.length === 0 ? (
        <p>
          {selectedStatus
            ? `"${selectedStatus}" durumunda hizmet talebi bulunmuyor.`
            : "Henüz kayıtlı hizmet talebi bulunmuyor."}
        </p>
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
                  <td>
                    <Link
                      to={`/service-requests/${serviceRequest.id}`}
                      className="service-request-title-link"
                    >
                      {serviceRequest.title}
                    </Link>
                  </td>
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
