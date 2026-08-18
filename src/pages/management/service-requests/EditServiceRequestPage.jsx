import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import "./EditServiceRequestPage.css";

const formatDateTimeLocal = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

function EditServiceRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serviceRequest, setServiceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    serviceType: "",
    status: "",
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const [serviceRequestResponse, serviceTypesResponse, statusesResponse] =
          await Promise.all([
            api.get(`/api/ServiceRequests/${id}`),
            api.get("/api/ReferenceData/service-request-types"),
            api.get("/api/ReferenceData/service-request-statuses"),
          ]);

        const data = serviceRequestResponse.data;

        setServiceRequest(data);
        setServiceTypes(serviceTypesResponse.data);
        setStatuses(statusesResponse.data);

        setFormData({
          serviceType: data.serviceType || "",
          status: data.status || "",
          title: data.title || "",
          description: data.description || "",
          startDate: formatDateTimeLocal(data.startDate),
          dueDate: formatDateTimeLocal(data.dueDate),
        });
      } catch (error) {
        console.error("Veriler yüklenemedi:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        setError(
          `${error.config?.url || "İstek"} yüklenemedi. ` +
            `Durum: ${error.response?.status || error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequest();
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

    if (!formData.title.trim()) {
      setSubmitError("Başlık alanı boş bırakılamaz.");
      return;
    }

    if (
      formData.dueDate &&
      new Date(formData.dueDate) < new Date(formData.startDate)
    ) {
      setSubmitError("Bitiş tarihi başlangıç tarihinden önce olamaz.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      await api.put(`/api/ServiceRequests/${id}`, {
        serviceType: formData.serviceType,
        status: formData.status,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        startDate: formData.startDate,
        dueDate: formData.dueDate || null,
      });

      navigate(`/service-requests/${id}`);
    } catch (error) {
      console.error("Hizmet talebi güncellenemedi:", error);

      setSubmitError(
        error.response?.data?.detail ||
          "Hizmet talebi güncellenirken bir hata oluştu.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Hizmet talebi yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="edit-service-request-page">
      <section className="edit-service-request-container">
        <header className="edit-service-request-header">
          <div>
            <span className="edit-service-request-eyebrow">
              Hizmet Talebi #{serviceRequest.id}
            </span>

            <h1>Hizmet Talebini Düzenle</h1>

            <p>
              Talebe ait bilgileri güncelleyebilir ve değişiklikleri
              kaydedebilirsiniz.
            </p>
          </div>

          <button
            type="button"
            className="edit-back-button"
            onClick={() => navigate(`/service-requests/${id}`)}
            disabled={submitting}
          >
            Detaya Dön
          </button>
        </header>

        <section className="edit-service-request-customer">
          <span>Müşteri</span>

          <strong>{serviceRequest.customer.fullNameOrCompanyName}</strong>
        </section>

        <form className="edit-service-request-form" onSubmit={handleSubmit}>
          <div className="edit-form-grid">
            <div className="edit-form-group edit-form-group-full">
              <label htmlFor="title">Başlık</label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-form-group edit-form-group-full">
              <label htmlFor="description">Açıklama</label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="edit-form-group">
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

            <div className="edit-form-group">
              <label htmlFor="status">Durum</label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Durum seçiniz</option>

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-form-group">
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

            <div className="edit-form-group">
              <label htmlFor="dueDate">Bitiş Tarihi</label>

              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {submitError && (
            <p className="edit-form-error" role="alert">
              {submitError}
            </p>
          )}

          <div className="edit-form-actions">
            <button
              type="button"
              className="edit-cancel-button"
              onClick={() => navigate(`/service-requests/${id}`)}
              disabled={submitting}
            >
              İptal
            </button>

            <button
              type="submit"
              className="edit-submit-button"
              disabled={submitting}
            >
              {submitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditServiceRequestPage;
