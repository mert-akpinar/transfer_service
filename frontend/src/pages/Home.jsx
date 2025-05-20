import { useState } from "react";
import locations from "../data/locations";

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

    // Seçim kontrolü
    if ((name === "from" && value === form.to) || (name === "to" && value === form.from)) {
      setError("Alış ve varış noktası aynı olamaz");
    } else {
      setError(""); // hata sıfırlanır
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
    <div>
      <h2>Rezervasyon Yap</h2>
      <form onSubmit={handleSubmit}>
        <label>Alış Noktası:</label>
        <select name="from" onChange={handleChange} required value={form.from}>
          <option value="">Seçiniz</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <label>Varış Noktası:</label>
        <select name="to" onChange={handleChange} required value={form.to}>
          <option value="">Seçiniz</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <label>Yetişkin:</label>
        <input type="number" name="adults" value={form.adults} onChange={handleChange} min="1" required />

        <label>Çocuk:</label>
        <input type="number" name="children" value={form.children} onChange={handleChange} min="0" />

        <label>Para Birimi:</label>
        <select name="currency" onChange={handleChange} value={form.currency}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={!!error}>Araçları Listele</button>
      </form>
    </div>
  );
}