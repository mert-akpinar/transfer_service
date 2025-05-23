import { useState } from "react";
import locations from "../data/locations";
import "../App.css";

const currencies = ["EUR", "USD", "GBP", "RUB", "TRY"];

export default function Home({ onNext }) {
  const [form, setForm] = useState({
    from: "",
    to: "",
    adults: 1,
    children: 0,
    currency: "EUR"
  });

  const [error, setError] = useState("");

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
  };

  return (
    <div className="reservation-card">
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>Alış Noktası:</label>
        <select name="from" value={form.from} onChange={handleChange} required>
          <option value="">Seçiniz</option>
          {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
        </select>

        <label>Varış Noktası:</label>
        <select name="to" value={form.to} onChange={handleChange} required>
          <option value="">Seçiniz</option>
          {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
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
  );
}