import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./CreateCustomerPage.css";

const formatTurkishPhone = (value) => {
  let digits = value.replace(/\D/g, "");

  // Kullanıcı +90 veya başında 0 ile yapıştırırsa temizler.
  if (digits.startsWith("90") && digits.length > 10) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  return [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ]
    .filter(Boolean)
    .join(" ");
};

function CreateCustomerPage() {
  const [formData, setFormData] = useState({
    fullNameOrCompanyName: "",
    phone: "",
    email: "",
    address: "",
    city: "Ankara",
    district: "",
    customerType: "Bireysel",
    description: "",
  });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (event) => {
    const formattedPhone = formatTurkishPhone(event.target.value);

    setFormData((previousFormData) => ({
      ...previousFormData,
      phone: formattedPhone,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const phoneDigits = formData.phone.replace(/\D/g, "");

      if (phoneDigits.length !== 10) {
        setError("Telefon numarası 10 haneli olmalıdır.");
        // setIsSubmitting(false);
        return;
      }

      const customerData = {
        ...formData,
        phone: `+90 ${formData.phone}`,
      };

      await api.post("/api/Customers", customerData);
      navigate("/customers");
    } catch (error) {
      console.error("Müşteri oluşturulamadı:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Müşteri kaydedilirken bir hata oluştu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-customer-page">
      <div className="create-customer-header">
        <div>
          <h1>Yeni Müşteri Ekle</h1>
          <p>Müşteri bilgilerini girerek yeni bir kayıt oluşturun.</p>
        </div>

        <Link to="/customers">Müşteri Listesine Dön</Link>
      </div>

      <form className="customer-form" onSubmit={handleSubmit}>
        {error && (
          <div className="form-error form-group-full" role="alert">
            {error}
          </div>
        )}
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

          <div className="phone-input-group">
            <select
              className="country-code-select"
              aria-label="Ülke telefon kodu"
              defaultValue="+90"
            >
              <option value="+90">🇹🇷 +90</option>
            </select>

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="532 123 45 67"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={13}
              pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
              title="Telefon numarasını 532 123 45 67 biçiminde girin."
              required
            />
          </div>

          <small className="form-help-text">
            Numaranın başındaki 0 olmadan girin.
          </small>
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

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Müşteriyi Kaydet"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateCustomerPage;
