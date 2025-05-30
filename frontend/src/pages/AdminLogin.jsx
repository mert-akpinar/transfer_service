import { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://reservation.airportantalyavipshuttle.com/backend/routes/admin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch {
      setError("Sunucuya bağlanılamadı");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Girişi</h2>
        <input
          type="email"
          name="email"
          placeholder="Email adresi"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Giriş Yap</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}