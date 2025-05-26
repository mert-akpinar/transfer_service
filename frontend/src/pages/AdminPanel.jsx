import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch(`http://localhost/transfer_service/backend/routes/admin.php?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          const reversed = [...data].reverse(); // Yeni kayıtlar başta
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
        r.name,
        r.email,
        r.phone,
        r.selected_car?.name,
        r.selected_car?.price,
        r.pickup,
        r.dropoff,
        r.from,
        r.to,
        r.date,
        r.time,
        r.adults,
        r.children,
        r.currency,
        (r.extras || []).join(", "),
        r.note,
        r.status,
        r.createdAt,
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
        if (!data.success) alert("Durum güncellenemedi!");
      })
      .catch(() => alert("Sunucu hatası"));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const headers = [[
      "Ad", "Email", "Telefon", "Araç", "€", "Pickup", "Dropoff", "Alış", "Varış",
      "Tarih", "Saat", "Yetişkin", "Çocuk", "Para", "Ekstralar", "Not", "Durum", "Oluşturulma"
    ]];
    const data = filtered.map(r => [
      r.name, r.email, r.phone,
      r.selected_car?.name || "-", r.selected_car?.price || "-",
      r.pickup, r.dropoff, r.from, r.to,
      r.date, r.time, r.adults, r.children,
      r.currency, (r.extras || []).join(", "),
      r.note || "-", r.status || "Beklemede",
      r.createdAt ? new Date(r.createdAt).toLocaleString("tr-TR") : "-"
    ]);
    doc.autoTable({ head: headers, body: data });
    doc.save("rezervasyonlar.pdf");
  };

  const exportExcel = () => {
    const exportData = filtered.map(r => ({
      Ad: r.name,
      Email: r.email,
      Telefon: r.phone,
      Araç: r.selected_car?.name || "-",
      Euro_Tutar: r.selected_car?.price || "-",
      Pickup: r.pickup,
      Dropoff: r.dropoff,
      Alış: r.from,
      Varış: r.to,
      Tarih: r.date,
      Saat: r.time,
      Yetişkin: r.adults,
      Çocuk: r.children,
      Para: r.currency,
      Ekstralar: (r.extras || []).join(", "),
      Not: r.note || "-",
      Durum: r.status || "Beklemede",
      Oluşturulma: r.createdAt ? new Date(r.createdAt).toLocaleString("tr-TR") : "-"
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rezervasyonlar");
    XLSX.writeFile(workbook, "rezervasyonlar.xlsx");
  };

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h2>Rezervasyonlar ({filtered.length})</h2>
        <button className="logout-button" onClick={onLogout}>Çıkış Yap</button>
      </div>

      <div className="admin-panel-controls" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Ara (Ad, Email, Araç, Pickup, Tarih...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: "1 1 300px" }}
        />
        <button onClick={exportPDF}>PDF İndir</button>
        <button onClick={exportExcel}>Excel İndir</button>
      </div>

      <div className="table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Araç</th>
              <th>€</th>
              <th>Pickup</th>
              <th>Drop-off</th>
              <th>Alış</th>
              <th>Varış</th>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Yetişkin</th>
              <th>Çocuk</th>
              <th>Para</th>
              <th>Ekstralar</th>
              <th>Not</th>
              <th>Durum</th>
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
                <td>
                  <select
                    value={r.status || "Beklemede"}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    className="status-dropdown"
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

      {/* Sayfalama */}
      {pageCount > 1 && (
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
      )}
    </div>
  );
}