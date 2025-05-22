import React, { useState } from "react";
import "../App.css";

export default function ReservationForm({ formData, selectedCar, onComplete }) {
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
    date: "",
    time: "",
    pickup: "",
    dropoff: "",
    extras: [],
  });

  const toggleExtra = (extra) => {
    setReservationData((prev) => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter((e) => e !== extra)
        : [...prev.extras, extra],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rezervasyon gönderildi:", reservationData);
    onComplete();
  };

  return (
    <form className="reservation-form-two-column" onSubmit={handleSubmit}>
      <div className="form-column">
        <h3>Personal Information</h3>

        <label>Full Name:</label>
        <input type="text" name="name" value={reservationData.name} onChange={handleChange} required />

        <label>E-Mail:</label>
        <input type="email" name="email" value={reservationData.email} onChange={handleChange} required />

        <label>Phone:</label>
        <input type="tel" name="phone" value={reservationData.phone} onChange={handleChange} required />

        <label>Do you have a note for us?:</label>
        <textarea name="note" rows={4} value={reservationData.note} onChange={handleChange} />
      </div>

      <div className="form-column">
        <h3>Arrival Transfer Information</h3>

        <label>Meeting Date:</label>
        <input type="date" name="date" value={reservationData.date} onChange={handleChange} required />

        <label>Meeting Time:</label>
        <input type="time" name="time" value={reservationData.time} onChange={handleChange} required />

        <label>Pickup Address / Hotel Name:</label>
        <input type="text" name="pickup" value={reservationData.pickup} onChange={handleChange} required />

        <label>Drop-off Address / Hotel Name:</label>
        <input type="text" name="dropoff" value={reservationData.dropoff} onChange={handleChange} required />

        <div className="extras-section">
          <p>Do you want any extras in the vehicle?</p>

          <button
            type="button"
            onClick={() => toggleExtra("Baby Seat")}
            className={`extra-btn ${reservationData.extras.includes("Baby Seat") ? "selected" : ""}`}
          >
            {reservationData.extras.includes("Baby Seat") ? "✓ Baby Seat" : "I want a baby seat +"}
          </button>

          <button
            type="button"
            onClick={() => toggleExtra("Cold Drinks")}
            className={`extra-btn ${reservationData.extras.includes("Cold Drinks") ? "selected" : ""}`}
          >
            {reservationData.extras.includes("Cold Drinks") ? "✓ Cold Drinks" : "Cold Drinks +"}
          </button>
        </div>

        <button type="submit" className="submit-btn">Confirm Reservation</button>
      </div>
    </form>
  );
}