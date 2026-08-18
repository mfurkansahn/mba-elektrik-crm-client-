# MBA Mühendislik CRM ve İş Takip Uygulaması

MBA Mühendislik CRM ve İş Takip Uygulaması; müşterilerin, hizmet taleplerinin, evrakların, notların ve hatırlatmaların tek bir sistem üzerinden yönetilebilmesi amacıyla geliştirilmiş rol tabanlı bir React uygulamasıdır.

Bu repository; firma personelinin kullandığı yönetim panelini, Admin işlemlerini ve müşterilerin kendi iş süreçlerini takip edebildiği Customer Portal arayüzünü içerir.

## Proje Ekosistemi

MBA CRM sistemi üç ayrı projeden oluşmaktadır:

| Proje        | Açıklama                                        |
| ------------ | ----------------------------------------------- |
| `MbaCrm.Web` | MBA Mühendislik public firma sitesi             |
| `MbaCrm.App` | Yönetim paneli, giriş ekranı ve Customer Portal |
| `MbaCrm.Api` | ASP.NET Core Web API ve veritabanı işlemleri    |

Public firma sitesi ile yönetim uygulaması birbirinden ayrılmıştır. Public sitedeki **Uygulama Girişi** bağlantısı kullanıcıyı bu uygulamanın giriş ekranına yönlendirir.

## Kullanıcı Rolleri

Uygulamada üç temel rol bulunmaktadır.

### Admin

Admin sistem üzerinde en geniş yetkiye sahiptir.

- Dashboard verilerini görüntüleyebilir.
- Müşteri ekleyebilir ve düzenleyebilir.
- Müşterileri pasife alabilir.
- Pasif müşterileri yeniden aktif edebilir.
- Hizmet taleplerini oluşturabilir ve düzenleyebilir.
- Hizmet talebi durumlarını değiştirebilir.
- Not, evrak ve hatırlatma işlemlerini yönetebilir.
- Evrak dosyası yükleyebilir, indirebilir, değiştirebilir ve kaldırabilir.
- Customer Portal hesabı oluşturabilir ve silebilir.

### User

User, firma personelini temsil eder.

- Dashboard verilerini görüntüleyebilir.
- Müşterileri görüntüleyebilir, ekleyebilir ve düzenleyebilir.
- Pasif müşterileri görüntüleyebilir.
- Hizmet taleplerini oluşturabilir ve düzenleyebilir.
- Durum, not, evrak ve hatırlatma işlemlerini yönetebilir.

User aşağıdaki Admin işlemlerini gerçekleştiremez:

- Müşteriyi pasife alma
- Pasif müşteriyi yeniden aktif etme
- Customer Portal hesaplarını yönetme
- Admin’e özel silme işlemleri

### Customer

Customer yalnızca kendisine ait portal alanına erişebilir.

- Profil bilgilerini görüntüleyebilir.
- Kendi hizmet taleplerini listeleyebilir.
- Kendi hizmet taleplerinin detaylarını görüntüleyebilir.

Customer, yönetim paneline veya başka müşterilerin verilerine erişemez.

## Temel Özellikler

### Kimlik Doğrulama ve Yetkilendirme

- JWT Bearer Authentication
- Rol tabanlı sayfa koruması
- `ProtectedRoute` ile token ve rol kontrolü
- `PublicRoute` ile giriş yapmış kullanıcıyı rolüne uygun alana yönlendirme
- Yetkisiz erişimlerde `/unauthorized` sayfasına yönlendirme
- Geçersiz veya süresi dolmuş token durumunda otomatik çıkış
- Axios interceptor ile API isteklerine Bearer token ekleme

### Dashboard

- Toplam müşteri sayısı
- Aktif ve pasif müşteri sayıları
- Toplam hizmet talebi sayısı
- Hizmet talebi durumlarına göre özetler
- Geciken hatırlatmalar
- Bugünkü hatırlatmalar
- Yaklaşan hatırlatmalar
- Durum kartlarından filtrelenmiş hizmet talebi listesine geçiş

### Müşteri Yönetimi

- Aktif müşteri listesi
- Yeni müşteri oluşturma
- Müşteri bilgilerini düzenleme
- Müşteriyi pasife alma
- Pasif müşterileri görüntüleme
- Pasif müşteriyi yeniden aktif etme
- Admin ve User rollerine göre işlem butonlarını koşullu gösterme
- Geçmiş kayıtları koruyan soft delete yaklaşımı

### Hizmet Talebi Yönetimi

- Yeni hizmet talebi oluşturma
- Hizmet talebi detaylarını görüntüleme
- Hizmet talebini düzenleme
- Durum değiştirme
- Müşteri, başlık ve açıklamada arama
- Durum ve hizmet türü filtreleri
- Oluşturulma tarihi filtreleri
- Farklı alanlara göre sıralama
- Mobilde açılır-kapanır gelişmiş filtreler

### Not Yönetimi

- Hizmet talebine not ekleme
- Notları listeleme
- Notların oluşturulma tarihlerini görüntüleme

### Evrak ve Dosya Yönetimi

- Hizmet talebine evrak kaydı ekleme
- Evrak açıklaması ve teslim durumunu yönetme
- Gerçek dosya yükleme
- Dosya indirme
- Mevcut dosyayı değiştirme
- Dosyayı kaldırma
- Dosya türü ve boyut kontrolleri

Desteklenen dosya türleri backend kurallarına göre PDF, JPG/JPEG, PNG ve DOCX formatlarını kapsamaktadır.

### Hatırlatma Yönetimi

- Hizmet talebine hatırlatma ekleme
- Hatırlatma tarihini belirleme
- Hatırlatmayı tamamlandı olarak işaretleme
- Geciken, bugünkü ve yaklaşan hatırlatmaları Dashboard üzerinden takip etme

### Customer Portal Hesapları

Bu bölüm yalnızca Admin rolüne açıktır.

- Aktif müşteriye portal hesabı oluşturma
- Portal hesabı bulunan müşterileri listeleme
- Portal hesabını silme
- Aynı müşteri için birden fazla portal hesabı oluşturulmasını engelleme

Portal hesabının silinmesi müşteriyi veya müşterinin hizmet taleplerini silmez. Yalnızca müşterinin giriş hesabı kaldırılır.

### Customer Portal

- Müşteri profil bilgilerini görüntüleme
- Yalnızca giriş yapan müşteriye ait hizmet taleplerini listeleme
- Hizmet talebi detaylarını görüntüleme
- Başka müşteriye ait kayıtların görüntülenmesini backend seviyesinde engelleme
- Masaüstünde tablo, mobil ve tablette kart görünümü

## Responsive Tasarım

Uygulama masaüstü, tablet ve telefon ekranları için responsive olarak geliştirilmiştir.

- Mobil açılır-kapanır navigasyon
- Dokunmaya uygun buton boyutları
- Masaüstünde tablo görünümü
- Tablette iki sütunlu kart görünümü
- Telefonda tek sütunlu kart görünümü
- Uzun metin ve e-posta adresleri için güvenli satır kırma
- Mobilde tek sütuna geçen formlar
- Yatay kaydırma yerine responsive kart yapısı
- Mobilde açılır-kapanır gelişmiş filtreler

## Kullanılan Teknolojiler

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS
- JWT Authentication
- ASP.NET Core Web API entegrasyonu

Backend projesinde ayrıca:

- .NET 8
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity
- Swagger/OpenAPI

kullanılmaktadır.

## Proje Klasör Yapısı

```text
src/
├── components/
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   ├── DashboardLayout.css
│   │   ├── CustomerPortalLayout.jsx
│   │   └── CustomerPortalLayout.css
│   └── routing/
│       ├── ProtectedRoute.jsx
│       └── PublicRoute.jsx
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── UnauthorizedPage.jsx
│   │   └── UnauthorizedPage.css
│   │
│   ├── customer-portal/
│   │   ├── CustomerPortalProfilePage.jsx
│   │   ├── CustomerPortalServiceRequestsPage.jsx
│   │   └── CustomerPortalServiceRequestDetailPage.jsx
│   │
│   └── management/
│       ├── customer-accounts/
│       ├── customers/
│       ├── dashboard/
│       └── service-requests/
│
├── services/
│   └── api.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Temel Rotalar

### Ortak Rotalar

```text
/
 /login
 /unauthorized
```

### Admin ve User Rotaları

```text
/dashboard
/customers
/customers/new
/customers/passive
/customers/:id/edit
/service-requests
/service-requests/new
/service-requests/:id
/service-requests/:id/edit
```

### Yalnızca Admin

```text
/customer-accounts
```

### Yalnızca Customer

```text
/customer-portal
/customer-portal/service-requests
/customer-portal/service-requests/:id
```

## Kurulum

Öncelikle Node.js ve npm kurulu olmalıdır.

Bağımlılıkları yüklemek için:

```bash
npm install
```

Proje kök dizininde bir `.env` dosyası oluşturun:

```env
VITE_API_BASE_URL=https://localhost:API_PORT
```

`VITE_API_BASE_URL` değerini `MbaCrm.Api` projesinin çalıştığı URL ile değiştirin.

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Uygulama geliştirme ortamında varsayılan olarak aşağıdaki adreste çalışır:

```text
http://localhost:5173
```

Uygulamanın çalışabilmesi için `MbaCrm.Api` projesinin de çalışıyor olması gerekir.

## Production Build

Production build oluşturmak için:

```bash
npm run build
```

Build çıktısı:

```text
dist/
```

klasöründe oluşturulur.

## Güvenlik Notları

- Sayfa erişimleri rol bazlı olarak korunmaktadır.
- Frontend’de gizlenen kritik işlemler backend üzerinde de ayrıca yetkilendirilmiştir.
- Customer yalnızca kendi `CustomerId` değeriyle ilişkili kayıtları görüntüleyebilir.
- Başka müşteriye ait hizmet talebi ID’si kullanıldığında veri döndürülmez.
- Dosya yükleme işlemlerinde dosya türü ve boyut kontrolleri backend tarafından yapılır.
- Geçersiz token durumunda kullanıcı oturumu otomatik olarak sonlandırılır.

## Proje Durumu

Aşağıdaki temel modüller tamamlanmıştır:

- Kimlik doğrulama ve rol yönlendirmeleri
- Admin/User yönetim paneli
- Müşteri yönetimi
- Aktif/pasif müşteri işlemleri
- Hizmet talebi yönetimi
- Not, evrak ve hatırlatma işlemleri
- Gerçek dosya yükleme
- Customer Portal hesap yönetimi
- Customer Portal
- Mobil ve tablet responsive düzenlemeleri
- Public firma sitesi ile uygulamanın ayrılması
- Özellik bazlı frontend klasör yapısı

## Planlanan Geliştirmeler

- Genel 404 / Not Found sayfası
- Görünür sayfalama kontrollerinin tamamlanması
- Personel hesap yönetimi
- Parolamı unuttum işlemi
- Kullanıcı parola değiştirme
- Production ortam ayarları
- Canlı sunucuya deployment

## Geliştirici

**Mustafa Furkan Şahin**

Bilgisayar Mühendisi
