import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import locations from "../data/locations"; // Eğer locations backend'ten gelirse bunu kaldır
import "../App.css";

const currencies = ["EUR", "USD", "GBP", "RUB", "TRY"];

export default function Home({ onNext }) {
  const [form, setForm] = useState({
    from: "", to: "", adults: 1, children: 0, currency: "EUR"
  });

  const [error, setError] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState(null); // Google API Key için state
  const navigate = useNavigate();

  useEffect(() => {
    // Backend'ten Google API Key'i çek
    fetch("http://localhost/transfer_service/backend/routes/apikey.php")
      .then((response) => response.json())
      .then((data) => {
        setGoogleApiKey(data.googleApiKey);

        // Google Maps API script'ini ekle
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.googleApiKey}&libraries=places`;
        script.async = true;
        document.body.appendChild(script);

        return () => {
          // Bileşen unmount olduğunda script'i temizle
          document.body.removeChild(script);
        };
      })
      .catch((error) => {
        console.error("API Key alınamadı:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "from" && value === form.to) || (name === "to" && value === form.from)) {
      setError("Alış ve varış noktası aynı olamaz");
    } else {
      setError("");
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.from === form.to) {
      setError("Alış ve varış noktası aynı olamaz");
      return;
    }
    onNext(form);
    navigate("/cars");
  };

  return (
    <div className="reservation-wrapper">
      <div className="reservation-card">
        <form onSubmit={handleSubmit} className="reservation-form">
          <label>Alış Noktası:</label>
          <select name="from" value={form.from} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            {locations.map((loc, idx) => (
              <option key={idx} value={loc.value}>{loc.label}</option>
            ))}
          </select>

          <label>Varış Noktası:</label>
          <select name="to" value={form.to} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            {locations.map((loc, idx) => (
              <option key={idx} value={loc.value}>{loc.label}</option>
            ))}
          </select>

          <label>Yetişkin:</label>
          <input type="number" name="adults" value={form.adults} onChange={handleChange} min="1" />

          <label>Çocuk:</label>
          <input type="number" name="children" value={form.children} onChange={handleChange} min="0" />

          <label>Para Birimi:</label>
          <select name="currency" value={form.currency} onChange={handleChange}>
            {currencies.map((cur, idx) => <option key={idx} value={cur}>{cur}</option>)}
          </select>

          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="submit-btn">Devam Et</button>
        </form>
      </div>
    </div>
  );
}