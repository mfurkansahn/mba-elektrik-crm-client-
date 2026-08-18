import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./CreateServiceRequestPage.css";

function CreateServiceRequestPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerId: "",
    serviceType: "",
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });

  const [customers, setCustomers] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const [customersResponse, serviceTypesResponse] = await Promise.all([
          api.get("/api/Customers", {
            params: {
              pageNumber: 1,
              pageSize: 10,
            },
          }),
          api.get("/api/ReferenceData/service-request-types"),
        ]);

        setCustomers(customersResponse.data.items);
        setServiceTypes(serviceTypesResponse.data);
      } catch (error) {
        console.error("Form seçenekleri alınamadı:", error);

        const failedUrl = error.config?.url || "Bilinmeyen API adresi";
        const statusCode = error.response?.status || "Sunucuya ulaşılamadı";

        setError(
          `Form bilgileri yüklenemedi. Hata: ${statusCode} — ${failedUrl}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFormOptions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");

    try {
      await api.post("/api/ServiceRequests", {
        customerId: Number(formData.customerId),
        serviceType: formData.serviceType,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
      });

      navigate("/service-requests");
    } catch (error) {
      console.error("Hizmet talebi oluşturulamadı:", error);

      const validationErrors = error.response?.data?.errors;

      const firstValidationMessage = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      const apiErrorMessage =
        firstValidationMessage ||
        error.response?.data?.detail ||
        error.response?.data?.title;

      setSubmitError(
        apiErrorMessage || "Hizmet talebi oluşturulurken bir hata oluştu.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Form bilgileri yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <main className="create-service-request-page">
      <div className="create-service-request-header">
        <h1>Yeni Hizmet Talebi Ekle</h1>
        <p>Müşteri için yeni bir hizmet talebi oluşturun.</p>
      </div>

      <form className="service-request-form" onSubmit={handleSubmit}>
        {submitError && (
          <p className="service-request-form-error">{submitError}</p>
        )}

        <div className="service-request-form-group">
          <label htmlFor="customerId">Müşteri</label>

          <select
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
          >
            <option value="">Müşteri seçiniz</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.fullNameOrCompanyName}
              </option>
            ))}
          </select>
        </div>

        <div className="service-request-form-group">
          <label htmlFor="serviceType">Hizmet Türü</label>

          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Hizmet türü seçiniz</option>

            {serviceTypes.map((serviceType) => (
              <option key={serviceType} value={serviceType}>
                {serviceType}
              </option>
            ))}
          </select>
        </div>

        <div className="service-request-form-group">
          <label htmlFor="title">Başlık</label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Hizmet talebinin başlığını giriniz"
            required
          />
        </div>

        <div className="service-request-form-group">
          <label htmlFor="description">Açıklama</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Hizmet talebiyle ilgili açıklama giriniz"
            rows="5"
          />
        </div>

        <div className="service-request-form-row">
          <div className="service-request-form-group">
            <label htmlFor="startDate">Başlangıç Tarihi</label>

            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="service-request-form-group">
            <label htmlFor="dueDate">Son Tarih</label>

            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="service-request-form-actions">
          <button
            type="button"
            className="cancel-service-request-button"
            onClick={() => navigate("/service-requests")}
            disabled={submitting}
          >
            İptal
          </button>

          <button
            type="submit"
            className="submit-service-request-button"
            disabled={submitting}
          >
            {submitting ? "Kaydediliyor..." : "Hizmet Talebini Kaydet"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateServiceRequestPage;
