import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const statusOptions = [
  "Beklemede",
  "Rezervasyon Onaylandı",
  "Rezervasyon Gerçekleşti",
  "Rezervasyon İptal Edildi"
];

const ITEMS_PER_PAGE = 20;

export default function AdminPanel({ token, onLogout }) {
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [rates, setRates] = useState({});
  const [savingRates, setSavingRates] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetch("http://localhost/transfer_service/backend/routes/get-rates.php")
      .then((res) => res.json())
      .then((data) => setRates(data))
      .catch(() => showNotification("Kur bilgileri alınamadı", "error"));
  }, []);

  const handleRateChange = (currency, value) => {
    setRates({ ...rates, [currency]: value });
  };

  const saveRates = () => {
    setSavingRates(true);
    fetch("http://localhost/transfer_service/backend/routes/save-rates.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rates)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showNotification("Kur bilgileri güncellendi!", "success");
        } else {
          showNotification("Hata: Kur bilgileri kaydedilemedi.", "error");
        }
      })
      .catch(() => showNotification("Sunucu hatası", "error"))
      .finally(() => setSavingRates(false));
  };

  useEffect(() => {
    fetch(`http://localhost/transfer_service/backend/routes/admin.php?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          const reversed = [...data].reverse();
          setReservations(reversed);
          setFiltered(reversed);
        }
      })
      .catch(() => setError("Sunucuya bağlanılamadı"));
  }, [token]);

  useEffect(() => {
    const term = search.toLowerCase();
    const results = reservations.filter((r) =>
      [
        r.name, r.email, r.phone, r.selected_car?.name, r.selected_car?.price,
        r.pickup, r.dropoff, r.from, r.to, r.date, r.time,
        r.adults, r.children, r.currency,
        (r.extras || []).join(", "), r.note, r.status, r.createdAt,
      ]
        .map((v) => String(v || "").toLowerCase())
        .some((val) => val.includes(term))
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [search, reservations]);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...filtered];
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    updated[globalIndex].status = newStatus;
    setFiltered([...updated]);

    fetch("http://localhost/transfer_service/backend/routes/update-status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: globalIndex, status: newStatus })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          showNotification("Durum güncellenemedi!", "error");
        } else {
          showNotification("Durum güncellendi!", "success");
        }
      })
      .catch(() => showNotification("Sunucu hatası", "error"));
  };

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="dashboard">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <a href="#" className="active">Rezervasyonlar</a>
          <a href="#">Charts</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Rezervasyonlar ({filtered.length})</h1>
        </header>

        <section className="stats">
          {["USD", "GBP", "RUB", "TRY"].map((currency) => (
            <div className="stat-card" key={currency}>
              <h3>{currency}</h3>
              <input
                type="number"
                step="0.01"
                value={rates[currency] || ""}
                onChange={(e) => handleRateChange(currency, parseFloat(e.target.value))}
                className="rate-input"
              />
            </div>
          ))}
          <button onClick={saveRates} className="save-button">
            {savingRates ? "Kaydediliyor..." : "Kurları Kaydet"}
          </button>
        </section>

        <section className="table-wrapper">
  <table className="reservation-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Ad</th>
        <th>Email</th>
        <th>Telefon</th>
        <th>Araç</th>
        <th>Fiyat</th>
        <th>Pickup</th>
        <th>Dropoff</th>
        <th>Alış</th>
        <th>Varış</th>
        <th>Tarih</th>
        <th>Saat</th>
        <th>Yetişkin</th>
        <th>Çocuk</th>
        <th>Para</th>
        <th>Ekstralar</th>
        <th>Not</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((r, index) => (
        <tr key={index}>
          <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
          <td>{r.name}</td>
          <td>{r.email}</td>
          <td>{r.phone}</td>
          <td>{r.selected_car?.name || "-"}</td>
          <td>{r.selected_car?.price || "-"}</td>
          <td>{r.pickup}</td>
          <td>{r.dropoff}</td>
          <td>{r.from}</td>
          <td>{r.to}</td>
          <td>{r.date}</td>
          <td>{r.time}</td>
          <td>{r.adults}</td>
          <td>{r.children}</td>
          <td>{r.currency}</td>
          <td>{(r.extras || []).join(", ") || "-"}</td>
          <td>{r.note || "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className="pagination">
    {Array.from({ length: pageCount }, (_, i) => (
      <button
        key={i + 1}
        className={currentPage === i + 1 ? "active" : ""}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}
  </div>
</section>
      </main>
    </div>
  );
}