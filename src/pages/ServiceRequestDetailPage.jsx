import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./ServiceRequestDetailPage.css";

const formatUtcDateTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const hasTimeZone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(dateValue);
  const normalizedValue = hasTimeZone ? dateValue : `${dateValue}Z`;

  return new Date(normalizedValue).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
  });
};

function ServiceRequestDetailPage() {
  const { id } = useParams();

  const [serviceRequest, setServiceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newNote, setNewNote] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteError, setNoteError] = useState("");

  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [noteActionError, setNoteActionError] = useState("");

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [noteEditError, setNoteEditError] = useState("");

  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentSubmitting, setDocumentSubmitting] = useState(false);
  const [documentError, setDocumentError] = useState("");

  const [updatingDocumentId, setUpdatingDocumentId] = useState(null);
  const [documentActionError, setDocumentActionError] = useState("");
  const [downloadingDocumentId, setDownloadingDocumentId] = useState(null);

  const [selectedDocumentFiles, setSelectedDocumentFiles] = useState({});
  const [uploadingDocumentId, setUploadingDocumentId] = useState(null);
  const [documentFileError, setDocumentFileError] = useState("");

  const [reminderText, setReminderText] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderSubmitting, setReminderSubmitting] = useState(false);
  const [reminderError, setReminderError] = useState("");

  const [updatingReminderId, setUpdatingReminderId] = useState(null);
  const [reminderActionError, setReminderActionError] = useState("");

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/ServiceRequests/${id}`);
        setServiceRequest(response.data);

        console.log("Hizmet talebi detayı:", response.data);
      } catch (error) {
        console.error("Hizmet talebi detayı alınamadı:", error);
        setError("Hizmet talebi bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequest();
  }, [id]);

  const handleAddNote = async (event) => {
    event.preventDefault();

    if (!newNote.trim()) {
      setNoteError("Lütfen bir not yazın.");
      return;
    }

    try {
      setNoteSubmitting(true);
      setNoteError("");

      const response = await api.post(`/api/ServiceRequests/${id}/notes`, {
        noteText: newNote.trim(),
      });

      setServiceRequest((currentServiceRequest) => ({
        ...currentServiceRequest,
        notes: [...(currentServiceRequest.notes || []), response.data],
      }));

      setNewNote("");
    } catch (error) {
      console.error("Not eklenemedi:", error);
      setNoteError("Not eklenirken bir hata oluştu.");
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleAddDocument = async (event) => {
    event.preventDefault();

    if (!documentName.trim()) {
      setDocumentError("Lütfen evrak adını yazın.");
      return;
    }

    try {
      setDocumentSubmitting(true);
      setDocumentError("");

      const response = await api.post(`/api/ServiceRequests/${id}/documents`, {
        documentName: documentName.trim(),
        description: documentDescription.trim(),
      });

      setServiceRequest((currentServiceRequest) => ({
        ...currentServiceRequest,
        documents: [...(currentServiceRequest.documents || []), response.data],
      }));

      setDocumentName("");
      setDocumentDescription("");
    } catch (error) {
      console.error("Evrak eklenemedi:", error);

      setDocumentError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Evrak eklenirken bir hata oluştu.",
      );
    } finally {
      setDocumentSubmitting(false);
    }
  };

  const handleAddReminder = async (event) => {
    event.preventDefault();

    if (!reminderText.trim()) {
      setReminderError("Lütfen hatırlatma metnini yazın.");
      return;
    }

    if (!reminderDate) {
      setReminderError("Lütfen hatırlatma tarihini seçin.");
      return;
    }

    const selectedDate = new Date(reminderDate);

    if (selectedDate <= new Date()) {
      setReminderError("Hatırlatma tarihi gelecekte olmalıdır.");
      return;
    }

    try {
      setReminderSubmitting(true);
      setReminderError("");

      const response = await api.post(`/api/ServiceRequests/${id}/reminders`, {
        reminderText: reminderText.trim(),
        reminderDate: selectedDate.toISOString(),
      });

      setServiceRequest((currentServiceRequest) => ({
        ...currentServiceRequest,
        reminders: [...(currentServiceRequest.reminders || []), response.data],
      }));

      setReminderText("");
      setReminderDate("");
    } catch (error) {
      console.error("Hatırlatma eklenemedi:", error);

      setReminderError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Hatırlatma eklenirken bir hata oluştu.",
      );
    } finally {
      setReminderSubmitting(false);
    }
  };

  const handleToggleReminderCompletion = async (reminder) => {
    try {
      setUpdatingReminderId(reminder.id);
      setReminderActionError("");

      const response = await api.patch(
        `/api/ServiceRequests/${id}/reminders/${reminder.id}/completion`,
        {
          isCompleted: !reminder.isCompleted,
        },
      );

      setServiceRequest((currentServiceRequest) => ({
        ...currentServiceRequest,
        reminders: (currentServiceRequest.reminders || []).map(
          (currentReminder) =>
            currentReminder.id === reminder.id
              ? response.data
              : currentReminder,
        ),
      }));
    } catch (error) {
      console.error("Hatırlatma durumu güncellenemedi:", error);

      setReminderActionError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Hatırlatma durumu güncellenirken bir hata oluştu.",
      );
    } finally {
      setUpdatingReminderId(null);
    }
  };

  const handleToggleDocumentDelivery = async (document) => {
    try {
      setUpdatingDocumentId(document.id);
      setDocumentActionError("");

      await api.patch(
        `/api/ServiceRequests/${id}/documents/${document.id}/delivery`,
        {
          isDelivered: !document.isDelivered,
        },
      );

      const detailResponse = await api.get(`/api/ServiceRequests/${id}`);
      setServiceRequest(detailResponse.data);
    } catch (error) {
      console.error("Evrak teslim durumu güncellenemedi:", error);

      setDocumentActionError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Evrak teslim durumu güncellenirken bir hata oluştu.",
      );
    } finally {
      setUpdatingDocumentId(null);
    }
  };

  const handleUploadDocumentFile = async (documentId) => {
    const selectedFile = selectedDocumentFiles[documentId];

    if (!selectedFile) {
      setDocumentFileError("Lütfen yüklenecek dosyayı seçin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadingDocumentId(documentId);
      setDocumentFileError("");

      await api.post(
        `/api/ServiceRequests/${id}/documents/${documentId}/file`,
        formData,
      );

      const response = await api.get(`/api/ServiceRequests/${id}`);
      setServiceRequest(response.data);

      setSelectedDocumentFiles((previousFiles) => {
        const updatedFiles = { ...previousFiles };
        delete updatedFiles[documentId];
        return updatedFiles;
      });
    } catch (error) {
      setDocumentFileError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Dosya yüklenirken bir hata oluştu.",
      );
    } finally {
      setUploadingDocumentId(null);
    }
  };

  const handleDownloadDocumentFile = async (documentItem) => {
    if (!documentItem.hasFile) {
      setDocumentFileError("Bu evraka yüklenmiş bir dosya bulunmuyor.");
      return;
    }

    try {
      setDownloadingDocumentId(documentItem.id);
      setDocumentFileError("");

      const response = await api.get(
        `/api/ServiceRequests/${id}/documents/${documentItem.id}/file`,
        {
          responseType: "blob",
        },
      );

      const fileUrl = window.URL.createObjectURL(response.data);
      const downloadLink = window.document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download =
        documentItem.originalFileName || "indirilen-dosya";

      window.document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 100);
    } catch (error) {
      setDocumentFileError(
        error.response?.status === 404
          ? "İndirilecek dosya bulunamadı."
          : "Dosya indirilirken bir hata oluştu.",
      );
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm(
      "Bu notu silmek istediğinize emin misiniz?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingNoteId(noteId);
      setNoteActionError("");

      await api.delete(`/api/ServiceRequests/${id}/notes/${noteId}`);

      setServiceRequest((currentServiceRequest) => ({
        ...currentServiceRequest,
        notes: (currentServiceRequest.notes || []).filter(
          (note) => note.id !== noteId,
        ),
      }));
    } catch (error) {
      console.error("Not silinemedi:", error);

      setNoteActionError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Not silinirken bir hata oluştu.",
      );
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleStartNoteEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.noteText);
    setNoteEditError("");
  };

  const handleCancelNoteEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText("");
    setNoteEditError("");
  };

  const handleSaveNoteEdit = async (noteId) => {
    const trimmedNoteText = editingNoteText.trim();

    if (!trimmedNoteText) {
      setNoteEditError("Not metni boş olamaz.");
      return;
    }

    try {
      setSavingNoteId(noteId);
      setNoteEditError("");

      await api.put(`/api/ServiceRequests/${id}/notes/${noteId}`, {
        noteText: trimmedNoteText,
      });

      const detailResponse = await api.get(`/api/ServiceRequests/${id}`);

      setServiceRequest(detailResponse.data);
      setEditingNoteId(null);
      setEditingNoteText("");
    } catch (error) {
      console.error("Not güncellenemedi:", error);

      setNoteEditError(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Not güncellenirken bir hata oluştu.",
      );
    } finally {
      setSavingNoteId(null);
    }
  };

  if (loading) {
    return <p>Hizmet talebi yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="service-request-detail-page">
      <div className="service-request-detail-header">
        <div>
          <span className="service-request-number">
            Hizmet Talebi #{serviceRequest.id}
          </span>

          <h1>{serviceRequest.title}</h1>
          <p>Hizmet talebinin genel bilgileri ve mevcut durumu</p>
        </div>

        <Link to="/service-requests" className="back-to-service-requests-link">
          Hizmet Taleplerine Dön
        </Link>
      </div>

      <section className="service-request-detail-card">
        <h2>Talep Bilgileri</h2>

        <div className="service-request-info-grid">
          <div className="service-request-info-item">
            <span>Müşteri</span>
            <strong>
              {serviceRequest.customer?.fullNameOrCompanyName ||
                "Müşteri bilgisi bulunamadı."}
            </strong>
          </div>

          <div className="service-request-info-item">
            <span>Hizmet Türü</span>
            <strong>{serviceRequest.serviceType}</strong>
          </div>

          <div className="service-request-info-item">
            <span>Durum</span>
            <strong className="service-request-status">
              {serviceRequest.status}
            </strong>
          </div>

          <div className="service-request-info-item">
            <span>Başlangıç Tarihi</span>
            <strong>
              {new Date(serviceRequest.startDate).toLocaleDateString("tr-TR")}
            </strong>
          </div>

          <div className="service-request-info-item">
            <span>Son Tarih</span>
            <strong>
              {new Date(serviceRequest.dueDate).toLocaleDateString("tr-TR")}
            </strong>
          </div>

          <div className="service-request-info-item">
            <span>Tamamlanma Tarihi</span>
            <strong>
              {serviceRequest.completedDate
                ? new Date(serviceRequest.completedDate).toLocaleDateString(
                    "tr-TR",
                  )
                : "Henüz tamamlanmadı"}
            </strong>
          </div>
        </div>
      </section>

      <section className="service-request-detail-card">
        <h2>Açıklama</h2>

        <p className="service-request-description">
          {serviceRequest.description || "Açıklama girilmemiş."}
        </p>
      </section>
      <section className="service-request-detail-card">
        <div className="service-request-section-header">
          <h2>Notlar</h2>
          <span>{serviceRequest.notes?.length || 0} not</span>
        </div>

        <form className="service-request-note-form" onSubmit={handleAddNote}>
          <label htmlFor="new-note">Yeni Not</label>

          <textarea
            id="new-note"
            value={newNote}
            onChange={(event) => setNewNote(event.target.value)}
            placeholder="Hizmet talebiyle ilgili notunuzu yazın..."
            rows="4"
            maxLength={2000}
          />

          {noteError && (
            <p className="service-request-note-error">{noteError}</p>
          )}

          <button type="submit" disabled={noteSubmitting}>
            {noteSubmitting ? "Not Ekleniyor..." : "Not Ekle"}
          </button>
        </form>

        {noteActionError && (
          <p className="service-request-note-error">{noteActionError}</p>
        )}

        {serviceRequest.notes?.length > 0 ? (
          <div className="service-request-items-list">
            {serviceRequest.notes.map((note) => (
              <article key={note.id} className="service-request-list-item">
                {editingNoteId === note.id ? (
                  <div className="note-edit-container">
                    <label htmlFor={`edit-note-${note.id}`}>
                      Not Metnini Düzenle
                    </label>

                    <textarea
                      id={`edit-note-${note.id}`}
                      className="note-edit-textarea"
                      value={editingNoteText}
                      onChange={(event) => {
                        setEditingNoteText(event.target.value);

                        if (noteEditError) {
                          setNoteEditError("");
                        }
                      }}
                      rows="4"
                      maxLength={2000}
                      disabled={savingNoteId === note.id}
                    />

                    {noteEditError && (
                      <p className="service-request-note-error">
                        {noteEditError}
                      </p>
                    )}

                    <div className="note-edit-actions">
                      <button
                        type="button"
                        className="note-save-button"
                        onClick={() => handleSaveNoteEdit(note.id)}
                        disabled={savingNoteId === note.id}
                      >
                        {savingNoteId === note.id
                          ? "Kaydediliyor..."
                          : "Kaydet"}
                      </button>

                      <button
                        type="button"
                        className="note-cancel-button"
                        onClick={handleCancelNoteEdit}
                        disabled={savingNoteId === note.id}
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{note.noteText}</p>

                    <time>{formatUtcDateTime(note.createdAt)}</time>

                    <div className="note-item-actions">
                      <button
                        type="button"
                        className="note-edit-button"
                        onClick={() => handleStartNoteEdit(note)}
                        disabled={
                          deletingNoteId === note.id ||
                          (editingNoteId !== null && editingNoteId !== note.id)
                        }
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        className="note-delete-button"
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={deletingNoteId === note.id}
                      >
                        {deletingNoteId === note.id
                          ? "Siliniyor..."
                          : "Notu Sil"}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="service-request-empty-message">
            Bu hizmet talebine henüz not eklenmemiş.
          </p>
        )}
      </section>

      <section className="service-request-detail-card">
        <div className="service-request-section-header">
          <h2>Evraklar</h2>
          <span>{serviceRequest.documents?.length || 0} evrak</span>
        </div>

        <form
          className="service-request-document-form"
          onSubmit={handleAddDocument}
        >
          <label htmlFor="document-name">Evrak Adı</label>

          <input
            id="document-name"
            type="text"
            value={documentName}
            onChange={(event) => setDocumentName(event.target.value)}
            placeholder="Örneğin: Kimlik fotokopisi"
          />

          <label htmlFor="document-description">Açıklama</label>

          <textarea
            id="document-description"
            value={documentDescription}
            onChange={(event) => setDocumentDescription(event.target.value)}
            placeholder="Evrakla ilgili açıklama yazabilirsiniz..."
            rows="3"
          />

          {documentError && (
            <p className="service-request-document-error">{documentError}</p>
          )}

          <button type="submit" disabled={documentSubmitting}>
            {documentSubmitting ? "Evrak Ekleniyor..." : "Evrak Ekle"}
          </button>
        </form>

        {documentActionError && (
          <p className="service-request-document-error">
            {documentActionError}
          </p>
        )}

        {documentFileError && (
          <p className="service-request-document-error">{documentFileError}</p>
        )}

        {serviceRequest.documents?.length > 0 ? (
          <div className="service-request-items-list">
            {serviceRequest.documents.map((document) => (
              <article
                key={document.id}
                className="service-request-list-item service-request-document-item"
              >
                <div className="service-request-document-header">
                  <strong>{document.documentName}</strong>

                  <span
                    className={
                      document.isDelivered
                        ? "document-status delivered"
                        : "document-status pending"
                    }
                  >
                    {document.isDelivered ? "Teslim Edildi" : "Bekleniyor"}
                  </span>
                </div>

                <p>{document.description || "Açıklama girilmemiş."}</p>

                {document.hasFile && (
                  <p className="document-file-info">
                    <strong>Yüklü Dosya:</strong>{" "}
                    {document.originalFileName || "Dosya"}
                  </p>
                )}

                <time>Eklenme: {formatUtcDateTime(document.createdAt)}</time>

                {document.deliveredDate && (
                  <time dateTime={document.deliveredDate}>
                    Teslim Tarihi: {formatUtcDateTime(document.deliveredDate)}
                  </time>
                )}

                <button
                  type="button"
                  className="document-delivery-button"
                  onClick={() => handleToggleDocumentDelivery(document)}
                  disabled={updatingDocumentId === document.id}
                >
                  {updatingDocumentId === document.id
                    ? "Güncelleniyor..."
                    : document.isDelivered
                      ? "Bekliyor Olarak İşaretle"
                      : "Teslim Edildi Olarak İşaretle"}
                </button>

                <div className="document-file-actions">
                  {document.hasFile && (
                    <button
                      type="button"
                      className="document-download-button"
                      onClick={() => handleDownloadDocumentFile(document)}
                      disabled={downloadingDocumentId !== null}
                    >
                      {downloadingDocumentId === document.id
                        ? "İndiriliyor..."
                        : "Dosyayı İndir"}
                    </button>
                  )}

                  <input
                    type="file"
                    disabled={uploadingDocumentId !== null}
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0];

                      if (!selectedFile) {
                        return;
                      }

                      setSelectedDocumentFiles((previousFiles) => ({
                        ...previousFiles,
                        [document.id]: selectedFile,
                      }));

                      setDocumentFileError("");
                    }}
                  />

                  <button
                    type="button"
                    className="document-upload-button"
                    onClick={() => {
                      if (document.hasFile) {
                        const currentFileName =
                          document.originalFileName || "Mevcut dosya";

                        const newFileName =
                          selectedDocumentFiles[document.id]?.name ||
                          "seçilen dosya";

                        const isConfirmed = window.confirm(
                          `"${currentFileName}" dosyası "${newFileName}" ile değiştirilecek.\n\nBu işlemden emin misiniz?`,
                        );

                        if (!isConfirmed) {
                          return;
                        }
                      }

                      handleUploadDocumentFile(document.id);
                    }}
                    disabled={
                      uploadingDocumentId !== null ||
                      !selectedDocumentFiles[document.id]
                    }
                  >
                    {uploadingDocumentId === document.id
                      ? "Yükleniyor..."
                      : document.hasFile
                        ? "Dosyayı Değiştir"
                        : "Dosyayı Yükle"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="service-request-empty-message">
            Bu hizmet talebine henüz evrak eklenmemiş.
          </p>
        )}
      </section>

      <section className="service-request-detail-card">
        <div className="service-request-section-header">
          <h2>Hatırlatmalar</h2>
          <span>{serviceRequest.reminders?.length || 0} hatırlatma</span>
        </div>

        <form
          className="service-request-reminder-form"
          onSubmit={handleAddReminder}
        >
          <label htmlFor="reminder-text">Hatırlatma Metni</label>

          <textarea
            id="reminder-text"
            value={reminderText}
            onChange={(event) => setReminderText(event.target.value)}
            placeholder="Örneğin: Müşteriyi evraklar için ara"
            rows="3"
          />

          <label htmlFor="reminder-date">Hatırlatma Tarihi</label>

          <input
            id="reminder-date"
            type="datetime-local"
            value={reminderDate}
            onChange={(event) => setReminderDate(event.target.value)}
          />

          {reminderError && (
            <p className="service-request-reminder-error">{reminderError}</p>
          )}

          <button type="submit" disabled={reminderSubmitting}>
            {reminderSubmitting ? "Hatırlatma Ekleniyor..." : "Hatırlatma Ekle"}
          </button>
        </form>

        {reminderActionError && (
          <p className="service-request-reminder-error">
            {reminderActionError}
          </p>
        )}

        {serviceRequest.reminders?.length > 0 ? (
          <div className="service-request-items-list">
            {serviceRequest.reminders.map((reminder) => (
              <article
                key={reminder.id}
                className="service-request-list-item service-request-reminder-item"
              >
                <div className="service-request-reminder-header">
                  <strong>{reminder.reminderText}</strong>

                  <span
                    className={
                      reminder.isCompleted
                        ? "reminder-status completed"
                        : "reminder-status pending"
                    }
                  >
                    {reminder.isCompleted ? "Tamamlandı" : "Bekliyor"}
                  </span>
                </div>

                <p>
                  Hatırlatma tarihi:{" "}
                  <time dateTime={reminder.reminderDate}>
                    {new Date(reminder.reminderDate).toLocaleString("tr-TR")}
                  </time>
                </p>

                {reminder.completedDate && (
                  <time dateTime={reminder.completedDate}>
                    Tamamlanma: {formatUtcDateTime(reminder.completedDate)}
                  </time>
                )}

                <button
                  type="button"
                  className="reminder-completion-button"
                  onClick={() => handleToggleReminderCompletion(reminder)}
                  disabled={updatingReminderId === reminder.id}
                >
                  {updatingReminderId === reminder.id
                    ? "Güncelleniyor..."
                    : reminder.isCompleted
                      ? "Bekliyor Olarak İşaretle"
                      : "Tamamlandı Olarak İşaretle"}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="service-request-empty-message">
            Bu hizmet talebine henüz hatırlatma eklenmemiş.
          </p>
        )}
      </section>
    </main>
  );
}

export default ServiceRequestDetailPage;
