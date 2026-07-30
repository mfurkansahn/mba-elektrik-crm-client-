import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./CreateCustomerPage.css";

function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullNameOrCompanyName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    customerType: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/api/Customers/${id}`);
        const customer = response.data;

        setFormData({
          fullNameOrCompanyName: customer.fullNameOrCompanyName || "",
          phone: customer.phone || "",
          email: customer.email || "",
          address: customer.address || "",
          city: customer.city || "",
          district: customer.district || "",
          customerType: customer.customerType || "",
          description: customer.description || "",
        });
      } catch (error) {
        console.error("Müşteri bilgileri alınamadı:", error);

        setError(
          error.response?.data?.detail ||
            error.response?.data?.title ||
            "Müşteri bilgileri yüklenirken bir hata oluştu.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.put(`/api/Customers/${id}`, formData);
      navigate("/customers");
    } catch (error) {
      console.error("Müşteri güncellenirken hata oluştu:", error);
    }
  };

  if (loading) {
    return <p>Müşteri bilgileri yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="create-customer-page">
      <div className="create-customer-header">
        <div>
          <h1>Müşteri Düzenle</h1>
          <p>
            {formData.fullNameOrCompanyName} müşterisinin bilgilerini
            güncelleyin.
          </p>
        </div>

        <Link to="/customers">Müşteri Listesine Dön</Link>
      </div>

      <form className="customer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullNameOrCompanyName">Ad Soyad / Firma Adı</label>
          <input
            id="fullNameOrCompanyName"
            name="fullNameOrCompanyName"
            type="text"
            value={formData.fullNameOrCompanyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefon</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerType">Müşteri Türü</label>
          <select
            id="customerType"
            name="customerType"
            value={formData.customerType}
            onChange={handleChange}
            required
          >
            <option value="Bireysel">Bireysel</option>
            <option value="Kurumsal">Kurumsal</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="city">Şehir</label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="district">İlçe</label>
          <input
            id="district"
            name="district"
            type="text"
            value={formData.district}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="address">Adres</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions form-group-full">
          <Link to="/customers">İptal</Link>
          <button type="submit" className="primary-button">
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditCustomerPage;
