import { useState } from "react";

export default function ReservationForm({ formData, selectedCar, onComplete }) {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      selected_car: selectedCar,
      ...info
    };

    try {
      const res = await fetch("http://localhost/transfer_service/backend/routes/reserve.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        alert("Rezervasyon başarıyla alındı!");
        onComplete();
      } else {
        alert("Hata: " + (result.error || "Bilinmeyen hata"));
      }
    } catch (err) {
      console.error("Rezervasyon hatası:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div>
      <h2>Bilgilerinizi Girin</h2>
      <form onSubmit={handleSubmit}>
        <label>Ad Soyad:</label>
        <input type="text" name="name" onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" onChange={handleChange} required />

        <label>Telefon:</label>
        <input type="tel" name="phone" onChange={handleChange} required />

        <button type="submit">Rezervasyonu Gönder</button>
      </form>
    </div>
  );
}
