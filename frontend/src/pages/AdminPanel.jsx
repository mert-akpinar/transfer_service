import { useEffect, useState } from "react";

const statusOptions = [
  "Beklemede",
  "Rezervasyon Onaylandı",
  "Rezervasyon Gerçekleşti",
  "Rezervasyon İptal Edildi"
];

export default function AdminPanel({ token, onLogout }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost/transfer_service/backend/routes/admin.php?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setReservations(data);
        }
      })
      .catch(() => setError("Sunucuya bağlanılamadı"));
  }, [token]);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...reservations];
    updated[index].status = newStatus;
    setReservations(updated);

    fetch("http://localhost/transfer_service/backend/routes/update-status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, status: newStatus })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert("Durum güncellenemedi!");
        }
      })
      .catch(() => alert("Sunucu hatası"));
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {/* Çıkış butonu */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button onClick={onLogout}>Çıkış Yap</button>
      </div>

      <h2>Rezervasyonlar ({reservations.length})</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Ad</th>
            <th>Email</th>
            <th>Araç</th>
            <th>Tutar (€)</th>
            <th>Alış</th>
            <th>Varış</th>
            <th>Yetişkin</th>
            <th>Çocuk</th>
            <th>Para Birimi</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.selected_car?.name}</td>
              <td>{r.selected_car?.price_eur || "-"}</td>
              <td>{r.from}</td>
              <td>{r.to}</td>
              <td>{r.adults}</td>
              <td>{r.children}</td>
              <td>{r.currency}</td>
              <td>
                <select
                  value={r.status || "Beklemede"}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
