import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import "./CustomersPage.css";

function PassiveCustomersPage() {
  const [customersData, setCustomersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = roles.includes("Admin");

  useEffect(() => {
    const fetchPassiveCustomers = async () => {
      try {
        const response = await api.get("/api/Customers", {
          params: {
            isActive: false,
            pageNumber,
            pageSize,
          },
        });

        setCustomersData(response.data);
      } catch (error) {
        console.error("Pasif müşteriler alınamadı:", error);

        setError(
          error.response?.data?.detail ||
            error.response?.data?.title ||
            "Pasif müşteriler yüklenirken bir hata oluştu.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPassiveCustomers();
  }, [pageNumber, pageSize]);

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);

    setPageSize(newPageSize);
    setPageNumber(1);
  };

  const handleActivate = async (customer) => {
    const isConfirmed = window.confirm(
      `${customer.fullNameOrCompanyName} isimli müşteriyi yeniden aktif hâle getirmek istediğinize emin misiniz?`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await api.patch(`/api/Customers/${customer.id}/activate`);

      setCustomersData((previousData) => ({
        ...previousData,
        totalCount: previousData.totalCount - 1,
        items: previousData.items.filter((item) => item.id !== customer.id),
      }));
    } catch (error) {
      console.error("Müşteri aktif edilemedi:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Müşteri aktif edilirken bir hata oluştu.",
      );
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil((customersData?.totalCount ?? 0) / pageSize),
  );

  if (loading) {
    return <p>Pasif müşteriler yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Pasif Müşteriler</h1>
          <p>Pasife alınmış ve geçmiş kayıtları korunan müşteriler</p>
        </div>

        <Link to="/customers" className="add-customer-button">
          Aktif Müşterilere Dön
        </Link>
      </div>

      {customersData.items.length === 0 ? (
        <p>Pasif müşteri bulunmuyor.</p>
      ) : (
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Ad / Firma</th>
                <th>Telefon</th>
                <th>E-posta</th>
                <th>Konum</th>
                <th>Müşteri Türü</th>
                {isAdmin && <th>İşlemler</th>}
              </tr>
            </thead>

            <tbody>
              {customersData.items.map((customer) => (
                <tr key={customer.id}>
                  <td data-label="Ad / Firma">
                    {customer.fullNameOrCompanyName}
                  </td>

                  <td data-label="Telefon">{customer.phone}</td>

                  <td data-label="E-posta">{customer.email || "-"}</td>

                  <td data-label="Konum">
                    {customer.city}
                    {customer.district ? ` / ${customer.district}` : ""}
                  </td>

                  <td data-label="Müşteri Türü">{customer.customerType}</td>

                  {isAdmin && (
                    <td data-label="İşlemler">
                      <div className="customer-actions">
                        <button
                          type="button"
                          onClick={() => handleActivate(customer)}
                        >
                          Yeniden Aktif Et
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="customers-total">
            Toplam pasif müşteri: {customersData.totalCount}
          </p>

          <nav
            className="customers-pagination"
            aria-label="Pasif müşteri sayfalama"
          >
            <label
              htmlFor="passive-customer-page-size"
              className="customers-page-size"
            >
              <span>Sayfa başına</span>

              <select
                id="passive-customer-page-size"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>

            <div className="customers-page-controls">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() =>
                  setPageNumber((currentPage) => Math.max(1, currentPage - 1))
                }
              >
                Önceki
              </button>

              <span aria-live="polite">
                Sayfa {pageNumber} / {totalPages}
              </span>

              <button
                type="button"
                disabled={pageNumber >= totalPages}
                onClick={() =>
                  setPageNumber((currentPage) =>
                    Math.min(totalPages, currentPage + 1),
                  )
                }
              >
                Sonraki
              </button>
            </div>
          </nav>
        </div>
      )}
    </main>
  );
}

export default PassiveCustomersPage;
