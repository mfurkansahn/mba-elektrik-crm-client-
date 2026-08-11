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
  const [filters, setFilters] = useState({
    search: "",
    status: selectedStatus,
    serviceType: "",
    createdFrom: "",
    createdTo: "",
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [serviceTypes, setServiceTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));

    setPageNumber(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      serviceType: "",
      createdFrom: "",
      createdTo: "",
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    setPageNumber(1);
  };

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/ServiceRequests", {
          params: {
            search: filters.search.trim() || undefined,
            status: filters.status || undefined,
            serviceType: filters.serviceType || undefined,
            createdFrom: filters.createdFrom || undefined,
            createdTo: filters.createdTo || undefined,
            sortBy: filters.sortBy,
            sortDirection: filters.sortDirection,
            pageNumber,
            pageSize,
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
  }, [filters, pageNumber, pageSize]);

  useEffect(() => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      status: selectedStatus,
    }));

    setPageNumber(1);
  }, [selectedStatus]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [serviceTypesResponse, statusesResponse] = await Promise.all([
          api.get("/api/ReferenceData/service-types"),
          api.get("/api/ReferenceData/statuses"),
        ]);

        setServiceTypes(serviceTypesResponse.data);
        setStatuses(statusesResponse.data);
      } catch (error) {
        console.error("Filtre seçenekleri alınamadı:", error);
      }
    };

    fetchReferenceData();
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

      <section className="service-requests-filters">
        <div className="service-request-filter-group service-request-search">
          <label htmlFor="search">Arama</label>

          <input
            id="search"
            name="search"
            type="search"
            placeholder="Müşteri, başlık veya açıklama ara..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="service-request-filter-actions">
          <button type="button" onClick={handleClearFilters}>
            Filtreleri Temizle
          </button>
        </div>
        <div className="service-request-filter-group">
          <label htmlFor="status">Durum</label>

          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Tüm durumlar</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="service-request-filter-group">
          <label htmlFor="serviceType">Hizmet Türü</label>

          <select
            id="serviceType"
            name="serviceType"
            value={filters.serviceType}
            onChange={handleFilterChange}
          >
            <option value="">Tüm hizmet türleri</option>

            {serviceTypes.map((serviceType) => (
              <option key={serviceType} value={serviceType}>
                {serviceType}
              </option>
            ))}
          </select>
        </div>

        <div className="service-request-filter-group">
          <label htmlFor="createdFrom">Oluşturulma Başlangıcı</label>

          <input
            id="createdFrom"
            name="createdFrom"
            type="date"
            value={filters.createdFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div className="service-request-filter-group">
          <label htmlFor="createdTo">Oluşturulma Bitişi</label>

          <input
            id="createdTo"
            name="createdTo"
            type="date"
            value={filters.createdTo}
            onChange={handleFilterChange}
          />
        </div>

        <div className="service-request-filter-group">
          <label htmlFor="sortBy">Sıralama Alanı</label>

          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Oluşturulma Tarihi</option>
            <option value="startDate">Başlangıç Tarihi</option>
            <option value="dueDate">Son Tarih</option>
            <option value="title">Başlık</option>
            <option value="status">Durum</option>
          </select>
        </div>

        <div className="service-request-filter-group">
          <label htmlFor="sortDirection">Sıralama Yönü</label>

          <select
            id="sortDirection"
            name="sortDirection"
            value={filters.sortDirection}
            onChange={handleFilterChange}
          >
            <option value="desc">Azalan</option>
            <option value="asc">Artan</option>
          </select>
        </div>
      </section>

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
                <th>İşlemler</th>
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
                    {serviceRequest.dueDate
                      ? new Date(serviceRequest.dueDate).toLocaleDateString(
                          "tr-TR",
                        )
                      : "-"}
                  </td>
                  <td>
                    <Link
                      to={`/service-requests/${serviceRequest.id}/edit`}
                      className="service-request-edit-link"
                    >
                      Düzenle
                    </Link>
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
