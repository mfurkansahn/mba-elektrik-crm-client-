import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/Auth/login", {
        email,
        password,
      });

      const roles = response.data.roles ?? [];

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("roles", JSON.stringify(roles));

      if (roles.includes("Customer")) {
        navigate("/customer-portal", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("E-posta veya şifre hatalı.");
      } else {
        setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>MBA Elektrik CRM</h1>
          <p>Hesabınıza giriş yapın</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-posta: </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@mbaelektrik.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre: </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Şifrenizi girin"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
