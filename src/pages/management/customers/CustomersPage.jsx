import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./CustomersPage.css";
import { Link, useNavigate } from "react-router-dom";

function CustomersPage() {
  const navigate = useNavigate();
  const [customersData, setCustomersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = roles.includes("Admin");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/api/Customers", {
          params: {
            pageNumber,
            pageSize,
          },
        });

        setCustomersData(response.data);
        console.log("Müşteri verileri:", response.data);
      } catch (error) {
        console.error("Müşteriler alınamadı:", error);
        setError("Müşteriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [pageNumber, pageSize]);

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);

    setPageSize(newPageSize);
    setPageNumber(1);
  };

  const handleDeactivate = async (customer) => {
    const isConfirmed = window.confirm(
      `${customer.fullNameOrCompanyName} isimli müşteriyi pasife almak istediğinize emin misiniz? Müşterinin geçmiş kayıtları korunacaktır.`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(`/api/Customers/${customer.id}`);

      setCustomersData((previousData) => ({
        ...previousData,
        totalCount: previousData.totalCount - 1,
        items: previousData.items.filter((item) => item.id !== customer.id),
      }));
    } catch (error) {
      console.error("Müşteri pasife alınamadı:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Müşteri pasife alınırken bir hata oluştu.",
      );
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil((customersData?.totalCount ?? 0) / pageSize),
  );

  if (loading) {
    return <p>Müşteriler yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Müşteriler</h1>
          <p>Kayıtlı müşterilerin listesi</p>
        </div>

        <div className="customers-header-actions">
          <Link to="/customers/passive" className="passive-customers-button">
            Pasif Müşteriler
          </Link>

          <Link to="/customers/new" className="add-customer-button">
            Yeni Müşteri Ekle
          </Link>
        </div>
      </div>

      {customersData.items.length === 0 ? (
        <p>Henüz kayıtlı müşteri bulunmuyor.</p>
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
                <th>İşlemler</th>
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

                  <td data-label="İşlemler">
                    <div className="customer-actions">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/customers/${customer.id}/edit`)
                        }
                      >
                        Düzenle
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(customer)}
                        >
                          Pasife Al
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="customers-total">
            Toplam müşteri: {customersData.totalCount}
          </p>

          <nav className="customers-pagination" aria-label="Müşteri sayfalama">
            <label htmlFor="customer-page-size" className="customers-page-size">
              <span>Sayfa başına</span>

              <select
                id="customer-page-size"
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

export default CustomersPage;
