import { Link } from "react-router-dom";
import "./HomePage.css";

const companyServices = [
  {
    number: "01",
    title: "Elektrik Proje ve İç Tesisat",
    description:
      "Konut, iş yeri ve ticari yapılar için mevzuata uygun elektrik projelendirme ve iç tesisat çözümleri.",
  },
  {
    number: "02",
    title: "Enerjisa Başvuru Takibi",
    description:
      "Yeni bağlantı, abonelik ve enerji müsaadesi süreçlerinin hazırlık, başvuru ve takip hizmetleri.",
  },
  {
    number: "03",
    title: "Güç Artırımı ve Değişikliği",
    description:
      "Mevcut tesislerin enerji ihtiyacına göre güç analizi, proje güncellemesi ve başvuru yönetimi.",
  },
  {
    number: "04",
    title: "Şantiye Elektriği",
    description:
      "Şantiye aboneliği, geçici elektrik tesisatı ve proje süreçleri için uçtan uca mühendislik desteği.",
  },
  {
    number: "05",
    title: "Tarımsal Sulama",
    description:
      "Tarımsal sulama tesisleri için elektrik projesi, bağlantı başvurusu ve saha süreci danışmanlığı.",
  },
  {
    number: "06",
    title: "EV Şarj Sistemleri",
    description:
      "Elektrikli araç şarj altyapısı için güç değerlendirmesi, projelendirme ve uygulama danışmanlığı.",
  },
];

const companyProcessSteps = [
  {
    number: "1",
    title: "İhtiyacınızı dinliyoruz",
    description:
      "Projenizin kapsamını, yapısını ve mevcut durumunu birlikte değerlendiriyoruz.",
  },
  {
    number: "2",
    title: "Teknik çözümü hazırlıyoruz",
    description:
      "Mevzuata ve saha koşullarına uygun proje ile gerekli evrakları oluşturuyoruz.",
  },
  {
    number: "3",
    title: "Başvuruyu yönetiyoruz",
    description:
      "İlgili kurum süreçlerini takip ediyor, gerekli güncellemeleri zamanında yapıyoruz.",
  },
  {
    number: "4",
    title: "Sonuca kadar takip ediyoruz",
    description:
      "Onay, kabul ve teslim aşamalarında sizi düzenli olarak bilgilendiriyoruz.",
  },
];

function HomePage() {
  return (
    <main className="company-home-page">
      <header className="company-header">
        <div className="company-header-inner">
          <Link
            to="/"
            className="company-brand"
            aria-label="MBA Mühendislik ana sayfa"
          >
            <img src="/mba-muhendislik-logo.png" alt="MBA Mühendislik logosu" />

            <span className="company-brand-text">
              <strong>MBA Mühendislik</strong>
              <small>Elektrik Proje & Danışmanlık</small>
            </span>
          </Link>

          <nav className="company-nav" aria-label="Firma sitesi menüsü">
            <a href="#hizmetler">Hizmetler</a>
            <a href="#hakkimizda">Hakkımızda</a>
            <a href="#surec">Çalışma Süreci</a>
            <a href="#iletisim">İletişim</a>
          </nav>

          <Link to="/login" className="application-login-link">
            Uygulama Girişi
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>
      <section className="company-hero" id="anasayfa">
        <div className="company-hero-grid" aria-hidden="true" />

        <div className="company-page-shell company-hero-content">
          <div className="company-hero-copy">
            <p className="company-eyebrow">
              <span />
              Ankara&apos;da Elektrik Proje ve Mühendislik
            </p>

            <h1>
              Enerjiyi <em>doğru projeyle</em> güvenle yönetiyoruz.
            </h1>

            <p className="company-hero-description">
              Elektrik projelerinden Enerjisa başvurularına, güç değişikliğinden
              abonelik süreçlerine kadar ihtiyacınız olan mühendislik desteğini
              tek noktadan sunuyoruz.
            </p>

            <div className="company-hero-actions">
              <a href="#hizmetler" className="company-primary-button">
                Hizmetleri İncele
                <span aria-hidden="true">→</span>
              </a>

              <a href="tel:+905301207402" className="company-secondary-button">
                Bizi Arayın
              </a>
            </div>

            <div
              className="company-hero-features"
              aria-label="Hizmet özellikleri"
            >
              <span>Mevzuata uygun proje</span>
              <span>Şeffaf süreç takibi</span>
              <span>Ankara merkezli hizmet</span>
            </div>
          </div>

          <aside className="company-hero-visual" aria-label="MBA Mühendislik">
            <div className="company-identity-card">
              <span className="company-identity-label">MBA MÜHENDİSLİK</span>

              <img
                src="/mba-muhendislik-logo.png"
                alt="MBA Mühendislik logosu"
              />

              <div className="company-identity-footer">
                <span>Elektrik Proje</span>
                <span>Başvuru Takibi</span>
              </div>
            </div>

            <div className="company-location-card">
              <span className="company-location-icon" aria-hidden="true">
                ●
              </span>

              <div>
                <small>Hizmet bölgesi</small>
                <strong>Ankara ve çevresi</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="company-trust-strip"
        aria-label="MBA Mühendislik avantajları"
      >
        <div className="company-page-shell company-trust-grid">
          <div>
            <strong>Tek noktadan</strong>
            <span>Proje ve başvuru yönetimi</span>
          </div>

          <div>
            <strong>Adım adım</strong>
            <span>Şeffaf süreç takibi</span>
          </div>

          <div>
            <strong>Teknik odaklı</strong>
            <span>Mühendislik yaklaşımı</span>
          </div>

          <div>
            <strong>Ankara</strong>
            <span>Yerinde ve ulaşılabilir hizmet</span>
          </div>
        </div>
      </section>
      <section
        className="company-section company-services-section"
        id="hizmetler"
      >
        <div className="company-page-shell">
          <div className="company-section-heading">
            <div>
              <p className="company-section-kicker">Hizmetlerimiz</p>

              <h2>Elektrik süreçleriniz için kapsamlı çözümler</h2>
            </div>

            <p>
              Projenin ilk değerlendirmesinden kurum onayına kadar teknik ve
              idari süreci bütün olarak ele alıyoruz.
            </p>
          </div>

          <div className="company-services-grid">
            {companyServices.map((service) => (
              <article className="company-service-card" key={service.number}>
                <div className="company-service-topline">
                  <span>{service.number}</span>
                  <span aria-hidden="true">↗</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>

          <div className="company-services-callout">
            <p>
              İhtiyacınız listede yok mu? Projenizi birlikte değerlendirelim.
            </p>

            <a href="tel:+905301207402">Mühendisimize danışın →</a>
          </div>
        </div>
      </section>

      <section
        className="company-section company-about-section"
        id="hakkimizda"
      >
        <div className="company-page-shell company-about-grid">
          <div className="company-about-panel">
            <p className="company-panel-index">MBA / 06</p>

            <div className="company-circuit-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <p className="company-panel-quote">
              “Doğru proje, güvenli ve sürdürülebilir bir elektrik altyapısının
              başlangıcıdır.”
            </p>
          </div>

          <div className="company-about-copy">
            <p className="company-section-kicker">Hakkımızda</p>

            <h2>
              Teknik uzmanlığı, anlaşılır bir hizmet süreciyle birleştiriyoruz.
            </h2>

            <p>
              MBA Mühendislik; Ankara&apos;da elektrik proje, danışmanlık ve
              başvuru takibi alanlarında hizmet verir. Her işi kendi teknik
              koşullarıyla değerlendirir, gerekli adımları açık biçimde planlar
              ve süreci sonuçlanana kadar takip eder.
            </p>

            <ul className="company-check-list">
              <li>İhtiyaca özel teknik değerlendirme</li>
              <li>Mevzuat ve kurum süreçleriyle uyum</li>
              <li>Düzenli bilgilendirme ve ulaşılabilir destek</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="company-section company-process-section" id="surec">
        <div className="company-page-shell">
          <div className="company-process-heading">
            <p className="company-section-kicker">Nasıl Çalışıyoruz?</p>

            <h2>Başvurudan onaya, her adım kontrol altında</h2>

            <p>
              Karmaşık görünen elektrik proje ve başvuru süreçlerini dört net
              aşamada yönetiyoruz.
            </p>
          </div>

          <div className="company-process-grid">
            {companyProcessSteps.map((step) => (
              <article className="company-process-card" key={step.number}>
                <span className="company-process-number">{step.number}</span>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="company-contact-section" id="iletisim">
        <div className="company-page-shell company-contact-grid">
          <div className="company-contact-copy">
            <p className="company-section-kicker company-light-kicker">
              İletişim
            </p>

            <h2>Elektrik projeniz için ilk adımı birlikte atalım.</h2>

            <p>
              İhtiyacınızı anlatın; projenizin kapsamını değerlendirelim ve
              izlemeniz gereken yolu birlikte netleştirelim.
            </p>

            <a href="tel:+905301207402" className="company-primary-button">
              0530 120 74 02&apos;yi Arayın
            </a>
          </div>

          <div className="company-contact-card">
            <div className="company-contact-row">
              <span>Telefon</span>

              <a href="tel:+905301207402">0530 120 74 02</a>
            </div>

            <div className="company-contact-row">
              <span>Adres</span>

              <p>
                Ehlibeyt, Ceyhun Atuf Kansu Cd. Gözde Plaza No:130/52, 06530
                Çankaya/Ankara
              </p>
            </div>

            <a
              className="company-directions-link"
              href="https://www.google.com/maps/search/?api=1&query=Ehlibeyt+Ceyhun+Atuf+Kansu+Cd+Gozde+Plaza+No+130%2F52+Cankaya+Ankara"
              target="_blank"
              rel="noreferrer"
            >
              Yol tarifi alın
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="company-footer">
        <div className="company-page-shell company-footer-inner">
          <Link to="/" className="company-footer-brand">
            <img src="/mba-muhendislik-logo.png" alt="MBA Mühendislik logosu" />

            <span>
              <strong>MBA Mühendislik</strong>
              <small>Elektrik Proje & Danışmanlık</small>
            </span>
          </Link>

          <p>© 2026 MBA Mühendislik. Tüm hakları saklıdır.</p>

          <a href="#anasayfa">Yukarı dön ↑</a>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;
