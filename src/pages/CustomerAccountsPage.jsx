import { useEffect, useState } from "react";
import api from "../services/api";
import "./CustomerAccountsPage.css";

function CustomerAccountsPage() {
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [deletingUserId, setDeletingUserId] = useState(null);

  const [formData, setFormData] = useState({
    customerId: "",
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchCustomerAccounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/CustomerAccounts");

        setCustomerAccounts(response.data);
      } catch (error) {
        console.error("Müşteri portal hesapları alınamadı:", error);

        setError(
          error.response?.data?.detail ||
            "Müşteri portal hesapları yüklenirken bir hata oluştu.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerAccounts();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/api/Customers", {
          params: {
            isActive: true,
            pageNumber: 1,
            pageSize: 100,
          },
        });

        setCustomers(response.data.items);
      } catch (error) {
        console.error("Müşteriler alınamadı:", error);

        setError(
          error.response?.data?.detail ||
            "Müşteriler yüklenirken bir hata oluştu.",
        );
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));

    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      await api.post("/api/CustomerAccounts", {
        customerId: Number(formData.customerId),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccessMessage("Müşteri portal hesabı başarıyla oluşturuldu.");

      setFormData({
        customerId: "",
        fullName: "",
        email: "",
        password: "",
      });

      const response = await api.get("/api/CustomerAccounts");
      setCustomerAccounts(response.data);
    } catch (error) {
      console.error("Müşteri portal hesabı oluşturulamadı:", error);

      const responseData = error.response?.data;

      const identityErrors = Array.isArray(responseData?.errors)
        ? responseData.errors
            .map((item) => item.description)
            .filter(Boolean)
            .join(" ")
        : "";

      setError(
        identityErrors ||
          responseData?.detail ||
          "Müşteri portal hesabı oluşturulurken bir hata oluştu.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const customersWithoutAccount = customers.filter(
    (customer) =>
      !customerAccounts.some((account) => account.customerId === customer.id),
  );

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Bu müşterinin portal hesabını silmek istediğinize emin misiniz?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(userId);
      setError("");
      setSuccessMessage("");

      await api.delete(`/api/CustomerAccounts/${userId}`);

      setCustomerAccounts((previousAccounts) =>
        previousAccounts.filter((account) => account.userId !== userId),
      );

      setSuccessMessage("Müşteri portal hesabı başarıyla silindi.");
    } catch (error) {
      console.error("Müşteri portal hesabı silinemedi:", error);

      setError(
        error.response?.data?.detail ||
          "Müşteri portal hesabı silinirken bir hata oluştu.",
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="customer-accounts-page">
      <header className="customer-accounts-header">
        <h1>Müşteri Portal Hesapları</h1>
        <p>Müşterilerin portal erişim hesaplarını oluşturun ve yönetin.</p>
      </header>

      {error && (
        <p className="customer-accounts-message error-message">{error}</p>
      )}

      {successMessage && (
        <p className="customer-accounts-message success-message">
          {successMessage}
        </p>
      )}

      <section className="customer-accounts-card">
        <h2>Yeni Portal Hesabı Oluştur</h2>

        <form className="customer-account-form" onSubmit={handleSubmit}>
          <div className="customer-account-form-group">
            <label htmlFor="customerId">Müşteri</label>

            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
            >
              <option value="">Müşteri seçiniz</option>

              {customersWithoutAccount.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullNameOrCompanyName}
                </option>
              ))}
            </select>
          </div>

          <div className="customer-account-form-group">
            <label htmlFor="fullName">Hesap Sahibinin Adı</label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="customer-account-form-group">
            <label htmlFor="email">E-posta</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={200}
              required
            />
          </div>

          <div className="customer-account-form-group">
            <label htmlFor="password">Şifre</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              maxLength={100}
              required
            />
          </div>

          <button
            className="customer-account-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Oluşturuluyor..." : "Portal Hesabı Oluştur"}
          </button>
        </form>
      </section>

      <section className="customer-accounts-card">
        <h2>Mevcut Portal Hesapları</h2>

        {loading ? (
          <p>Portal hesapları yükleniyor...</p>
        ) : customerAccounts.length === 0 ? (
          <p>Henüz portal hesabı bulunmuyor.</p>
        ) : (
          <div className="customer-accounts-table-wrapper">
            <table className="customer-accounts-table">
              <thead>
                <tr>
                  <th>Müşteri</th>
                  <th>Hesap Sahibi</th>
                  <th>E-posta</th>
                  <th>Oluşturulma Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>

              <tbody>
                {customerAccounts.map((account) => (
                  <tr key={account.userId}>
                    <td data-label="Müşteri">{account.customerName}</td>

                    <td data-label="Hesap Sahibi">{account.fullName}</td>

                    <td data-label="E-posta">{account.email}</td>

                    <td data-label="Oluşturulma Tarihi">
                      {new Date(account.createdAt).toLocaleString("tr-TR")}
                    </td>

                    <td data-label="İşlemler">
                      <button
                        className="customer-account-delete-button"
                        type="button"
                        onClick={() => handleDelete(account.userId)}
                        disabled={deletingUserId === account.userId}
                      >
                        {deletingUserId === account.userId
                          ? "Siliniyor..."
                          : "Hesabı Sil"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default CustomerAccountsPage;
