import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function ReservationForm({ formData, selectedCar }) {
  const [reservationData, setReservationData] = useState({
    name: "", email: "", phone: "", note: "",
    date: "", time: "", pickup: "", dropoff: "", extras: []
  });

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const toggleExtra = (extra) => {
    setReservationData((prev) => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter((e) => e !== extra)
        : [...prev.extras, extra]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...reservationData,
    ...formData,
    selected_car: selectedCar || { name: "Bilinmiyor", price: 0, id: null },
    created_at: new Date().toISOString()
  };

  try {
    const response = await fetch("https://reservation.airportantalyavipshuttle.com/backend/routes/reserve.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Sunucu hatası");
    }

    setSuccess(true);
    setReservationData({
      name: "", email: "", phone: "", note: "",
      date: "", time: "", pickup: "", dropoff: "", extras: []
    });

    formRef.current?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      setSuccess(false);
      navigate("/");
    }, 2000);
  } catch (error) {
    alert("Rezervasyon gönderilemedi: " + error.message);
  }
};

  return (
    <div className="reservation-wrapper" ref={formRef}>
      <form className="reservation-form-two-column" onSubmit={handleSubmit}>
        {success && (
          <div className="notification-inside-card">
            ✓ Rezervasyon başarıyla gönderildi!
          </div>
        )}

        <div className="form-column" style={{ flexBasis: "100%" }}>
          <button className="back-btn" type="button" onClick={() => navigate("/cars")}>← Geri</button>
        </div>

        <div className="form-column">
          <h3>Kişisel Bilgiler</h3>
          <label>İsim-Soyisim:</label>
          <input type="text" name="name" value={reservationData.name} onChange={handleChange} required />
          <label>E-Mail:</label>
          <input type="email" name="email" value={reservationData.email} onChange={handleChange} required />
          <label>Telefon:</label>
          <input type="tel" name="phone" value={reservationData.phone} onChange={handleChange} required />
          <label>Eklemek İstediğiniz Not:</label>
          <textarea name="note" rows={4} value={reservationData.note} onChange={handleChange} />
        </div>

        <div className="form-column">
          <h3>Transfer Bilgileriniz</h3>
          <label>Buluşma Tarihi:</label>
          <input type="date" name="date" value={reservationData.date} onChange={handleChange} required />
          <label>Buluşma Zamanı:</label>
          <input type="time" name="time" value={reservationData.time} onChange={handleChange} required />
          <label>Alış Adresi:</label>
          <input type="text" name="pickup" value={reservationData.pickup} onChange={handleChange} required />
          <label>Varış Adresi:</label>
          <input type="text" name="dropoff" value={reservationData.dropoff} onChange={handleChange} required />

          <div className="extras-section">
            <p>Extra:</p>
            <button type="button" onClick={() => toggleExtra("Baby Seat")}
              className={`extra-btn ${reservationData.extras.includes("Baby Seat") ? "selected" : ""}`}>
              {reservationData.extras.includes("Baby Seat") ? "✓ Bebek Koltuğu" : "Bebek Koltuğu istiyorum. +"}
            </button>
            <button type="button" onClick={() => toggleExtra("Cold Drinks")}
              className={`extra-btn ${reservationData.extras.includes("Cold Drinks") ? "selected" : ""}`}>
              {reservationData.extras.includes("Cold Drinks") ? "✓ Soğuk İçecek" : "Soğuk İçecek +"}
            </button>
          </div>

          <button type="submit" className="submit-btn">Rezervasyon Oluştur</button>
        </div>
      </form>
    </div>
  );
}