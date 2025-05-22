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
    setError("");
    onNext(form);
  };

  return (
    <div className="reservation-card"> 
      <form onSubmit={handleSubmit} className="reservation-form">
        <label htmlFor="from">Alış Noktası:</label>
        <select id="from" name="from" value={form.from} onChange={handleChange} required>
          <option value="">Seçiniz</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>

        <label htmlFor="to">Varış Noktası:</label>
        <select id="to" name="to" value={form.to} onChange={handleChange} required>
          <option value="">Seçiniz</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>

        <label htmlFor="adults">Yetişkin Sayısı:</label>
        <input type="number" id="adults" name="adults" value={form.adults} min="1" onChange={handleChange} required />

        <label htmlFor="children">Çocuk Sayısı:</label>
        <input type="number" id="children" name="children" value={form.children} min="0" onChange={handleChange} />

        <label htmlFor="currency">Para Birimi:</label>
        <select id="currency" name="currency" value={form.currency} onChange={handleChange}>
          {currencies.map((cur, idx) => (
            <option key={idx} value={cur}>{cur}</option>
          ))}
        </select>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="submit-btn">Devam Et</button>
      </form>
    </div>
  );
}
