import { useEffect, useState } from "react";
import api from "../services/api";
import "./CustomersPage.css";
import { Link, useNavigate } from "react-router-dom";

function CustomersPage() {
  const navigate = useNavigate();
  const [customersData, setCustomersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/api/Customers", {
          params: {
            pageNumber: 1,
            pageSize: 10,
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
  }, []);

  const handleDelete = async (customer) => {
    const isConfirmed = window.confirm(
      `${customer.fullNameOrCompanyName} isimli müşteriyi silmek istediğinize emin misiniz?`,
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
      console.error("Müşteri silinemedi:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Müşteri silinirken bir hata oluştu.",
      );
    }
  };

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

        <Link to="/customers/new" className="add-customer-button">
          Yeni Müşteri Ekle
        </Link>
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
                  <td>{customer.fullNameOrCompanyName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email || "-"}</td>
                  <td>
                    {customer.city}
                    {customer.district ? ` / ${customer.district}` : ""}
                  </td>
                  <td>{customer.customerType}</td>
                  <td>
                    <div className="customer-actions">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/customers/${customer.id}/edit`)
                        }
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(customer)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="customers-total">
            Toplam müşteri: {customersData.totalCount}
          </p>
        </div>
      )}
    </main>
  );
}

export default CustomersPage;
